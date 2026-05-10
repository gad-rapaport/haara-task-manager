from pydantic import BaseModel
from typing import Optional, Literal

class SummaryCreate(BaseModel):
    date: str
    content: str

class TaskCreate(BaseModel):
    title: str
    description: str = ""
    owner: str = "לא מוגדר"
    currentHandler: str = ""
    urgency: Literal["low", "medium", "high"] = "medium"
    importance: Literal["low", "medium", "high"] = "medium"
    effort: Literal["small", "medium", "large"] = "medium"
    status: Literal["open", "in_progress", "paused", "done"] = "open"
    summaryId: str

class TaskUpdate(BaseModel):
    status: Optional[Literal["open", "in_progress", "paused", "done"]] = None
    currentHandler: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    owner: Optional[str] = None