# Haara Task Manager — MVP

English / עברית

---

Overview
--------
An end-to-end Minimal Viable Product (MVP) for extracting and managing tasks from daily summaries. Built as a take-home assignment for Haara, the app focuses on a minimalist RTL UI, smooth data flow, and a pause/snooze task mechanism.

מבט כללי
--------
מוצר מינימלי מלא לניהול משימות המופקות מתוך סיכומי יום. פותח למטרת משימת בית עבור חברת "הארה" ומתמקד בממשק מינימליסטי (RTL), זרימת נתונים חלקה ומנגנון השהייה למשימות.

# 💡 מערכת ניהול משימות - הארה (MVP)

מערכת חכמה ומינימליסטית לניהול משימות מתוך סיכומי יום, שפותחה כמענה למשימת הבית של חברת הארה. המערכת מתמקדת בחוויית משתמש נקייה, זרימת נתונים חלקה, ועמידה מלאה בדרישות הליבה (כולל מנגנון הסטטוס "בהשהייה").

---

## 🛠️ טכנולוגיות (Tech Stack)

* **צד לקוח (Frontend):** React (Vite), Tailwind CSS, Lucide Icons.
* **צד שרת (Backend):** Python 3.10+, FastAPI, Uvicorn, Pydantic.
* **בינה מלאכותית (AI Engine):** Google Gemini (`gemini-1.5-flash`) באמצעות `google-generativeai` SDK.
* **מסד נתונים (Database):** JSON File-based storage (מותאם ל-MVP).

---

## 🏗️ ארכיטקטורה והחלטות טכניות

* **FastAPI בשרת:** נבחר בזכות המהירות, התיעוד האוטומטי, ויכולות הולידציה המובנות.
* **מסד נתונים מקומי:** החלטה זו התקבלה כדי לאפשר הרצה חלקה ומיידית של ה-MVP ללא צורך בהגדרת שרתי מסדי נתונים מורכבים מצד הבוחן.
* **ממשק משתמש:** פיתוח רספונסיבי עם עיצוב מבוסס Tailwind ליצירת ממשק נקי ותמיכה מלאה ב-RTL (ימין לשמאל).
* **מנגנון סינון:** הסינון (לפי סטטוס ואחראי) מתבצע כולו בצד השרת כדי להבטיח ביצועים אופטימליים, ומאפשר איתור של משימות גם כשהן בסטטוס "בהשהייה".

### 🧠 שילוב בינה מלאכותית (LLM Integration)
כמענה לדרישת הבונוס, שולב מודל LLM אמיתי לפענוח הסיכומים:
* המערכת מחוברת למודל `gemini-2.5-flash` של גוגל, אשר מנתח את טקסט הסיכום החופשי, מזהה את המשימות, ומחזיר אובייקטים מובנים (JSON) עם זיהוי אוטומטי של: כותרת, תיאור, אחראי (Owner) ורמת דחיפות/חשיבות.
* **Graceful Fallback:** הארכיטקטורה נבנתה בצורה חסינה. במידה ולא מוגדר מפתח API (או שקיימת בעיית רשת), המערכת מזהה זאת ונופלת אוטומטית למנגנון גיבוי מקומי (Regex Parser) המזהה שורות טקסט הכוללות את המילה "משימה:".

---

## 🚀 הוראות הרצה

### 1. הפעלת השרת (Backend)
פתח חלון טרמינל, נווט לתיקיית הפרויקט והרץ את הפקודות הבאות לפי הסדר:

```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

**הגדרת AI (אופציונלי אך מומלץ):**
ליכולות פענוח טקסט מתקדמות, צור קובץ `.env` בתוך תיקיית `backend` והוסף את מפתח ה-API שלך:

```env
GEMINI_API_KEY=your_api_key_here
```

**הרצת השרת:**

```bash
python -m uvicorn main:app --reload
```

*השרת ירוץ על הכתובת http://localhost:8000*

### 2. הפעלת צד הלקוח (Frontend)
פתח חלון טרמינל חדש, נווט לתיקיית הפרויקט והרץ:

```bash
cd frontend
npm install
npm run dev
```

*האפליקציה תרוץ על הכתובת http://localhost:5173*

---

## 🤖 הצהרת שימוש בבינה מלאכותית (AI Pair Programming)
בהתאם להנחיות המשימה, הפרויקט פותח תוך היעזרות בבינה מלאכותית ששימשה כשותף פיתוח (AI Pair Programmer):

**היכן נעשה שימוש:** יצירת מבנה הקבצים הראשוני, הגדרות התצורה של סביבת העיצוב (Tailwind), פתרון שגיאות התקנה בסביבות הווירטואליות וכתיבת קוד ה-Boilerplate לראוטים של ה-API.

**החלטות עצמאיות שלי:** אפיון מבנה הנתונים בשרת, ארכיטקטורת ה-Fallback לניתוב הטקסט, לוגיקת הסינונים ובניית השאילתות, ניהול המצבים (State) בצד הלקוח, ועיצוב חוויית המשתמש והאינטראקציות.

---

## ✅ עמידה בדרישות המשימה

- [x] ממשק מלא בעברית כולל תמיכה מלאה ב-RTL ועיצוב נקי.

- [x] יצירת משימות מתוך סיכום יומי באמצעות חיבור אמיתי ל-LLM.

- [x] סינון דינמי לפי סטטוס ואחראי (מבוצע צד-שרת).

- [x] מנגנון "השהייה" - משימות אינן נמחקות ונשארות זמינות בסינון.

- [x] ולידציות נתונים בצד השרת (Pydantic) ובצד הלקוח.

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
