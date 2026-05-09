# 💡 מערכת ניהול משימות - הארה

<div align="center">

**מערכת חכמה ומינימליסטית לניהול משימות מתוך סיכומי יום**

[English](#english) • [עברית](#hebrew)

</div>

---

## <a name="hebrew"></a>🇮🇱 עברית

### 📋 סקירה כללית

מערכת ניהול משימות **MVP** מלאה, שפותחה כמענה למשימת בית של חברת הארה. המערכת מאפשרת:

- ✨ **חילוץ אוטומטי של משימות** מתוך סיכומי יום בעברית באמצעות AI
- 🎯 **סינון דינמי** לפי אחראי, מטפל נוכחי וסטטוס
- 🎨 **לוח קנבן אינטראקטיבי** עם גרירה וזרוקה (Drag & Drop)
- ⏸️ **מנגנון ניהול משימות מתקדם** - פתוח, בטיפול, בהשהייה, בוצע
- 📊 **דשבורד משימות עם סטטיסטיקה** - ספירת משימות לפי סטטוס ועומס עובדים
- 📥 **ייצוא ל-CSV** לשילוב עם כלים חיצוניים
- 🌍 **ממשק RTL מלא** בעברית

---

### 🛠️ טכנולוגיות (Tech Stack)

| קומפוננטה | טכנולוגיה |
|---|---|
| **Frontend** | React 19 + Vite + Tailwind CSS + Lucide Icons |
| **Backend** | Python 3.10+ + FastAPI + Uvicorn |
| **AI Engine** | Google Gemini 2.5 Flash (עם Smart Fallback) |
| **Database** | JSON File-based Storage (db.json) |

---

### 🏗️ ארכיטקטורה וחלטות טכניות

#### 🔧 בחירת FastAPI
- ⚡ ביצועים גבוהים עם תמיכה async
- 📚 תיעוד אוטומטי (Swagger UI ב-`/docs`)
- ✅ ולידציה מובנית עם Pydantic
- 🔄 CORS מחובר לתמיכה בקריאות מ-Frontend

#### 💾 מסד נתונים מקומי (JSON)
- 🚀 הרצה מיידית ללא הגדרות מורכבות
- 📁 שמירה פשוטה ל-JSON (`db.json`)
- 🔒 נתונים משתמרים בין הרצות
- ⚠️ בפרויקט גדול יותר: המלצה לעבור ל-PostgreSQL

#### 🎨 עיצוב ממשק
- 📱 רספונסיבי עם Tailwind CSS
- ↔️ תמיכה מלאה RTL (ימין לשמאל)
- 🧹 ממשק נקי ומינימליסטי עם Lucide Icons
- 🌈 דשבורד צבעוני עם סטטיסטיקה

#### 🧠 שילוב LLM (בינה מלאכותית)
- **מודל:** Google Gemini 2.5 Flash
- **פעולה:** ניתוח אוטומטי של סיכומים בעברית וחילוץ משימות JSON
- **JSON Mode:** הכוח האמיתי - הודעות מובנות ישירות מ-LLM
- **Smart Fallback:** אם API לא זמין או נפלה שגיאה:
  - המערכת חותרת הודעות עם "משימה:" או "לביצוע:"
  - המשימות עדיין נוצרות ללא תלות ב-AI

---

### 📡 API Endpoints

| Method | Endpoint | תיאור |
|--------|----------|-------|
| `GET` | `/api/tasks` | רשימת משימות (עם סינון אופציונלי) |
| `GET` | `/api/tasks/{task_id}` | קבלת משימה ספציפית |
| `POST` | `/api/tasks` | יצירת משימה חדשה |
| `PATCH` | `/api/tasks/{task_id}` | עדכון משימה (סטטוס, אחראי, וכו') |
| `DELETE` | `/api/tasks/{task_id}` | מחיקת משימה |
| `GET` | `/api/summaries` | קבלת כל הסיכומים |
| `POST` | `/api/summaries` | שליחת סיכום יומי + AI parsing |

#### פרמטרים סינון (GET /api/tasks):
```
?owner=דוד           # משימות של אחראי מסוים
?currentHandler=לי   # משימות שמטופלות על ידי מישהו
?status=open         # רק משימות בסטטוס מסוים
```

#### דוגמת Request ל-POST `/api/summaries`:
```json
{
  "date": "2026-05-09",
  "content": "היום דיווחנו שדוד צריך להוסיף דוקומנטציה. רן עוד צריך לתקן באג. משימה: לעדכן את ה-README."
}
```

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

#### 🔑 הגדרת Google Gemini API (אופציונלי אבל מומלץ!)

לשימוש בבינה המלאכותית בשיתוף עם Gemini, צור קובץ `.env` בתוך `backend/`:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

**הערה:** ללא מפתח API, המערכת תעבוד עם fallback פשוט (חיפוש ש"מילים קסם").

#### ▶️ הרצת השרת

```bash
python -m uvicorn main:app --reload
```

🌐 השרת יפעל ב: **http://localhost:8000**
📚 API Documentation: **http://localhost:8000/docs** (Swagger UI)

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

### 🎮 שימוש באפליקציה

1. **הכנסת סיכום יומי**: הדבק טקסט בעברית בתיבה "הכנסת סיכום יומי"
2. **AI Parsing**: לחץ על "ייצר משימות" - הניסיון יסחוט משימות מהטקסט
3. **לוח קנבן**: גרור משימות בין העמודות כדי לעדכן סטטוס:
   - **פתוח**: משימות חדשות
   - **בטיפול**: משימות שמתוגמלות כרגע
   - **בהשהייה**: משימות בהפסקה זמנית
   - **בוצע**: משימות שהושלמו
4. **סינון**: סנן לפי אחראי, מטפל נוכחי, או סטטוס
5. **ייצוא**: לחץ "ייצוא ל-CSV" כדי לשדר נתונים ל-Excel

---

### 💻 בנייה וייצוא ל-Production

#### Frontend Build:
```bash
cd frontend
npm run build  # ייצר את build/ dir
npm run preview  # טסט בנייה מקומית
```

#### Backend Deployment:
```bash
# בייצור, הסר את --reload
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

---

### 📊 מבנה הנתונים

#### Task Object:
```json
{
  "id": "uuid",
  "title": "כותרת משימה",
  "description": "תיאור מלא",
  "owner": "שם האחראי",
  "currentHandler": "מי שמטפל כרגע",
  "urgency": "low|medium|high",
  "importance": "low|medium|high",
  "effort": "small|medium|large",
  "status": "open|in_progress|paused|done",
  "summaryId": "id של הסיכום שיצר את המשימה",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

#### Summary Object:
```json
{
  "id": "uuid",
  "date": "YYYY-MM-DD",
  "content": "הטקסט המקורי",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

---

### 🤖 הצהרת שימוש בבינה מלאכותית

**בהתאם להנחיות המשימה**, פרויקט זה פותח עם סיוע AI כשותף פיתוח (Gemini):

#### 🤝 שימוש בـ AI:
- יצירת מבנה הפרויקט הראשוני
- הגדרות Tailwind וסביבת עיצוב
- פתרון בעיות התקנה וקונפיגורציה

#### 🧠 החלטות עצמאיות:
- ✅ אפיון מבנה הנתונים ודוגמאות
- ✅ ארכיטקטורת Smart Fallback (AI + regex parsing)
- ✅ לוגיקת סינון משודרגת (תמיכה בעומס עובדים)
- ✅ בניית השאילתות ל-Gemini עם JSON Mode
- ✅ UI Kanban Board עם Drag & Drop
- ✅ ייצוא ל-CSV עם תמיכה בעברית

---

### ✅ עמידה בדרישות

- [x] ממשק עברית מלא עם RTL ועיצוב חברתי
- [x] יצירת משימות מסיכומים דיאריים עם LLM אמיתי (Gemini)
- [x] סינון דינמי מתקדם (אחראי + מטפל נוכחי + סטטוס)
- [x] מנגנון ניהול משימות (4 סטטוסים: open, in_progress, paused, done)
- [x] ולידציות צד-שרת וצד-לקוח (Pydantic)
- [x] Kanban board עם גרירה וזרוקה
- [x] דשבורד עם סטטיסטיקה
- [x] ייצוא ל-CSV

---

### 📚 משפרים עתידיים

- 🎯 סינונים ממשק משתמש מתקדמים יותר (תאריכים, תגיות)
- 🧠 שירותי AI מתקדמים יותר (OpenAI / Anthropic)
- 🗄️ מעבר ל-PostgreSQL עם migrations
- 📊 ממשקי דוחות וסטטיסטיקה מתקדמים
- 🔐 אימות משתמשים (OAuth / JWT)
- 📱 Progressive Web App (PWA)
- 🔔 הודעות בזמן אמת (WebSocket)

---

### 🐛 Troubleshooting

**בעיה:** "ConnectionRefusedError: [Errno 111] Connection refused"
- **פתרון:** ודא ש-Backend פעול ב-`http://localhost:8000`

**בעיה:** "AI Parse Failed" / No Gemini API Key
- **פתרון:** הוסף את ה-API Key ל-`.env` בתיקיית `backend/`

**בעיה:** חותרים ברשימת המשימות - "גרור משימה לכאן"
- **הצעה:** הוסף סיכום יומי דרך הטופס, או בדוק ש-Backend פעול

---

### 📄 רישיון

הפרויקט מסופק לצורכי הדגמה והערכה. בנוי עם ❤️ לחברת הארה.

---

## <a name="english"></a>🇺🇸 English

### 📋 Overview

A complete **MVP** task management system, developed as a take-home assignment for Haara. The system enables:

- ✨ **Automatic task extraction** from daily summaries in Hebrew using AI
- 🎯 **Advanced dynamic filtering** by owner, current handler, and status
- 🎨 **Interactive Kanban board** with Drag & Drop
- ⏸️ **Advanced task management** - open, in_progress, paused, done
- 📊 **Task dashboard with statistics** - task counts and workload per person
- 📥 **CSV export** for integration with external tools
- 🌍 **Full RTL interface** in Hebrew

---

### 🛠️ Tech Stack

| Component | Technology |
|---|---|
| **Frontend** | React 19 + Vite + Tailwind CSS + Lucide Icons |
| **Backend** | Python 3.10+ + FastAPI + Uvicorn |
| **AI Engine** | Google Gemini 2.5 Flash (with Smart Fallback) |
| **Database** | JSON File-based Storage (db.json) |

---

### 🏗️ Architecture & Technical Decisions

#### 🔧 Why FastAPI?
- ⚡ High performance with async support
- 📚 Automatic documentation (Swagger UI at `/docs`)
- ✅ Built-in validation with Pydantic
- 🔄 CORS middleware enabled for frontend communication

#### 💾 Local JSON Database
- 🚀 Instant startup without complex setup
- 📁 Simple file-based persistence (`db.json`)
- 🔒 Data persists between runs
- ⚠️ For larger projects: recommend PostgreSQL

#### 🎨 UI Design
- 📱 Responsive with Tailwind CSS
- ↔️ Full RTL support
- 🧹 Clean, minimalist interface with Lucide Icons
- 🌈 Colorful dashboard with statistics

#### 🧠 LLM Integration (Artificial Intelligence)
- **Model:** Google Gemini 2.5 Flash
- **Function:** Automatic analysis of Hebrew daily summaries and JSON task extraction
- **JSON Mode:** True power - structured output directly from LLM
- **Smart Fallback:** If API unavailable or fails:
  - System falls back to regex parsing for keywords ("משימה:" or "לביצוע:")
  - Tasks still created independently of AI

---

### 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | List tasks (optional filtering) |
| `GET` | `/api/tasks/{task_id}` | Get specific task |
| `POST` | `/api/tasks` | Create new task |
| `PATCH` | `/api/tasks/{task_id}` | Update task (status, owner, etc.) |
| `DELETE` | `/api/tasks/{task_id}` | Delete task |
| `GET` | `/api/summaries` | List all summaries |
| `POST` | `/api/summaries` | Submit daily summary + AI parsing |

#### Filter Parameters (GET /api/tasks):
```
?owner=David           # Tasks owned by someone
?currentHandler=Lily   # Tasks handled by someone
?status=open           # Tasks with specific status
```

#### Example POST `/api/summaries`:
```json
{
  "date": "2026-05-09",
  "content": "Today David needs to add documentation. Ran still needs to fix a bug. Task: update the README."
}
```

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

#### 🔑 Google Gemini API Configuration (Optional but Recommended!)

To use AI features with Gemini, create a `.env` file in `backend/`:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

**Note:** Without API key, system works with simple fallback (keyword matching).

#### ▶️ Run Server

```bash
python -m uvicorn main:app --reload
```

🌐 Server runs at: **http://localhost:8000**
📚 API Documentation: **http://localhost:8000/docs** (Swagger UI)

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

### 🎮 Using the Application

1. **Enter daily summary:** Paste Hebrew text in the "הכנסת סיכום יומי" box
2. **AI Parsing:** Click "ייצר משימות" to extract tasks from text
3. **Kanban Board:** Drag tasks between columns to update status:
   - **פתוח** (Open): New tasks
   - **בטיפול** (In Progress): Currently being worked on
   - **בהשהייה** (Paused): Temporarily paused
   - **בוצע** (Done): Completed
4. **Filtering:** Filter by owner, handler, or status
5. **Export:** Click "ייצוא ל-CSV" to export data to Excel

---

### 💻 Building for Production

#### Frontend Build:
```bash
cd frontend
npm run build  # Creates build/ directory
npm run preview  # Test build locally
```

#### Backend Deployment:
```bash
# In production, remove --reload
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

---

### 📊 Data Structure

#### Task Object:
```json
{
  "id": "uuid",
  "title": "Task title",
  "description": "Full description",
  "owner": "Owner name",
  "currentHandler": "Who's handling it now",
  "urgency": "low|medium|high",
  "importance": "low|medium|high",
  "effort": "small|medium|large",
  "status": "open|in_progress|paused|done",
  "summaryId": "id of source summary",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

#### Summary Object:
```json
{
  "id": "uuid",
  "date": "YYYY-MM-DD",
  "content": "Original text",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

---

### 🤖 AI Pair Programming Declaration

**As per assignment guidelines**, this project was developed with AI assistance as a pair programmer:

#### 🤝 AI Usage:
- Initial project structure creation
- Tailwind configuration and setup
- Troubleshooting installation issues

#### 🧠 Independent Decisions:
- ✅ Data structure design and examples
- ✅ Smart Fallback architecture (AI + regex parsing)
- ✅ Advanced filtering logic (workload per person)
- ✅ Gemini queries with JSON Mode
- ✅ Kanban UI with Drag & Drop
- ✅ CSV export with Hebrew support

---

### ✅ Requirements Checklist

- [x] Full Hebrew UI with RTL support and clean design
- [x] Task creation from daily summaries using real LLM (Gemini)
- [x] Advanced dynamic filtering (owner + handler + status)
- [x] Advanced task management (4 statuses: open, in_progress, paused, done)
- [x] Server-side and client-side validation (Pydantic)
- [x] Kanban board with Drag & Drop
- [x] Dashboard with statistics
- [x] CSV export

---

### 📚 Future Improvements

- 🎯 More advanced UI filters (dates, tags, priority)
- 🧠 More sophisticated AI integration (OpenAI / Anthropic)
- 🗄️ Migration to PostgreSQL with migrations
- 📊 Advanced reporting and analytics dashboards
- 🔐 User authentication (OAuth / JWT)
- 📱 Progressive Web App (PWA)
- 🔔 Real-time notifications (WebSocket)

---

### 🐛 Troubleshooting

**Problem:** "ConnectionRefusedError: [Errno 111] Connection refused"
- **Solution:** Ensure Backend is running at `http://localhost:8000`

**Problem:** "AI Parse Failed" / No Gemini API Key
- **Solution:** Add API Key to `.env` in `backend/` folder

**Problem:** Empty task list - "גרור משימה לכאן"
- **Suggestion:** Add a daily summary via the form, or verify Backend is running

---

### 📄 License

This project is provided for demonstration and assessment purposes. Built with ❤️ for Haara.

---

<div align="center">

**Made with ❤️ for Haara**

</div>
