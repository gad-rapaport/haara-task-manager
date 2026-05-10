from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from models import SummaryCreate, TaskCreate, TaskUpdate
from typing import List, Optional, Literal
import json
import os
import uuid
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development. In production, restrict to actual origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Google Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("[WARNING] GEMINI_API_KEY not found in .env file. Falling back to basic parsing.")

DB_FILE = "db.json"

def load_db():
    # בדיקה אם הקובץ לא קיים או שהוא ריק (גודל 0)
    if not os.path.exists(DB_FILE) or os.path.getsize(DB_FILE) == 0:
        return {"summaries": [], "tasks": []}
    
    try:
        with open(DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
        # אם הקובץ מכיל טקסט אבל הוא לא JSON תקין
        print("[WARNING] db.json was corrupted. Initializing new database.")
        return {"summaries": [], "tasks": []}

def save_db(db):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

# --- API Endpoints ---

@app.get("/api/summaries")
def get_summaries():
    db = load_db()
    return db["summaries"]

@app.post("/api/summaries")
def create_summary(summary: SummaryCreate):
    db = load_db()
    new_summary = {
        "id": str(uuid.uuid4()),
        "date": summary.date,
        "content": summary.content,
        "createdAt": datetime.now().isoformat()
    }
    db["summaries"].append(new_summary)
    
    tasks_created = False
    
    # 1. AI Parsing attempt
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel('gemini-2.5-flash')
            # Updated Prompt: Clear distinction between owner and currentHandler
            prompt = f"""
            אתה עוזר ניהולי מומחה לניתוח טקסט וחילוץ משימות. 
            נתח את הטקסט בעברית הבא ובצע את הפעולות הבאות עבור כל משימה שאתה מזהה:
            
            1. זהה שמות פרטיים שמופיעים בטקסט.
            2. זהה את התפקיד של כל שם: מי האחראי הכולל (Owner) ומי המטפל בפועל כרגע (Current Handler).
               - דוגמה: "יוסי אחראי ודני מטפל" -> אחראי: יוסי, מטפל נוכחי: דני.
            3. חלץ את תוכן המשימה:
               - עבור שדה "title": תמצת את המשימה לכותרת קצרה ועניינית (עד 5 מילים).
               - עבור שדה "description": הרחב את תיאור המשימה וכלול את כל הפרטים הרלוונטיים מהטקסט.
            4. מלא את השדות הבאים ב-JSON:
               - "owner": השם שזוהה כאחראי (אם לא זוהה שם, כתוב "לא מוגדר").
               - "currentHandler": השם שזוהה כמי שמבצע את העבודה בפועל (אם לא זוהה, השאר מחרוזת ריקה "").
               - "urgency": "low"/"medium"/"high".
               - "importance": "low"/"medium"/"high".
               - "effort": "small"/"medium"/"large".

            חזור אך ורק בתצורת JSON array של אובייקטים.
            
            הטקסט לניתוח:
            {summary.content}
            """
            
            response = model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            
            ai_tasks = json.loads(response.text)
            print(f"[INFO] AI raw output: {ai_tasks}") 
            
            if ai_tasks:
                for at in ai_tasks:
                    new_task = {
                        "id": str(uuid.uuid4()),
                        "title": at.get("title", "משימה ללא כותרת")[:50],
                        "description": at.get("description", ""),
                        "owner": at.get("owner", "לא מוגדר"),
                        "currentHandler": at.get("currentHandler", ""),
                        "urgency": at.get("urgency", "medium"),
                        "importance": at.get("importance", "medium"),
                        "effort": at.get("effort", "medium"),
                        "status": "open",
                        "summaryId": new_summary["id"],
                        "createdAt": datetime.now().isoformat(),
                        "updatedAt": datetime.now().isoformat()
                    }
                    db["tasks"].append(new_task)
                tasks_created = True
                print("[SUCCESS] AI successfully generated tasks!")
            else:
                print("[INFO] AI decided there are no tasks in this text.")

        except Exception as e:
            print(f"[ERROR] AI Parse Failed: {e}")

    # 2. Fallback Parsing (if AI fails or key is missing)
    if not tasks_created:
        lines = summary.content.split('\n')
        for line in lines:
            if line.strip().startswith('משימה:'):
                task_text = line.replace('משימה:', '').strip()
                new_task = {
                    "id": str(uuid.uuid4()),
                    "title": task_text[:50],
                    "description": task_text,
                    "owner": "לא מוגדר",
                    "currentHandler": "",
                    "urgency": "medium",
                    "importance": "medium",
                    "effort": "medium",
                    "status": "open",
                    "summaryId": new_summary["id"],
                    "createdAt": datetime.now().isoformat(),
                    "updatedAt": datetime.now().isoformat()
                }
                db["tasks"].append(new_task)

    save_db(db)
    return new_summary

@app.get("/api/tasks")
def get_tasks(owner: Optional[str] = None, currentHandler: Optional[str] = None, status: Optional[str] = None):
    db = load_db()
    tasks = db["tasks"]
    
    if owner:
        tasks = [t for t in tasks if owner in t.get("owner", "")]
    if currentHandler:
        tasks = [t for t in tasks if currentHandler in t.get("currentHandler", "")]
    if status:
        tasks = [t for t in tasks if t.get("status") == status]
        
    return tasks

@app.get("/api/tasks/{task_id}")
def get_task(task_id: str):
    db = load_db()
    for task in db["tasks"]:
        if task["id"] == task_id:
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.post("/api/tasks")
def create_task(task: TaskCreate):
    db = load_db()
    task_dict = task.model_dump()
    task_dict["id"] = str(uuid.uuid4())
    task_dict["createdAt"] = datetime.now().isoformat()
    task_dict["updatedAt"] = datetime.now().isoformat()
    
    db["tasks"].append(task_dict)
    save_db(db)
    return task_dict

@app.patch("/api/tasks/{task_id}")
def update_task(task_id: str, updates: TaskUpdate):
    db = load_db()
    for task in db["tasks"]:
        if task["id"] == task_id:
            update_data = updates.model_dump(exclude_unset=True)
            task.update(update_data)
            task["updatedAt"] = datetime.now().isoformat()
            save_db(db)
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: str):
    db = load_db()
    initial_length = len(db["tasks"])
    db["tasks"] = [task for task in db["tasks"] if task["id"] != task_id]
    
    if len(db["tasks"]) == initial_length:
        raise HTTPException(status_code=404, detail="Task not found")
        
    save_db(db)
    return {"message": "Task deleted successfully"}