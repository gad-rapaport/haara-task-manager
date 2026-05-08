# Haara Task Manager — MVP

English / עברית

---

Overview
--------
An end-to-end Minimal Viable Product (MVP) for extracting and managing tasks from daily summaries. Built as a take-home assignment for Haara, the app focuses on a minimalist RTL UI, smooth data flow, and a pause/snooze task mechanism.

מבט כללי
--------
מוצר מינימלי מלא לניהול משימות המופקות מתוך סיכומי יום. פותח למטרת משימת בית עבור חברת "הארה" ומתמקד בממשק מינימליסטי (RTL), זרימת נתונים חלקה ומנגנון השהייה למשימות.

Tech Stack / טכנולוגיות
----------------------
- Frontend: React (Vite) + Tailwind CSS (RTL support)
- Backend: Python + FastAPI
- Storage: file-based JSON (`db.json`) for simple local testing
- Parsing: lightweight mock parsing on the backend to extract tasks from text

תשתית טכנולוגית
----------------
- פרונטאנד: React (Vite) + Tailwind CSS (תמיכה ב-RTL)
- בקאנד: Python + FastAPI
- אחסון: קובץ JSON (`db.json`) לנוחות ובדיקות מקומיות
- ניתוח טקסט: מימוש Mock בשרת לצורך חיתוך משימות מטקסט

Features / תכונות מרכזיות
--------------------------
- Create / read / update / pause tasks
- Parse tasks from plain-text daily summaries (mock)
- RTL-ready UI with minimal design

פיצ'רים
-------
- יצירה / קריאה / עדכון / השהיית משימות
- חיתוך משימות מטקסט חופשי של סיכומי יום (מימוש Mock)
- ממשק RTL נקי ופשוט

Quick Start — Run Locally / הפעלה מקומית מהירה
-------------------------------------------

Backend (FastAPI)

1. Open a terminal and change to the backend folder:

```powershell
cd backend
```

2. Create and activate a virtual environment:

```powershell
python -m venv venv
.\venv\Scripts\activate    # Windows
# source venv/bin/activate  # macOS / Linux
```

3. Install Python dependencies:

```powershell
pip install -r requirements.txt
```

4. Run the development server:

```powershell
uvicorn main:app --reload
```

The backend will be available at: http://localhost:8000

Frontend (React + Vite)

1. Open a new terminal and change to the frontend folder:

```bash
cd frontend
```

2. Install Node dependencies and start the dev server:

```bash
npm install
npm run dev
```

The frontend typically runs at: http://localhost:5173

מדריך הפעלה מהירה — בקצרה

בקאנד (FastAPI)

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

פרונטאנד (React)

```bash
cd frontend
npm install
npm run dev
```

API Endpoints (example) / נקודות קצה לדוגמה
--------------------------------------------
- `GET /tasks` — list tasks
- `POST /tasks` — create a task
- `PATCH /tasks/{id}` — update a task (including pause/resume)
- `POST /parse` — send a free-text daily summary and receive parsed tasks (mock)

נקודות קצה (דוגמה)
-------------------
- `GET /tasks` — רשימת משימות
- `POST /tasks` — יצירת משימה
- `PATCH /tasks/{id}` — עדכון משימה (כולל השהייה/החזרה)
- `POST /parse` — שליחת טקסט סיכום יום וקבלת משימות מפורקות (Mock)

Notes / הערות
-------------
- The project uses `db.json` for simple local persistence; migrating to a production DB (e.g., PostgreSQL) is straightforward.
- AI/text parsing is mocked in the backend — replace with a real AI integration when ready.

הערות
-----
- הפרויקט משתמש ב-`db.json` לאחסון פשוט למטרות בדיקה מקומית; מעבר למסד נתונים מלא (למשל PostgreSQL) אפשרי בקלות.
- ניתוח הטקסט הוא Mock בצד השרת — לחיבור אמיתי של מודל AI יש להחליף את המימוש.

Future improvements / שיפורים עתידיים
-------------------------------------
- Add frontend filters by `currentHandler` and status
- Integrate a real AI service for text parsing
- Migrate storage to a relational DB and add migrations

שיפורים עתידיים
----------------
- הוספת סינונים בממשק לפי `currentHandler` וסטטוס
- חיבור לשירות AI אמיתי לחיתוך טקסט
- מעבר אחסון למסד נתונים רלציוני והוספת מיגרציות

License / רישיון
-----------------
This project is provided for demonstration and assessment purposes.

הרישיון
-------
הפרויקט נמסר לצורכי הדגמה והערכת משימה.

Contact / יצירת קשר
---------------------
For questions or feedback, open an issue or contact the author.

ליצירת קשר
-----------
לשאלות או משוב — פתח Issue או פנה למחבר.
