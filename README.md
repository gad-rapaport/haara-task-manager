# Haara Task Manager - MVP

מערכת Full Stack לניהול משימות מתוך סיכומי יום, פותחה כמענה למשימת הבית של חברת "הארה". 
המערכת מתמקדת בממשק מינימליסטי, זרימת נתונים חלקה, ועמידה בדרישות הליבה (כולל מנגנון ה"השהייה").

## 🛠️ Tech Stack & Architecture

* **Frontend:** React.js (Vite) + Tailwind CSS.
  * **החלטה עיצובית:** הממשק נבנה מתוך חשיבה על מינימליזם (RTL מלא, מעברי צבע עדינים, אנימציות כניסה חלקה).
* **Backend:** Python (FastAPI). 
  * **החלטה ארכיטקטונית:** שימוש ב-FastAPI בשל הולידציות המובנות (Pydantic) והמהירות. 
* **Database:** `db.json` (File-based storage). נבחר כדי לאפשר בחינה מהירה וחלקה של ה-MVP ללא צורך בהקמת תשתיות DB מקומיות אצל הבוחן.
* **Text Parsing:** מבוצע Mock Parsing בסיסי בשרת המדמה גזירת משימה מתוך טקסט הפוסט, בהתאם לאפשרויות שהוצגו במשימה.

## 🤖 AI Usage

נעשה שימוש במנוע AI (Gemini) כשותף תכנותי (Pair Programmer) לאורך הפיתוח:
1. בניית ה-Boilerplate ל-FastAPI ו-React.
2. הגדרות תצורה של Tailwind CSS לתמיכה בצבעי המותג ו-RTL.
3. ייעוץ ארכיטקטוני (חלוקת המודלים בשרת והפרדת הראוטים). 
*הלוגיקה העסקית, ההחלטות על מבנה ה-State וה-UI נכתבו ונוהלו על ידי.*

## 🚀 How to Run Locally

### 1. Backend (FastAPI)
1. Navigate to `/backend`
2. Create virtual environment: `python -m venv venv`
3. Activate it: 
   * Windows: `.\venv\Scripts\activate`
   * Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `uvicorn main:app --reload` (Runs on http://localhost:8000)

### 2. Frontend (React)
1. Navigate to `/frontend`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev` (Usually runs on http://localhost:5173)

## ⏳ Future Improvements (If I had more time)
בהתאם לעקרון ה-MVP של "איכות על פני כמות", השארתי מספר פיצ'רים לשלב הבא:
* **Frontend Filters:** הוספת סינון ב-UI לפי `currentHandler` (הלוגיקה בשרת כבר קיימת ונתמכת).
* **AI Integration:** חיבור אמיתי ל-OpenAI API בשכבת ה-Backend כדי לפלטר את המשימות מתוך טקסט הסיכום באמצעות Prompt Engineering.
* **Database:** מיגרציה ל-PostgreSQL באמצעות SQLAlchemy.