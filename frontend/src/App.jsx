import { useState, useEffect } from 'react'
import axios from 'axios'
import { Clock, Play, CheckCircle, PauseCircle, Trash2, Zap } from 'lucide-react'

const API_BASE = 'http://localhost:8000/api'

function App() {
  const [tasks, setTasks] = useState([])
  const [summaryText, setSummaryText] = useState('')
  const [filters, setFilters] = useState({ owner: '', status: '' })
  const [loading, setLoading] = useState(false)

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.owner) params.append('owner', filters.owner)
      if (filters.status) params.append('status', filters.status)
      const res = await axios.get(`${API_BASE}/tasks?${params.toString()}`)
      setTasks(res.data)
    } catch (err) {
      console.error(err)
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
      await axios.post(`${API_BASE}/summaries`, {
        date: new Date().toISOString().split('T')[0],
        content: summaryText
      })
      setSummaryText('')
      fetchTasks()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateTaskStatus = async (id, status) => {
    try {
      await axios.patch(`${API_BASE}/tasks/${id}`, { status })
      fetchTasks()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE}/tasks/${id}`)
      fetchTasks()
    } catch (err) {
      console.error(err)
    }
  }

  const statusIcons = {
    open: <Clock className="w-5 h-5 text-gray-400" />,
    in_progress: <Play className="w-5 h-5 text-amber-500" />,
    paused: <PauseCircle className="w-5 h-5 text-red-400" />,
    done: <CheckCircle className="w-5 h-5 text-emerald-500" />
  }

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'high': return <span className="bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-md text-xs font-medium">דחוף</span>;
      case 'medium': return <span className="bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-md text-xs font-medium">בינוני</span>;
      case 'low': return <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-md text-xs font-medium">נמוך</span>;
      default: return <span className="bg-gray-50 text-gray-600 border border-gray-100 px-2 py-0.5 rounded-md text-xs font-medium">{urgency}</span>;
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 font-sans">
      <header className="mb-12 text-center pt-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-dark via-amber to-amber-light tracking-tight mb-3">
          הארה
        </h1>
        <p className="text-gray-500 font-medium flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 text-amber-light" />
          ניהול משימות חכם
        </p>
      </header>

      {/* אזור הכנסת סיכום */}
      <section className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 mb-12">
        <div className="bg-gradient-to-br from-white to-gray-50/50 p-6 rounded-xl">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            הכנסת סיכום יומי
          </h2>
          <form onSubmit={handleCreateSummary}>
            <textarea
              className="w-full bg-white border border-gray-200 rounded-xl p-4 h-32 focus:outline-none focus:ring-2 focus:ring-amber-light/20 focus:border-amber transition-all resize-none shadow-inner"
              placeholder="הדבק כאן את סיכום היום. המערכת כבר תדע מה לעשות איתו..."
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-amber to-amber-light text-white px-8 py-2.5 rounded-lg font-medium hover:shadow-lg hover:shadow-amber/20 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? 'מעבד נתונים...' : 'ייצר משימות'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* אזור הסינון */}
      <section className="flex flex-wrap gap-4 mb-8">
        <input 
          type="text" 
          placeholder="סינון לפי אחראי..." 
          className="border border-gray-200 rounded-lg p-2.5 bg-white shadow-sm focus:outline-none focus:border-amber transition-colors flex-1 min-w-[200px]"
          onChange={(e) => setFilters({...filters, owner: e.target.value})}
        />
        <select 
          className="border border-gray-200 rounded-lg p-2.5 bg-white shadow-sm focus:outline-none focus:border-amber transition-colors flex-1 min-w-[200px] cursor-pointer"
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">כל הסטטוסים</option>
          <option value="open">פתוח</option>
          <option value="in_progress">בטיפול</option>
          <option value="paused">בהשהייה</option>
          <option value="done">בוצע</option>
        </select>
      </section>

      {/* רשימת משימות */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task, index) => (
          <div 
            key={task.id} 
            className="animate-fade-in-up bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl hover:border-amber/20 hover:-translate-y-1 transition-all duration-300 group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-amber-dark transition-colors">{task.title}</h3>
                <div className="bg-gray-50 p-1.5 rounded-lg" title={task.status}>
                  {statusIcons[task.status]}
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">{task.description}</p>
              
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="text-sm text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                  <span className="font-semibold">אחראי:</span> {task.owner}
                </span>
                {getUrgencyBadge(task.urgency)}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
              <select 
                className={`text-sm font-medium border-none rounded-md py-1.5 px-2 cursor-pointer outline-none transition-colors
                  ${task.status === 'done' ? 'bg-emerald-50 text-emerald-700' : 
                    task.status === 'in_progress' ? 'bg-amber-50 text-amber-700' : 
                    task.status === 'paused' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}
                `}
                value={task.status}
                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
              >
                <option value="open">פתוח</option>
                <option value="in_progress">בטיפול</option>
                <option value="paused">בהשהייה</option>
                <option value="done">בוצע</option>
              </select>
              <button 
                onClick={() => deleteTask(task.id)} 
                className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                title="מחק משימה"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="col-span-full py-20 text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">אין משימות פתוחות</h3>
            <p className="text-gray-500">הכנס סיכום יומי למעלה כדי להתחיל לעבוד.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default App