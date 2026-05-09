import { useState, useEffect } from 'react'
import axios from 'axios'
import { Clock, Play, CheckCircle, PauseCircle, Trash2, Zap, User, Calendar, Download, BarChart2, Activity, Target, LayoutDashboard, Settings } from 'lucide-react'

const API_BASE = 'http://localhost:8000/api'

// --- PLACEHOLDER COMPONENTS FOR NON-DASHBOARD TABS ---

const GoalsView = () => (
  <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center gap-6">
    <div className="bg-amber-100 p-5 rounded-full shadow-inner">
      <Target className="w-12 h-12 text-amber-600" />
    </div>
    <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">מסך יעדים בקרוב</h2>
    <p className="text-gray-600 max-w-md">כאן ניתן יהיה להגדיר ולעקוב אחר יעדים אסטרטגיים. פיצ'ר זה נמצא בתהליכי פיתוח.</p>
    <button className="bg-amber-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-amber-600 transition-colors">צור יעד חדש</button>
  </div>
)

const SettingsView = () => (
  <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center gap-6">
    <div className="bg-slate-100 p-5 rounded-full shadow-inner">
      <Settings className="w-12 h-12 text-slate-600" />
    </div>
    <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">הגדרות מערכת בקרוב</h2>
    <p className="text-gray-600 max-w-md">כאן ניתן יהיה לנהל הגדרות משתמש, צוותים, אינטגרציות ועוד. פיצ'ר זה נמצא בתהליכי פיתוח.</p>
    <button className="bg-slate-700 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors">נהל צוותים</button>
  </div>
)

function App() {
  const [tasks, setTasks] = useState([])
  const [summaryText, setSummaryText] = useState('')
  const [summaryDate, setSummaryDate] = useState(new Date().toISOString().split('T')[0])
  const [filters, setFilters] = useState({ owner: '', currentHandler: '', status: '' })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.owner) params.append('owner', filters.owner)
      if (filters.currentHandler) params.append('currentHandler', filters.currentHandler)
      if (filters.status) params.append('status', filters.status)
      const res = await axios.get(`${API_BASE}/tasks?${params.toString()}`)
      setTasks(res.data)
    } catch (err) {
      console.error("שגיאה בשליפת משימות:", err)
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
      await axios.post(`${API_BASE}/summaries`, { date: summaryDate, content: summaryText })
      setSummaryText('')
      fetchTasks()
    } catch (err) {
      console.error("שגיאה ביצירת סיכום:", err)
    } finally {
      setLoading(false)
    }
  }

  const updateTaskStatus = async (id, status) => {
    try {
      await axios.patch(`${API_BASE}/tasks/${id}`, { status })
      fetchTasks()
    } catch (err) {
      console.error("שגיאה בעדכון סטטוס:", err)
    }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE}/tasks/${id}`)
      fetchTasks()
    } catch (err) {
      console.error("שגיאה במחיקת משימה:", err)
    }
  }

  const exportToCSV = () => {
    if (tasks.length === 0) return;
    const headers = ['כותרת', 'תיאור', 'אחראי', 'מטפל נוכחי', 'דחיפות', 'חשיבות', 'מאמץ', 'סטטוס', 'ציון עדיפות'];
    const csvData = tasks.map(t => {
      return [
        `"${(t.title || '').replace(/"/g, '""')}"`,
        `"${(t.description || '').replace(/"/g, '""')}"`,
        `"${t.owner || ''}"`,
        `"${t.currentHandler || ''}"`,
        `"${t.urgency || ''}"`,
        `"${t.importance || ''}"`,
        `"${t.effort || ''}"`,
        `"${t.status || ''}"`,
        `"${calculatePriority(t.urgency, t.importance, t.effort)}"`
      ].join(',');
    });
    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `haara_tasks_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  const calculatePriority = (urgency, importance, effort) => {
    const u = { high: 3, medium: 2, low: 1 }[urgency] || 2;
    const i = { high: 3, medium: 2, low: 1 }[importance] || 2;
    const e = { small: 3, medium: 2, large: 1 }[effort] || 2; 
    return u + i + e;
  }

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  }
  const handleDragOver = (e) => {
    e.preventDefault(); 
  }
  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTaskStatus(taskId, newStatus);
    }
  }

  const statusCounts = tasks.reduce((acc, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc; }, { open: 0, in_progress: 0, paused: 0, done: 0 });
  const workload = tasks.filter(t => t.status !== 'done').reduce((acc, t) => {
    const person = t.currentHandler || t.owner || 'לא מוגדר';
    acc[person] = (acc[person] || 0) + 1;
    return acc;
  }, {});

  const columns = [
    { id: 'open', title: 'פתוח', icon: <Clock className="w-5 h-5 text-gray-500"/>, bg: 'bg-gray-50', border: 'border-gray-200' },
    { id: 'in_progress', title: 'בטיפול', icon: <Play className="w-5 h-5 text-blue-500"/>, bg: 'bg-blue-50/50', border: 'border-blue-200' },
    { id: 'paused', title: 'בהשהייה', icon: <PauseCircle className="w-5 h-5 text-amber-500"/>, bg: 'bg-amber-50/50', border: 'border-amber-200' },
    { id: 'done', title: 'בוצע', icon: <CheckCircle className="w-5 h-5 text-emerald-500"/>, bg: 'bg-emerald-50/50', border: 'border-emerald-200' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans" dir="rtl">
      
      {/* --- TOP NAVBAR: גראדיאנט שחור יוקרתי --- */}
      <nav className="bg-gradient-to-r from-black via-gray-900 to-black sticky top-0 z-50 px-8 py-3 flex items-center justify-between shadow-2xl mb-8 border-b border-gray-800">
        <div className="flex items-center">
          {/* הלוגו הזהוב - ללא טקסט נוסף */}
          <img src="/logo.png" alt="הארה" className="h-12 w-auto drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex items-center gap-2 pb-1 transition-all border-b-2 ${activeTab === 'dashboard' ? 'text-amber-400 border-amber-400' : 'text-gray-400 border-transparent hover:text-white'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> לוח משימות
          </button>
          <button 
            onClick={() => setActiveTab('goals')} 
            className={`flex items-center gap-2 pb-1 transition-all border-b-2 ${activeTab === 'goals' ? 'text-amber-400 border-amber-400' : 'text-gray-400 border-transparent hover:text-white'}`}
          >
            <Target className="w-4 h-4" /> יעדים
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            className={`flex items-center gap-2 pb-1 transition-all border-b-2 ${activeTab === 'settings' ? 'text-amber-400 border-amber-400' : 'text-gray-400 border-transparent hover:text-white'}`}
          >
            <Settings className="w-4 h-4" /> הגדרות
          </button>
          
          <div className="h-8 w-px bg-gray-800 mx-2"></div>
          
          <div className="flex items-center gap-3 bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700 cursor-pointer hover:bg-gray-700 transition-all group">
            <span className="text-gray-200 group-hover:text-white transition-colors">גדי רפפורט</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-inner">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto p-6 pt-0">
        {activeTab === 'dashboard' && (
          <>
            {/* DASHBOARD */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-around">
                <div className="text-center"><div className="text-2xl font-bold text-gray-700">{statusCounts.open}</div><div className="text-xs text-gray-500 font-medium uppercase tracking-wider">פתוחות</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-blue-600">{statusCounts.in_progress}</div><div className="text-xs text-blue-500 font-medium uppercase tracking-wider">בטיפול</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-amber-500">{statusCounts.paused}</div><div className="text-xs text-amber-500 font-medium uppercase tracking-wider">בהשהייה</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-emerald-500">{statusCounts.done}</div><div className="text-xs text-emerald-500 font-medium uppercase tracking-wider">הושלמו</div></div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><Activity className="w-4 h-4 text-purple-500"/> עומס עובדים (משימות פעילות)</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(workload).length === 0 ? <span className="text-sm text-gray-400">אין עומס כרגע</span> : 
                    Object.entries(workload).sort((a,b)=>b[1]-a[1]).map(([person, count]) => (
                      <div key={person} className="bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2">
                        <span className="font-semibold text-purple-800">{person}</span>
                        <span className="bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full text-xs">{count}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </section>

            {/* טופס סיכום וסינונים */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <section className="lg:col-span-2 bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">הכנסת סיכום יומי</h2>
                  <input type="date" className="bg-transparent border-none text-sm text-gray-600 outline-none cursor-pointer font-bold" value={summaryDate} onChange={(e) => setSummaryDate(e.target.value)} />
                </div>
                <form onSubmit={handleCreateSummary}>
                  <textarea className="w-full bg-white border border-gray-200 rounded-xl p-4 h-24 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none" placeholder="הדבק כאן סיכום וה-AI ייצר משימות..." value={summaryText} onChange={(e) => setSummaryText(e.target.value)} />
                  <div className="mt-3 flex justify-end">
                    <button type="submit" disabled={loading} className="bg-gray-900 text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg shadow-gray-200 disabled:opacity-70">
                      {loading ? 'מנתח ב-AI...' : 'ייצר משימות'}
                    </button>
                  </div>
                </form>
              </section>

              <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                <h2 className="text-sm font-bold text-gray-800 mb-1 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-gray-500"/> בקרה וסינון</h2>
                <div className="flex gap-2">
                  <input type="text" placeholder="לפי אחראי..." className="border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-amber-500 flex-1" onChange={(e) => setFilters({...filters, owner: e.target.value})} />
                  <input type="text" placeholder="לפי מטפל..." className="border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-amber-500 flex-1" onChange={(e) => setFilters({...filters, currentHandler: e.target.value})} />
                </div>
                <select className="border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-amber-500 w-full bg-white cursor-pointer font-medium" onChange={(e) => setFilters({...filters, status: e.target.value})}>
                  <option value="">כל הסטטוסים</option>
                  <option value="open">פתוח</option>
                  <option value="in_progress">בטיפול</option>
                  <option value="paused">בהשהייה</option>
                  <option value="done">בוצע</option>
                </select>
                <button onClick={exportToCSV} disabled={tasks.length === 0} className="mt-auto flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl hover:bg-emerald-100 transition-colors text-sm font-bold disabled:opacity-50">
                  <Download className="w-4 h-4" /> ייצוא ל-CSV
                </button>
              </section>
            </div>

            {/* KANBAN BOARD */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start pb-12">
              {columns.map(col => (
                <div key={col.id} className={`${col.bg} border ${col.border} rounded-2xl p-4 h-[600px] flex flex-col transition-colors shadow-sm`} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, col.id)}>
                  <div className="flex items-center gap-2 mb-4 px-1 pb-2 border-b border-gray-200/50">
                    {col.icon}
                    <h3 className="font-bold text-gray-700">{col.title}</h3>
                    <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-500 ml-auto shadow-sm border border-gray-100">{tasks.filter(t => t.status === col.id).length}</span>
                  </div>
                  <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1 pb-4 scrollbar-thin scrollbar-thumb-gray-200">
                    {tasks.filter(t => t.status === col.id).map((task) => {
                      const priorityScore = calculatePriority(task.urgency, task.importance, task.effort);
                      return (
                        <div key={task.id} draggable onDragStart={(e) => handleDragStart(e, task.id)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative group shrink-0">
                          <div className="absolute top-3 left-3 flex items-center gap-1 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-500"><Target className="w-3 h-3 text-red-400" /> {priorityScore}/9</div>
                          <h4 className="font-bold text-gray-800 text-sm mb-1 pr-1 w-3/4 leading-tight">{task.title || "ללא כותרת"}</h4>
                          <p className="text-gray-500 text-xs mb-3 line-clamp-2 pr-1">{task.description}</p>
                          <div className="space-y-1.5 mb-3 border-r-2 border-amber-100 pr-2">
                            <div className="text-[11px] text-gray-600 font-medium flex items-center gap-1"><User className="w-3 h-3 text-gray-400"/> אחראי: <span className="text-gray-900">{task.owner}</span></div>
                            <div className="text-[11px] text-gray-600 font-medium flex items-center gap-1"><Play className="w-3 h-3 text-blue-400"/> מטפל: <span className="text-blue-700">{task.currentHandler || "-"}</span></div>
                          </div>
                          <div className="flex justify-between items-end pt-2 border-t border-gray-50">
                            <div className="flex flex-wrap gap-1">
                              {task.urgency === 'high' && <span className="bg-red-50 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold">דחוף</span>}
                              {task.importance === 'high' && <span className="bg-purple-50 text-purple-600 text-[10px] px-1.5 py-0.5 rounded font-bold">חשוב</span>}
                            </div>
                            <button onClick={() => deleteTask(task.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      )
                    })}
                    {tasks.filter(t => t.status === col.id).length === 0 && (
                      <div className="border-2 border-dashed border-gray-200 rounded-xl h-24 flex items-center justify-center text-gray-400 text-sm font-medium shrink-0">גרור לכאן</div>
                    )}
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
        {activeTab === 'goals' && <GoalsView />}
        {activeTab === 'settings' && <SettingsView />}
      </div>
    </div>
  )
}

export default App