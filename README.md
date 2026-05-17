
# 💡 מערכת ניהול משימות - הארה

מערכת חכמה לניהול משימות מתוך סיכומי יום עם תמיכה בעברית ו‑AI.

## ✨ יכולות

- חילוץ משימות אוטומטי בעזרת Gemini AI
- לוח Kanban עם Drag & Drop
- סינון לפי:
  - אחראי
  - מטפל נוכחי
  - תאריך
  - סטטוס
- חיווי סטטוסים בזמן אמת
- ייצוא CSV מאובטח
- RTL מלא + רספונסיביות

## 🤖 AI ואבטחה

- כל משימה עוברת ולידציית Pydantic
- מניעת הזיות AI
- חיווי חכם למצבי שגיאה או אי־מציאת משימות
- תמיכה במקרה קצה של DB ריק

## 🚀 התקנה

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

צרו קובץ `.env`:

```env
GEMINI_API_KEY=your_key_here
```

הרצה:

```bash
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: פורט 5173  
Backend: פורט 8000
