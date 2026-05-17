# 💡 מערכת ניהול משימות - הארה

<div align="right">

**מערכת חכמה ומינימליסטית לניהול משימות מתוך סיכומי יום**

[English](#english) • [עברית](#hebrew)

</div>

---

## <a name="hebrew"></a>🇮🇱 עברית

### 📋 סקירה כללית

מערכת ניהול משימות **MVP** מלאה, שפותחה כמענה למשימת בית של חברת הארה. המערכת מאפשרת ניהול משימות בעברית עם תמיכה מלאה ב-AI לחילוץ משימות מסיכומים יומיים.

---

### 🎯 יכולות (Features) - נתמכות במלואן

✨ **ניתוח AI אוטומטי** - חילוץ משימות מתוך סיכומים בעברית בעזרת מודל Gemini, כולל ולידציה קשוחה למניעת הזיות נתונים.

🎨 **לוח Kanban אינטראקטיבי** - גרירה וזריקה (Drag & Drop) בין עמודות למעקב סטטוס.

📊 **סינון דינמי מתקדם (זמן אמת)**:
- סינון טקסטואלי לפי אחראי (Owner)
- סינון טקסטואלי לפי מטפל נוכחי (Current Handler)
- סינון לפי תאריך משימה (כולל תצוגת תאריך על כל כרטיסייה)
- סינון לפי סטטוס (פתוח, בטיפול, בהשהייה, בוצע)

📈 **חיווי מצב** - תצוגה מסכמת של ספירת משימות לפי סטטוסים בראש הלוח.

📥 **ייצוא מאובטח ל-CSV** - הורדת הנתונים ל-Excel עם תמיכה בעברית והגנה מובנית מפני CSV Injection.

📱 **רספונסיביות מלאה** - ממשק RTL מותאם לדסקטופ ולמובייל.

---

### 🤖 הצהרת שימוש בבינה מלאכותית וניהול שגיאות

- 🧠 **ניתוח טקסט**: חילוץ ישיר לפורמט JSON מובנה.
- 🛡️ **אבטחת נתונים (Boundary Protection)**: כל משימה שמגיעה מה-AI עוברת אימות (Pydantic Validation). משימות עם ערכים לא חוקיים נפסלות ולא נכנסות לבסיס הנתונים.
- 🔄 **Smart Fallback**: חיווי משתמש מדויק (UI Toasts) המבדיל בין שגיאת רשת, הצלחה מלאה, או מצב בו השרת פעל אך לא חולצו משימות מהטקסט.

---

### 🚀 מדריך התקנה והרצה

#### 1. Backend Setup (Windows)
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
חובה ליצור קובץ .env בתיקיית ה-backend ולהוסיף: GEMINI_API_KEY=your_key_here

הרצה: uvicorn main:app --reload (השרת ירוץ על פורט 8000).

2. Frontend Setup
Bash
cd frontend
npm install
npm run dev
האפליקציה תרוץ על פורט 5173.

🇺🇸 English
📋 Overview
A complete MVP task management system, developed as a take-home assignment for Haara. Full Hebrew support with AI-powered, strictly-validated task extraction from daily summaries.

🎯 Verified Features
✨ Automatic AI Analysis - Extract tasks from Hebrew summaries using Gemini, protected by strict backend data validation to prevent AI hallucinations.

🎨 Interactive Kanban Board - Drag & drop between columns to track status.

📊 Advanced Dynamic Filtering:

Text filter by Owner

Text filter by Current Handler

Date picker filter (with visual date tags on cards)

Dropdown filter by Status

📈 Status Counters - Live counting of tasks per column.

📥 Secure CSV Export - Export data to Excel with full Hebrew support and built-in CSV Injection protection.

📱 Full Responsiveness - RTL interface adapted for all screen sizes.

🚀 Installation & Setup
1. Backend Setup (Windows)
Bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
Create a .env file in the backend folder and add: GEMINI_API_KEY=your_key_here

Run: uvicorn main:app --reload (Runs on port 8000).

2. Frontend Setup
Bash
cd frontend
npm install
npm run dev
Runs on port 5173.
