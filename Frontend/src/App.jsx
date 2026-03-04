import { useState, useEffect } from "react";
import { api } from "./axios/api.js";

const FILTERS = ["All", "Active", "Completed"];

// ─── Custom Alert Component ───────────────────────────────────────────────────
const Alert = ({ alert, onClose }) => {
  if (!alert) return null;
  const colors = {
    error:   { bg: "rgba(239,68,68,0.15)",   border: "#ef4444", icon: "✕", accent: "#ef4444" },
    success: { bg: "rgba(52,211,153,0.15)",  border: "#34d399", icon: "✓", accent: "#34d399" },
    warning: { bg: "rgba(251,191,36,0.15)",  border: "#fbbf24", icon: "⚠", accent: "#fbbf24" },
  };
  const c = colors[alert.type] || colors.warning;

  return (
    <div className="fixed top-6 left-1/2 z-50 transition-all duration-300"
      style={{ transform: "translateX(-50%)", minWidth: 320 }}>
      <div className="flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl"
        style={{ background: c.bg, border: `1px solid ${c.border}`, backdropFilter: "blur(20px)" }}>
        <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: `${c.accent}33`, color: c.accent }}>
          {c.icon}
        </span>
        <p className="text-sm flex-1" style={{ color: "#fff", fontFamily: "'Georgia', serif" }}>
          {alert.message}
        </p>
        <button onClick={onClose} className="text-xs opacity-50 hover:opacity-100 transition-opacity"
          style={{ color: "#fff" }}>✕</button>
      </div>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
const App = () => {
  const [todos,    setTodos]    = useState([]);
  const [input,    setInput]    = useState("");
  const [editId,   setEditId]   = useState(null);
  const [editText, setEditText] = useState("");
  const [filter,   setFilter]   = useState("All");
  const [loading,  setLoading]  = useState(true);
  const [alert,    setAlert]    = useState(null);

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  // ── Fetch ──
  const fetchData = async () => {
    setLoading(true);
    const res = await api.get("/todos/");
    setTodos(res.data.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // ── Add (Optimistic) ──
  const addHandler = async () => {
    const trimmed = input.trim();
    if (!trimmed) return showAlert("Please enter a task before adding!", "error");
    const alreadyExists = todos.some((t) => t.title.toLowerCase() === trimmed.toLowerCase());
    if (alreadyExists) return showAlert("This task already exists!", "warning");

    const tempId = `temp_${Date.now()}`;
    const tempTodo = { _id: tempId, title: trimmed, isCompleted: false, _pending: true };
    setTodos((prev) => [...prev, tempTodo]);
    setInput("");

    try {
      const res = await api.post("/todos/", { title: trimmed, isCompleted: false });
      setTodos((prev) => prev.map((t) => t._id === tempId ? res.data.data : t));
      showAlert("Task added!", "success");
    } catch {
      setTodos((prev) => prev.filter((t) => t._id !== tempId));
      setInput(trimmed);
      showAlert("Failed to add task. Try again.", "error");
    }
  };

  // ── Delete (Optimistic) ──
  const deleteHandler = async (id) => {
    // 1. Instantly remove from UI
    const backup = todos.find((t) => t._id === id);
    setTodos((prev) => prev.filter((t) => t._id !== id));

    try {
      // 2. API call in background
      await api.delete(`/todos/${id}`);
    } catch {
      // 3. Rollback if failed
      setTodos((prev) => [...prev, backup]);
      showAlert("Failed to delete. Try again.", "error");
    }
  };

  // ── Toggle (Optimistic) ──
  const toggleHandler = async (todo) => {
    // 1. Instantly flip in UI
    const updated = { ...todo, isCompleted: !todo.isCompleted };
    setTodos((prev) => prev.map((t) => t._id === todo._id ? updated : t));

    try {
      // 2. API call in background
      const res = await api.put(`/todos/${todo._id}`, updated);
      setTodos((prev) => prev.map((t) => t._id === todo._id ? (res.data.data ?? updated) : t));
    } catch {
      // 3. Rollback if failed
      setTodos((prev) => prev.map((t) => t._id === todo._id ? todo : t));
      showAlert("Failed to update. Try again.", "error");
    }
  };

  // ── Update/Edit (Optimistic) ──
  const updateHandler = async (id) => {
    if (!editText.trim()) return showAlert("Task title can't be empty!", "error");

    // 1. Instantly update in UI
    const original = todos.find((t) => t._id === id);
    const updated = { ...original, title: editText.trim() };
    setTodos((prev) => prev.map((t) => t._id === id ? updated : t));
    setEditId(null);
    setEditText("");

    try {
      const res = await api.put(`/todos/${id}`, updated);
      setTodos((prev) => prev.map((t) => t._id === id ? (res.data.data ?? updated) : t));
      showAlert("Task updated!", "success");
    } catch {    
      setTodos((prev) => prev.map((t) => t._id === id ? original : t));
      setEditId(id);
      setEditText(original.title);
      showAlert("Failed to update. Try again.", "error");
    }
  };

  const active    = todos.filter((t) => !t.isCompleted);
  const completed = todos.filter((t) => t.isCompleted);
  const filtered  = filter === "Active" ? active : filter === "Completed" ? completed : todos;

  return (
    <div className="min-h-screen flex items-start justify-center pt-16 pb-16 px-4"
      style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)", fontFamily: "'Georgia', serif" }}>

    
      <div className="fixed top-0 left-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #a78bfa, transparent)", filter: "blur(80px)" }} />
      <div className="fixed bottom-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #f472b6, transparent)", filter: "blur(80px)" }} />

    
      <Alert alert={alert} onClose={() => setAlert(null)} />

      <div className="w-full max-w-lg relative z-10">

      
        <div className="mb-10 text-center">
          <p className="text-xs tracking-widest uppercase text-purple-300 mb-2 opacity-70">Your Daily Planner</p>
          <h1 className="text-5xl font-bold text-white"
            style={{ letterSpacing: "-0.02em", textShadow: "0 0 40px rgba(167,139,250,0.4)" }}>
            Taskflow
          </h1>
          <p className="text-purple-200 mt-3 opacity-60 text-sm">
            {active.length} task{active.length !== 1 ? "s" : ""} remaining
          </p>
        </div>

      
        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 px-5 py-3 rounded-2xl text-white text-sm outline-none placeholder-purple-300"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(167,139,250,0.25)", backdropFilter: "blur(10px)" }}
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addHandler()}
          />
          <button onClick={addHandler}
            className="px-5 py-3 rounded-2xl text-white font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)", boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}>
            + Add
          </button>
        </div>

       
        <div className="flex gap-1 mb-6 p-1 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={filter === f
                ? { background: "linear-gradient(135deg, #a78bfa, #7c3aed)", color: "#fff", boxShadow: "0 2px 12px rgba(124,58,237,0.35)" }
                : { color: "rgba(196,181,253,0.6)" }}>
              {f}
            </button>
          ))}
        </div>

      
        {loading && (
          <div className="text-center py-16 opacity-40">
            <div className="text-4xl mb-3" style={{ animation: "spin 1s linear infinite" }}>⟳</div>
            <p className="text-purple-200 text-sm">Loading tasks...</p>
          </div>
        )}

      
        {!loading && (filter === "All" || filter === "Active") && active.length > 0 && (
          <div className="mb-4">
            {filter === "All" && (
              <p className="text-xs uppercase tracking-widest text-purple-300 opacity-50 mb-3 px-1">Active</p>
            )}
            <div className="flex flex-col gap-2">
              {active.map((todo) => (
                <TodoItem key={todo._id} todo={todo}
                  editId={editId} editText={editText} setEditText={setEditText}
                  onToggle={toggleHandler} onDelete={deleteHandler}
                  onEdit={(t) => { setEditId(t._id); setEditText(t.title); }}
                  onSave={updateHandler} onCancelEdit={() => setEditId(null)} />
              ))}
            </div>
          </div>
        )}

   
        {!loading && (filter === "All" || filter === "Completed") && completed.length > 0 && (
          <div className="mb-4">
            <p className="text-xs uppercase tracking-widest text-green-400 opacity-60 mb-3 px-1">
              ✓ Completed ({completed.length})
            </p>
            <div className="flex flex-col gap-2">
              {completed.map((todo) => (
                <TodoItem key={todo._id} todo={todo}
                  editId={editId} editText={editText} setEditText={setEditText}
                  onToggle={toggleHandler} onDelete={deleteHandler}
                  onEdit={(t) => { setEditId(t._id); setEditText(t.title); }}
                  onSave={updateHandler} onCancelEdit={() => setEditId(null)} />
              ))}
            </div>
          </div>
        )}

    
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 opacity-40">
            <div className="text-5xl mb-4">{filter === "Completed" ? "🎉" : "✨"}</div>
            <p className="text-purple-200 text-sm">
              {filter === "Completed" ? "No completed tasks yet" : "Add your first task above"}
            </p>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ─── Todo Item ────────────────────────────────────────────────────────────────
const TodoItem = ({ todo, editId, editText, setEditText, onToggle, onDelete, onEdit, onSave, onCancelEdit }) => {
  const isEditing = editId === todo._id;

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200"
      style={{
        background: todo.isCompleted ? "rgba(52,211,153,0.05)" : "rgba(255,255,255,0.06)",
        border: todo.isCompleted ? "1px solid rgba(52,211,153,0.15)" : "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        opacity: todo._pending ? 0.6 : 1,
        transition: "opacity 0.3s ease",
      }}>

      {/* Checkbox */}
      <button onClick={() => onToggle(todo)}
        className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{
          borderColor: todo.isCompleted ? "#34d399" : "rgba(167,139,250,0.4)",
          background:  todo.isCompleted ? "linear-gradient(135deg, #34d399, #059669)" : "transparent",
          boxShadow:   todo.isCompleted ? "0 0 10px rgba(52,211,153,0.4)" : "none",
        }}>
        {todo.isCompleted && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      
      {isEditing ? (
        <input autoFocus
          className="flex-1 bg-transparent text-white text-sm outline-none border-b border-purple-400 pb-0.5"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSave(todo._id); if (e.key === "Escape") onCancelEdit(); }} />
      ) : (
        <span className="flex-1 text-sm" style={{
          color: todo.isCompleted ? "rgba(52,211,153,0.6)" : "rgba(255,255,255,0.9)",
          textDecoration: todo.isCompleted ? "line-through" : "none",
        }}>
          {todo.title}
        </span>
      )}

      {/* Action Buttons */}
      <div className="flex gap-1">
        {isEditing ? (
          <>
            <ActionBtn onClick={() => onSave(todo._id)} color="#34d399" title="Save">✓</ActionBtn>
            <ActionBtn onClick={onCancelEdit}           color="#f87171" title="Cancel">✕</ActionBtn>
          </>
        ) : (
          <>
            {!todo.isCompleted && (
              <ActionBtn onClick={() => onEdit(todo)} color="#a78bfa" title="Edit">✎</ActionBtn>
            )}
            <ActionBtn onClick={() => onDelete(todo._id)} color="#f87171" title="Delete">🗑</ActionBtn>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Action Button ────────────────────────────────────────────────────────────
const ActionBtn = ({ onClick, color, title, children }) => (
  <button onClick={onClick} title={title}
    className="w-6 h-6 rounded-lg flex items-center justify-center text-xs transition-all duration-150 hover:scale-110 active:scale-95"
    style={{ background: `${color}22`, color }}>
    {children}
  </button>
);

export default App;