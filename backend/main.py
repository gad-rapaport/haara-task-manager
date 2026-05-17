from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import json
import os
import uuid
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv
from models import SummaryCreate, TaskCreate, TaskUpdate

# Load environment variables
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("[WARNING] GEMINI_API_KEY not found in .env file.")

DB_FILE = "db.json"

def load_db():
    if not os.path.exists(DB_FILE) or os.path.getsize(DB_FILE) == 0:
        return {"summaries": [], "tasks": []}
    try:
        with open(DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
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
    
    tasks_added_count = 0
    
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = f"""
            אתה עוזר ניהולי מומחה לניתוח טקסט וחילוץ משימות. 
            נתח את הטקסט בעברית הבא ובצע את הפעולות הבאות:
            
            1. זהה שמות פרטיים ומי האחראי הכולל (Owner) לעומת מי המטפל בפועל כרגע (Current Handler).
            2. חלץ את המשימות:
               - "title": תמצת משימה (עד 5 מילים).
               - "description": הרחב את התיאור עם כל הפרטים.
            3. מלא שדות:
               - "owner": אחראי (או "לא מוגדר").
               - "currentHandler": מטפל כרגע (או חלל ריק "").
               - "urgency": "low"/"medium"/"high".
               - "importance": "low"/"medium"/"high".
               - "effort": "small"/"medium"/"large".

            חזור אך ורק בתצורת JSON array של אובייקטים.
            הטקסט לניתוח: {summary.content}
            """
            
            response = model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            
            ai_tasks = json.loads(response.text)
            
            # FIX 1: הוסרה הדפסת הטקסט בעברית לקונסול כדי למנוע קריסת Unicode בווינדוס
            print(f"[INFO] AI generated {len(ai_tasks)} potential tasks.") 
            
            if ai_tasks:
                for at in ai_tasks:
                    try:
                        # FIX 2: העברת התוצאה של ה-AI דרך Pydantic לוולידציה!
                        validated_task = TaskCreate(
                            title=at.get("title", "משימה ללא כותרת")[:50],
                            description=at.get("description", ""),
                            owner=at.get("owner", "לא מוגדר"),
                            currentHandler=at.get("currentHandler", ""),
                            urgency=at.get("urgency", "medium"),
                            importance=at.get("importance", "medium"),
                            effort=at.get("effort", "medium"),
                            status="open",
                            summaryId=new_summary["id"]
                        )
                        
                        new_task_dict = validated_task.model_dump()
                        new_task_dict["id"] = str(uuid.uuid4())
                        new_task_dict["createdAt"] = datetime.now().isoformat()
                        new_task_dict["updatedAt"] = datetime.now().isoformat()
                        
                        db["tasks"].append(new_task_dict)
                        tasks_added_count += 1
                    except Exception as validation_error:
                        print("[WARNING] An AI generated task failed Pydantic validation and was skipped.")

        except Exception as e:
            # הדפסה בטוחה ללא משתנים שעלולים להכיל תווים בעייתיים
            print("[ERROR] AI Parse Failed or Network Error.")

    save_db(db)
    
    # FIX 3: החזרת מספר המשימות שנוצרו כדי שהפרונטאנד ידע אם הייתה הצלחה אמיתית
    return {
        "summary": new_summary,
        "tasksCreated": tasks_added_count
    }

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