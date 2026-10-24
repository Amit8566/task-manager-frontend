
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckSquare, Plus, Search, LogOut, Clock3,
  CircleCheck, ListTodo, X, Trash2
} from "lucide-react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from "../services/taskService";

const emptyForm = {
  title: "",
  description: "",
  priority: "Medium",
  status: "Pending",
  dueDate: "",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadTasks = async () => {
    try {
      setError("");
      const response = await getTasks();
      const list = Array.isArray(response)
        ? response
        : response.result?.tasks ??
          response.result ??
          response.tasks ??
          response.data ??
          [];

      setTasks(Array.isArray(list) ? list : []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message || "Unable to load tasks. Check your API."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    } catch {
      setUser({});
    }

    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = `${task.title || ""} ${task.description || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, statusFilter]);

  const completed = tasks.filter((task) => task.status === "Completed").length;
  const inProgress = tasks.filter((task) => task.status === "In Progress").length;
  const pending = tasks.filter((task) => task.status === "Pending").length;

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await createTask({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        dueDate: form.dueDate || null,
      });

      setForm(emptyForm);
      setShowForm(false);
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create task.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (task, status) => {
    try {
      setError("");
      await updateTask(task._id || task.id, { status });
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update task status.");
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;

    try {
      setError("");
      await deleteTask(task._id || task.id);
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete task.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div className="dashboard-brand">
          <span className="brand-icon"><CheckSquare size={22} /></span>
          TaskFlow
        </div>

        <div className="sidebar-label">WORKSPACE</div>
        <div className="sidebar-link active">
          <ListTodo size={19} /> My Tasks
        </div>

        <div className="sidebar-user">
          <div className="avatar">
            {(user.name || user.email || "U").charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <strong>{user.name || "My Account"}</strong>
            <small>{user.email || ""}</small>
          </div>
          <button className="icon-button" onClick={logout} title="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="form-kicker">YOUR WORKSPACE</span>
            <h1>My Tasks</h1>
            <p>Plan your work and keep track of your progress.</p>
          </div>

          <button className="primary-button" onClick={() => setShowForm(true)}>
            <Plus size={18} /> New Task
          </button>
        </header>

        {error && <div className="form-error" role="alert">{error}</div>}

        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon purple"><ListTodo size={20} /></span>
            <p>Total Tasks</p>
            <strong>{tasks.length}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-icon orange"><Clock3 size={20} /></span>
            <p>Pending</p>
            <strong>{pending}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-icon blue"><Clock3 size={20} /></span>
            <p>In Progress</p>
            <strong>{inProgress}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-icon green"><CircleCheck size={20} /></span>
            <p>Completed</p>
            <strong>{completed}</strong>
          </div>
        </section>

        <section className="task-section">
          <div className="task-toolbar">
            <div>
              <h2>All Tasks</h2>
              <p>Manage and track your tasks.</p>
            </div>

            <div className="task-controls">
              <div className="search-box">
                <Search size={18} />
                <input
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
              >
                <option>All</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon"><CheckSquare size={27} /></span>
              <h3>{search || statusFilter !== "All" ? "No matching tasks" : "No tasks yet"}</h3>
              <p>
                {search || statusFilter !== "All"
                  ? "Try changing your search or filter."
                  : "Create your first task to get started."}
              </p>
              {!search && statusFilter === "All" && (
                <button className="primary-button" onClick={() => setShowForm(true)}>
                  <Plus size={18} /> Create your first task
                </button>
              )}
            </div>
          ) : (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <article className="task-card" key={task._id || task.id}>
                  <div className="task-card-content">
                    <h3>{task.title}</h3>
                    <p>{task.description || "No description provided."}</p>
                    <div className="task-meta">
                      <span className={`priority priority-${(task.priority || "Medium").toLowerCase()}`}>
                        {task.priority || "Medium"} priority
                      </span>
                      {task.dueDate && (
                        <span className="due-date">
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="task-actions">
                    <select
                      value={task.status || "Pending"}
                      onChange={(e) => handleStatus(task, e.target.value)}
                      aria-label={`Change status for ${task.title}`}
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                    <button
                      className="icon-button delete-button"
                      onClick={() => handleDelete(task)}
                      title="Delete task"
                      aria-label={`Delete ${task.title}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <section
            className="task-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-task-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2 id="new-task-title">Create a new task</h2>
                <p>Add the details for your task.</p>
              </div>
              <button
                className="icon-button"
                onClick={() => setShowForm(false)}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label htmlFor="task-title">Task title</label>
                <input
                  id="task-title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Complete project documentation"
                  maxLength={120}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-description">Description</label>
                <textarea
                  id="task-description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your task..."
                  maxLength={1000}
                  rows={3}
                />
              </div>

              <div className="modal-fields">
                <div className="form-group">
                  <label htmlFor="task-priority">Priority</label>
                  <select
                    id="task-priority"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="task-status">Status</label>
                  <select
                    id="task-status"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="task-due-date">Due date (optional)</label>
                <input
                  id="task-due-date"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={saving}>
                  {saving ? "Creating..." : "Create task"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
