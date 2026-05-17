import { useState, useEffect } from 'react'
import { Clock, Play, CheckCircle, PauseCircle, Trash2, Zap, User, Download, BarChart2, Activity, Target, LayoutDashboard, Settings, Edit3, X, Info } from 'lucide-react'
import { apiService } from './services/api' // <-- שימוש מלא ב-API Service החדש שלנו

// --- PLACEHOLDER COMPONENTS ---
const GoalsView = () => (
  <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col items-center gap-6 mt-8">
    <div className="bg-amber-100 p-5 rounded-full shadow-inner"><Target className="w-12 h-12 text-amber-600" /></div>
    <h2 className="text-3xl font-extrabold text-gray-800">מסך יעדים בקרוב</h2>
    <p className="text-gray-600 max-w-md">כאן ניתן יהיה להגדיר ולעקוב אחר יעדים אסטרטגיים.</p>
  </div>
)

const SettingsView = () => (
  <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col items-center gap-6 mt-8">
    <div className="bg-slate-100 p-5 rounded-full shadow-inner"><Settings className="w-12 h-12 text-slate-600" /></div>
    <h2 className="text-3xl font-extrabold text-gray-800">הגדרות מערכת בקרוב</h2>
    <p className="text-gray-600 max-w-md">כאן ניתן יהיה לנהל הגדרות משתמש, צוותים, אינטגרציות ועוד.</p>
  </div>
)

function App() {
  const [tasks, setTasks] = useState([])
  const [summaryText, setSummaryText] = useState('')
  const [summaryDate, setSummaryDate] = useState(new Date().toISOString().split('T')[0])
  const [filters, setFilters] = useState({ owner: '', currentHandler: '', status: '' })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  
  const [editingTask, setEditingTask] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchTasks = async () => {
    try {
      // FIX 7: שימוש נקי ב-apiService במקום axios ישירות
      const res = await apiService.getTasks(filters);
      setTasks(res.data)
    } catch (err) {
      showToast('שגיאה בטעינת המשימות', 'error');
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [filters])

  const handleCreateSummary = async (e) => {
    e.preventDefault()
    if (!summaryText.trim()) return
    setLoading(true)
    try {
      const res = await apiService.createSummary({ date: summaryDate, content: summaryText });
      setSummaryText('')
      await fetchTasks()
      
      // FIX 2: פידבק אמיתי למשתמש. אם חזרו 0 משימות, לא משקרים שהייתה הצלחה ענקית.
      const createdCount = res.data.tasksCreated || 0;
      if (createdCount > 0) {
        showToast(`מעולה! ה-AI ניתח את הסיכום ויצר ${createdCount} משימות חדשות.`, 'success');
      } else {
        showToast('הסיכום נשמר, אך ה-AI לא זיהה בו משימות מוגדרות לחילוץ.', 'info');
      }
    } catch (err) {
      showToast('שגיאה בניתוח הסיכום', 'error');
    } finally {
      setLoading(false)
    }
  }

  const updateTaskStatus = async (id, status) => {
    try {
      await apiService.updateTask(id, { status });
      await fetchTasks()
      showToast('סטטוס המשימה עודכן', 'success');
    } catch (err) {
      showToast('שגיאה בעדכון הסטטוס', 'error');
    }
  }

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    
    // FIX 9: ולידציה ב-Modal (לא מאפשרים שמירת משימה ללא כותרת)
    if (!editingTask.title.trim()) {
      showToast('שגיאה: כותרת המשימה אינה יכולה להיות ריקה', 'error');
      return;
    }

    try {
      await apiService.updateTask(editingTask.id, editingTask);
      setEditingTask(null);
      await fetchTasks();
      showToast('המשימה עודכנה בהצלחה', 'success');
    } catch (err) {
      showToast('שגיאה בעדכון המשימה', 'error');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("למחוק משימה זו לצמיתות?")) return;
    try {
      await apiService.deleteTask(id);
      await fetchTasks()
      showToast('המשימה נמחקה', 'success');
    } catch (err) {
      showToast('שגיאה במחיקה', 'error');
    }
  }

  // FIX 11: אבטחת ה-CSV מפני נוסחאות זדוניות (CSV Injection)
  const sanitizeCSV = (str) => {
    if (!str) return '';
    const cleanStr = String(str).replace(/"/g, '""');
    if (/^[=\+\-@]/.test(cleanStr)) return `"'${cleanStr}"`; 
    return `"${cleanStr}"`;
  }

  const exportToCSV = () => {
    if (tasks.length === 0) return;
    const headers = ['כותרת', 'תיאור', 'אחראי', 'מטפל נוכחי', 'סטטוס'];
    const csvData = tasks.map(t => [
      sanitizeCSV(t.title), sanitizeCSV(t.description), sanitizeCSV(t.owner), sanitizeCSV(t.currentHandler), sanitizeCSV(t.status)
    ].join(','));
    const blob = new Blob(['\uFEFF' + [headers.join(','), ...csvData].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `haara_tasks.csv`;
    link.click();
    showToast('קובץ יוצא בהצלחה', 'success');
  }

  const handleDragStart = (e, taskId) => { e.dataTransfer.setData('taskId', taskId); }
  const handleDragOver = (e) => { e.preventDefault(); }
  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) updateTaskStatus(taskId, newStatus);
  }

  const statusCounts = tasks.reduce((acc, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc; }, { open: 0, in_progress: 0, paused: 0, done: 0 });
  
  const columns = [
    { id: 'open', title: 'פתוח', icon: <Clock className="w-5 h-5 text-gray-500"/>, bg: 'bg-gray-50' },
    { id: 'in_progress', title: 'בטיפול', icon: <Play className="w-5 h-5 text-blue-500"/>, bg: 'bg-blue-50/50' },
    { id: 'paused', title: 'בהשהייה', icon: <PauseCircle className="w-5 h-5 text-amber-500"/>, bg: 'bg-amber-50/50' },
    { id: 'done', title: 'בוצע', icon: <CheckCircle className="w-5 h-5 text-emerald-500"/>, bg: 'bg-emerald-50/50' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 md:pb-0" dir="rtl">
      
      {/* --- TOAST --- */}
      {toast && (
        <div className={`fixed bottom-24 md:bottom-6 right-6 px-6 py-3 rounded-xl shadow-2xl text-white z-[100] animate-fade-in-up flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-500' : toast.type === 'info' ? 'bg-amber-500' : 'bg-emerald-600'}`}>
          {toast.type === 'error' ? <Zap className="w-5 h-5" /> : toast.type === 'info' ? <Info className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">עריכת משימה</h2>
              <button onClick={() => setEditingTask(null)}><X className="w-6 h-6 text-gray-400 hover:text-gray-600" /></button>
            </div>
            <form onSubmit={handleUpdateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">כותרת המשימה *</label>
                <input type="text" className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-amber-500" value={editingTask.title} onChange={e => setEditingTask({...editingTask, title: e.target.value})} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">תיאור</label>
                <textarea className="w-full border border-gray-200 rounded-xl p-3 h-24 resize-none outline-none focus:border-amber-500" value={editingTask.description} onChange={e => setEditingTask({...editingTask, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">אחראי (Owner)</label>
                  <input type="text" className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-amber-500" value={editingTask.owner} onChange={e => setEditingTask({...editingTask, owner: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">מטפל כרגע</label>
                  <input type="text" className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-amber-500" value={editingTask.currentHandler} onChange={e => setEditingTask({...editingTask, currentHandler: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all mt-4">שמור שינויים</button>
            </form>
          </div>
        </div>
      )}

      {/* --- TOP NAVBAR (Desktop) --- */}
      <nav className="bg-black text-white sticky top-0 z-50 px-8 py-4 flex items-center justify-between shadow-xl">
        <img src="/logo.png" alt="הארה" className="h-10 w-auto" />
        <div className="hidden md:flex items-center gap-8 text-sm font-bold">
          <button onClick={() => setActiveTab('dashboard')} className={`pb-1 border-b-2 transition-all ${activeTab === 'dashboard' ? 'text-amber-400 border-amber-400' : 'text-gray-400 border-transparent hover:text-white'}`}>לוח משימות</button>
          <button onClick={() => setActiveTab('goals')} className={`pb-1 border-b-2 transition-all ${activeTab === 'goals' ? 'text-amber-400 border-amber-400' : 'text-gray-400 border-transparent hover:text-white'}`}>יעדים</button>
          <button onClick={() => setActiveTab('settings')} className={`pb-1 border-b-2 transition-all ${activeTab === 'settings' ? 'text-amber-400 border-amber-400' : 'text-gray-400 border-transparent hover:text-white'}`}>הגדרות</button>
        </div>
        <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
          <span className="text-xs font-bold">גדי רפפורט</span>
          <User className="w-4 h-4 text-amber-400" />
        </div>
      </nav>

      {/* --- BOTTOM NAV (Mobile) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 z-50 flex items-center justify-around py-4 px-6 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-amber-400' : 'text-gray-500'}`}>
          <LayoutDashboard className="w-6 h-6" /><span className="text-[10px] font-bold">לוח</span>
        </button>
        <button onClick={() => setActiveTab('goals')} className={`flex flex-col items-center gap-1 ${activeTab === 'goals' ? 'text-amber-400' : 'text-gray-500'}`}>
          <Target className="w-6 h-6" /><span className="text-[10px] font-bold">יעדים</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-amber-400' : 'text-gray-500'}`}>
          <Settings className="w-6 h-6" /><span className="text-[10px] font-bold">הגדרות</span>
        </button>
      </nav>

      {/* --- CONTENT --- */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-4 gap-3 mb-8">
              {columns.map(c => (
                <div key={c.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <div className="text-xl font-black text-gray-800">{statusCounts[c.id]}</div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{c.title}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <section className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                {/* FIX 4: החזרת שדה בחירת התאריך */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">סיכום יומי</h2>
                  <input type="date" className="bg-slate-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-amber-500 text-gray-600 font-medium" value={summaryDate} onChange={(e) => setSummaryDate(e.target.value)} />
                </div>
                <textarea className="w-full bg-slate-50 border-none rounded-2xl p-4 h-24 focus:ring-2 focus:ring-amber-500/20 outline-none resize-none" placeholder="הדבק כאן את הטקסט החופשי מהסיכום..." value={summaryText} onChange={e => setSummaryText(e.target.value)} />
                <div className="mt-4 flex justify-end">
                  <button onClick={handleCreateSummary} disabled={loading} className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-black/20">
                    {loading ? 'מנתח...' : 'ייצר משימות מסיכום'}
                  </button>
                </div>
              </section>

              <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-3">
                <h3 className="text-sm font-bold text-gray-800 mb-1 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-gray-500"/> בקרה וסינון</h3>
                {/* FIX 3: החזרת הסינונים לפי אחראי ומטפל */}
                <div className="flex gap-2">
                  <input type="text" placeholder="חיפוש אחראי..." className="w-full bg-slate-50 border border-gray-100 rounded-xl p-2.5 text-sm outline-none focus:border-amber-500" onChange={e => setFilters({...filters, owner: e.target.value})} />
                  <input type="text" placeholder="חיפוש מטפל..." className="w-full bg-slate-50 border border-gray-100 rounded-xl p-2.5 text-sm outline-none focus:border-amber-500" onChange={e => setFilters({...filters, currentHandler: e.target.value})} />
                </div>
                
                {/* FIX 10: הוספת סטטוס done לפילטר */}
                <select className="w-full bg-slate-50 border-none rounded-xl p-3 outline-none font-bold text-sm" onChange={e => setFilters({...filters, status: e.target.value})}>
                  <option value="">כל הסטטוסים</option>
                  <option value="open">פתוחות</option>
                  <option value="in_progress">בטיפול</option>
                  <option value="paused">בהשהייה</option>
                  <option value="done">בוצעו</option>
                </select>
                <button onClick={exportToCSV} className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all mt-auto"><Download className="w-4 h-4" /> ייצוא CSV</button>
              </section>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {columns.map(col => (
                <div key={col.id} onDragOver={handleDragOver} onDrop={e => handleDrop(e, col.id)} className={`${col.bg} rounded-3xl p-4 min-h-[500px] border-2 border-dashed border-black/5`}>
                  <div className="flex items-center gap-2 mb-4 px-2">
                    {col.icon}<h3 className="font-black text-gray-800">{col.title}</h3>
                  </div>
                  <div className="space-y-4">
                    {tasks.filter(t => t.status === col.id).map(task => (
                      <div key={task.id} draggable onDragStart={e => handleDragStart(e, task.id)} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative group transition-all hover:shadow-xl hover:scale-[1.02] cursor-grab">
                        <h4 className="font-bold text-gray-800 text-sm mb-1">{task.title}</h4>
                        <p className="text-gray-400 text-xs mb-4 line-clamp-2">{task.description}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setEditingTask(task)} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => deleteTask(task.id)} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"><Trash2 className="w-4 h-4" /></button>
                          </div>
                          <div className="text-right">
                             <div className="text-[10px] font-bold text-gray-400">אחראי: {task.owner}</div>
                             {task.currentHandler && <div className="text-[10px] font-bold text-blue-500">מטפל: {task.currentHandler}</div>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {activeTab === 'goals' && <GoalsView />}
        {activeTab === 'settings' && <SettingsView />}
      </div>
    </div>
  )
}

export default App