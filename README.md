# 💡 מערכת ניהול משימות - הארה

<div align="center">

**מערכת חכמה ומינימליסטית לניהול משימות מתוך סיכומי יום**

[English](#english) • [עברית](#hebrew)

</div>

---

## <a name="hebrew"></a>🇮🇱 עברית

### 📋 סקירה כללית

מערכת ניהול משימות **MVP** מלאה, שפותחה כמענה למשימת בית של חברת הארה. המערכת מאפשרת:

- ✨ **חילוץ אוטומטי של משימות** מתוך סיכומי יום בעברית
- 🎯 **סינון דינמי** לפי סטטוס ואחראי
- ⏸️ **מנגנון השהייה** לניהול מטלות
- 🌍 **ממשק RTL מלא** בעברית

---

### 🛠️ טכנולוגיות (Tech Stack)

| קומפוננטה | טכנולוגיה |
|---|---|
| **Frontend** | React 18 + Vite + Tailwind CSS + Lucide Icons |
| **Backend** | Python 3.10+ + FastAPI + Uvicorn |
| **AI Engine** | Google Gemini (gemini-2.5-flash) |
| **Database** | JSON File-based Storage |

---

### 🏗️ ארכיטקטורה וחלטות טכניות

#### 🔧 בחירת FastAPI
- ⚡ ביצועים גבוהים עם תמיכה async
- 📚 תיעוד אוטומטי (Swagger UI)
- ✅ ולידציה מובנית עם Pydantic

#### 💾 מסד נתונים מקומי
- 🚀 הרצה מיידית ללא הגדרות מורכבות
- 📁 שמירה פשוטה ל-JSON

#### 🎨 עיצוב ממשק
- 📱 רספונסיבי עם Tailwind CSS
- ↔️ תמיכה מלאה RTL (ימין לשמאל)
- 🧹 ממשק נקי ומינימליסטי

#### 🧠 שילוב LLM
- **מודל:** Google Gemini 2.5 Flash
- **פעולה:** ניתוח אוטומטי של סיכומים וחילוץ משימות
- **fallback חכם:** אם API לא זמין, המערכת עדיין פעילה עם הודעות ברורות

---

### 🚀 הוראות התקנה והרצה

#### 1️⃣ Backend Setup

```bash
cd backend

# יצירת סביבה וירטואלית
python -m venv venv

# הפעלה
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# התקנת תלויות
pip install -r requirements.txt
```

#### 🔑 הגדרת API (אופציונלי)

לשימוש בבינה המלאכותית, צור קובץ `.env` בתוך `backend/`:

```env
GEMINI_API_KEY=your_api_key_here
```

#### ▶️ הרצת השרת

```bash
python -m uvicorn main:app --reload
```

🌐 השרת יפעל ב: **http://localhost:8000**

---

#### 2️⃣ Frontend Setup

```bash
cd frontend

# התקנת dependencies
npm install

# הרצה בדוקומנטציה
npm run dev
```

🌐 האפליקציה תפעל ב: **http://localhost:5173**

---

### 📡 API Endpoints

| Method | Endpoint | תיאור |
|--------|----------|-------|
| `GET` | `/tasks` | רשימת כל המשימות |
| `POST` | `/tasks` | יצירת משימה חדשה |
| `PATCH` | `/tasks/{id}` | עדכון משימה (כולל השהייה) |
| `POST` | `/parse` | ניתוח סיכום יום וחילוץ משימות |

---

### 🤖 הצהרת שימוש בבינה מלאכותית

**בהתאם להנחיות המשימה**, פרויקט זה פותח עם סיוע AI כשותף פיתוח:

#### 🤝 שימוש בـ AI:
- יצירת מבנה הפרויקט הראשוני
- הגדרות Tailwind וסביבת עיצוב
- פתרון בעיות התקנה וקונפיגורציה

#### 🧠 החלטות עצמאיות:
- ✅ אפיון מבנה הנתונים
- ✅ ארכיטקטורת fallback חכמה
- ✅ לוגיקת סינון משודרגת
- ✅ בניית השאילתות ל-LLM

---

### ✅ עמידה בדרישות

- [x] ממשק עברית מלא עם RTL ועיצוב חברתי
- [x] יצירת משימות מסיכומים דיאריים עם LLM אמיתי
- [x] סינון דינמי (סטטוס + אחראי)
- [x] מנגנון השהייה חכם
- [x] ולידציות צד-שרת וצד-לקוח

---

### 📚 משפרים עתידיים

- 🎯 סינונים ממשק משתמש מתקדמים
- 🧠 שירותי AI מתקדמים יותר
- 🗄️ מעבר ל-PostgreSQL עם migrations
- 📊 ממשקי דוחות וסטטיסטיקה

---

### 📄 רישיון

הפרויקט מסופק לצורכי הדגמה והערכה.

---

## <a name="english"></a>🇺🇸 English

### 📋 Overview

A complete **MVP** task management system, developed as a take-home assignment for Haara. The system enables:

- ✨ **Automatic task extraction** from daily summaries in Hebrew
- 🎯 **Dynamic filtering** by status and assignee
- ⏸️ **Pause mechanism** for task management
- 🌍 **Full RTL interface** in Hebrew

---

### 🛠️ Tech Stack

| Component | Technology |
|---|---|
| **Frontend** | React 18 + Vite + Tailwind CSS + Lucide Icons |
| **Backend** | Python 3.10+ + FastAPI + Uvicorn |
| **AI Engine** | Google Gemini (gemini-2.5-flash) |
| **Database** | JSON File-based Storage |

---

### 🏗️ Architecture & Technical Decisions

#### 🔧 Why FastAPI?
- ⚡ High performance with async support
- 📚 Automatic documentation (Swagger UI)
- ✅ Built-in validation with Pydantic

#### 💾 Local JSON Database
- 🚀 Instant startup without complex setup
- 📁 Simple file-based persistence

#### 🎨 UI Design
- 📱 Responsive with Tailwind CSS
- ↔️ Full RTL support
- 🧹 Clean, minimalist interface

#### 🧠 LLM Integration
- **Model:** Google Gemini 2.5 Flash
- **Function:** Automatic analysis of daily summaries
- **Smart Fallback:** System remains functional if API is unavailable

---

### 🚀 Installation & Setup

#### 1️⃣ Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 🔑 API Configuration (Optional)

To use AI features, create a `.env` file in `backend/`:

```env
GEMINI_API_KEY=your_api_key_here
```

#### ▶️ Run Server

```bash
python -m uvicorn main:app --reload
```

🌐 Server runs at: **http://localhost:8000**

---

#### 2️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

🌐 App runs at: **http://localhost:5173**

---

### 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks` | List all tasks |
| `POST` | `/tasks` | Create new task |
| `PATCH` | `/tasks/{id}` | Update task (including pause/resume) |
| `POST` | `/parse` | Parse daily summary and extract tasks |

---

### 🤖 AI Pair Programming Declaration

**As per assignment guidelines**, this project was developed with AI assistance as a pair programmer:

#### 🤝 AI Usage:
- Initial project structure creation
- Tailwind configuration and setup
- Troubleshooting installation issues

#### 🧠 Independent Decisions:
- ✅ Data structure design
- ✅ Fallback architecture
- ✅ Advanced filtering logic
- ✅ LLM query building

---

### ✅ Requirements Checklist

- [x] Full Hebrew UI with RTL support and clean design
- [x] Task creation from daily summaries using real LLM
- [x] Dynamic filtering (status + assignee)
- [x] Smart pause mechanism
- [x] Server-side and client-side validation

---

### 📚 Future Improvements

- 🎯 Advanced UI filters
- 🧠 More sophisticated AI integration
- 🗄️ Migration to PostgreSQL with migrations
- 📊 Reporting and analytics dashboards

---

### 📄 License

This project is provided for demonstration and assessment purposes.

---

<div align="center">

**Built with ❤️ for Haara**

</div>
