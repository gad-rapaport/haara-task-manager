from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
import uuid
import re
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv

# טעינת משתני הסביבה (API KEY)
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "db.json"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def load_db():
    if not os.path.exists(DB_FILE):
        return {"summaries": [], "tasks": []}
    with open(DB_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_db(data):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

class SummaryCreate(BaseModel):
    date: str
    content: str

class TaskCreate(BaseModel):
    title: str
    description: str
    owner: str
    currentHandler: Optional[str] = None
    urgency: str
    importance: str
    effort: str
    status: str
    summaryId: str

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    owner: Optional[str] = None
    currentHandler: Optional[str] = None
    urgency: Optional[str] = None
    importance: Optional[str] = None
    effort: Optional[str] = None
    status: Optional[str] = None

@app.get("/api/summaries")
def get_summaries():
    return load_db()["summaries"]

@app.post("/api/summaries")
def create_summary(summary: SummaryCreate):
    db = load_db()
    new_summary = {
        "id": str(uuid.uuid4()),
        "date": summary.date,
        "content": summary.content,
        "createdAt": datetime.now().isoformat(),
        "updatedAt": datetime.now().isoformat()
    }
    db["summaries"].append(new_summary)
    
    tasks_created = False

    # 1. ניסיון פענוח באמצעות AI (אם יש מפתח זמין)
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel('gemini-2.5-flash')
            prompt = f"""
            You are a smart assistant for an Israeli company. 
            Read the following daily summary in Hebrew. Extract all action items/tasks.
            Return ONLY a valid JSON array of objects. Do not include markdown formatting like ```json.
            Each object must have these exact keys:
            "title" (string, short action title),
            "description" (string, full context),
            "owner" (string, extract the responsible person's name or return "לא מוגדר"),
            "urgency" (string, choose: "low", "medium", "high"),
            "importance" (string, choose: "low", "medium", "high")

            Summary: {summary.content}
            """
            response = model.generate_content(prompt)
            raw_text = response.text.strip().removeprefix("```json").removesuffix("```").strip()
            ai_tasks = json.loads(raw_text)

            for at in ai_tasks:
                new_task = {
                    "id": str(uuid.uuid4()),
                    "title": at.get("title", "משימה חדשה"),
                    "description": at.get("description", ""),
                    "owner": at.get("owner", "לא מוגדר"),
                    "currentHandler": "",
                    "urgency": at.get("urgency", "medium"),
                    "importance": at.get("importance", "medium"),
                    "effort": "medium",
                    "status": "open",
                    "summaryId": new_summary["id"],
                    "createdAt": datetime.now().isoformat(),
                    "updatedAt": datetime.now().isoformat()
                }
                db["tasks"].append(new_task)
                tasks_created = True
        except Exception as e:
            print(f"AI Parse Failed, falling back to Regex: {e}")

    # 2. גיבוי (Fallback) - אם אין AI או שה-API נפל, מנתח טקסט טיפש
    if not tasks_created:
        lines = re.split(r'[.\n]', summary.content)
        for line in lines:
            if "משימה:" in line or "לביצוע:" in line:
                new_task = {
                    "id": str(uuid.uuid4()),
                    "title": line.strip()[:40],
                    "description": line.strip(),
                    "owner": "לא מוגדר",
                    "currentHandler": "",
                    "urgency": "medium",
                    "importance": "high",
                    "effort": "small",
                    "status": "open",
                    "summaryId": new_summary["id"],
                    "createdAt": datetime.now().isoformat(),
                    "updatedAt": datetime.now().isoformat()
                }
                db["tasks"].append(new_task)
                tasks_created = True

    save_db(db)
    return new_summary

@app.get("/api/tasks")
def get_tasks(owner: Optional[str] = None, currentHandler: Optional[str] = None, status: Optional[str] = None):
    db = load_db()
    tasks = db["tasks"]
    if owner:
        tasks = [t for t in tasks if t.get("owner") == owner]
    if currentHandler:
        tasks = [t for t in tasks if t.get("currentHandler") == currentHandler]
    if status:
        tasks = [t for t in tasks if t.get("status") == status]
    return tasks

@app.get("/api/tasks/{task_id}")
def get_task(task_id: str):
    db = load_db()
    for t in db["tasks"]:
        if t["id"] == task_id:
            return t
    raise HTTPException(status_code=404, detail="Task not found")

@app.post("/api/tasks")
def create_task(task: TaskCreate):
    db = load_db()
    new_task = task.dict()
    new_task["id"] = str(uuid.uuid4())
    new_task["createdAt"] = datetime.now().isoformat()
    new_task["updatedAt"] = datetime.now().isoformat()
    db["tasks"].append(new_task)
    save_db(db)
    return new_task

@app.patch("/api/tasks/{task_id}")
def update_task(task_id: str, task_update: TaskUpdate):
    db = load_db()
    for t in db["tasks"]:
        if t["id"] == task_id:
            update_data = task_update.dict(exclude_unset=True)
            t.update(update_data)
            t["updatedAt"] = datetime.now().isoformat()
            save_db(db)
            return t
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: str):
    db = load_db()
    initial_len = len(db["tasks"])
    db["tasks"] = [t for t in db["tasks"] if t["id"] != task_id]
    if len(db["tasks"]) == initial_len:
        raise HTTPException(status_code=404, detail="Task not found")
    save_db(db)
    return {"message": "Task deleted"}