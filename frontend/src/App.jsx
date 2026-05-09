import { useState, useEffect } from 'react'
import axios from 'axios'
import { Clock, Play, CheckCircle, PauseCircle, Trash2, Zap, User, Calendar, Download, BarChart2, Activity, Target } from 'lucide-react'

const API_BASE = 'http://localhost:8000/api'

function App() {
  const [tasks, setTasks] = useState([])
  const [summaryText, setSummaryText] = useState('')
  const [summaryDate, setSummaryDate] = useState(new Date().toISOString().split('T')[0])
  // הוספנו את הסטטוס חזרה למנגנון הסינון הראשי
  const [filters, setFilters] = useState({ owner: '', currentHandler: '', status: '' })
  const [loading, setLoading] = useState(false)

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.owner) params.append('owner', filters.owner)
      if (filters.currentHandler) params.append('currentHandler', filters.currentHandler)
      // שליחת הסטטוס לשרת במידה ונבחר
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
    <div className="max-w-7xl mx-auto p-6 font-sans">
      <header className="mb-8 text-center pt-4">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 tracking-tight mb-2">
          הארה - ניהול משימות
        </h1>
      </header>

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
            <input type="date" className="bg-transparent border-none text-sm text-gray-600 outline-none cursor-pointer" value={summaryDate} onChange={(e) => setSummaryDate(e.target.value)} />
          </div>
          <form onSubmit={handleCreateSummary}>
            <textarea className="w-full bg-white border border-gray-200 rounded-xl p-4 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none" placeholder="הדבק כאן סיכום וה-AI ייצר משימות..." value={summaryText} onChange={(e) => setSummaryText(e.target.value)} />
            <div className="mt-3 flex justify-end">
              <button type="submit" disabled={loading} className="bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-70">
                {loading ? 'מנתח ב-AI...' : 'ייצר משימות'}
              </button>
            </div>
          </form>
        </section>

        {/* בקרה וסינון - הוספנו את בחירת הסטטוס חזרה */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
          <h2 className="text-sm font-bold text-gray-800 mb-1 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-gray-500"/> בקרה וסינון</h2>
          <div className="flex gap-2">
            <input type="text" placeholder="חיפוש לפי אחראי..." className="border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500 flex-1" onChange={(e) => setFilters({...filters, owner: e.target.value})} />
            <input type="text" placeholder="מטפל..." className="border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500 flex-1" onChange={(e) => setFilters({...filters, currentHandler: e.target.value})} />
          </div>
          <select 
            className="border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500 w-full bg-white cursor-pointer"
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">הצג את כל הסטטוסים</option>
            <option value="open">רק משימות פתוחות</option>
            <option value="in_progress">רק משימות בטיפול</option>
            <option value="paused">רק משימות בהשהייה</option>
            <option value="done">רק משימות שבוצעו</option>
          </select>
          <button onClick={exportToCSV} disabled={tasks.length === 0} className="mt-auto flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium disabled:opacity-50">
            <Download className="w-4 h-4" /> ייצוא ל-CSV
          </button>
        </section>
      </div>

      {/* KANBAN BOARD (עם גלילה פנימית בכל תיבה) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {columns.map(col => (
          <div 
            key={col.id} 
            className={`${col.bg} border ${col.border} rounded-2xl p-4 h-[600px] flex flex-col transition-colors shadow-sm`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="flex items-center gap-2 mb-4 px-1 pb-2 border-b border-gray-200/50">
              {col.icon}
              <h3 className="font-bold text-gray-700">{col.title}</h3>
              <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-500 ml-auto shadow-sm border border-gray-100">
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>
            
            {/* כאן הוספנו את הגלילה הפנימית overflow-y-auto */}
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2 pb-4">
              {tasks.filter(t => t.status === col.id).map((task) => {
                const priorityScore = calculatePriority(task.urgency, task.importance, task.effort);
                return (
                  <div 
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative group shrink-0"
                  >
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-500" title="ציון עדיפות (דחיפות+חשיבות-מאמץ)">
                      <Target className="w-3 h-3 text-red-400" /> ציון {priorityScore}/9
                    </div>

                    <h4 className="font-bold text-gray-800 text-sm mb-1 pr-1 w-3/4 leading-tight">{task.title || "ללא כותרת"}</h4>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2 pr-1">{task.description}</p>
                    
                    <div className="space-y-1.5 mb-3 border-r-2 border-blue-100 pr-2">
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
                <div className="border-2 border-dashed border-gray-200 rounded-xl h-24 flex items-center justify-center text-gray-400 text-sm font-medium shrink-0">
                  גרור משימה לכאן
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default App