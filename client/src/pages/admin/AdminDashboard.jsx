import { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import TasksTable from '../../components/admin/TasksTable';
import CreateTaskModal from '../../components/admin/CreateTaskModal';
import EditTaskModal from '../../components/admin/EditTaskModal';
import { fetchAllTasks } from '../../api/tasks';

const IconSearch = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const IconPlus = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const loadTasks = async () => {
    try {
      const { data } = await fetchAllTasks();
      setTasks(data);
    } catch {
      alert('Failed to load tasks');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTasks();
  }, []);

  const stats = {
    total: tasks.length,
    open: tasks.filter((t) => t.status === 'Open').length,
    submitted: tasks.filter((t) => t.status === 'Submitted').length,
    completed: tasks.filter((t) => t.status === 'Completed').length,
  };

  const statCards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      colorClass: 'stat-card-default',
      valueColor: '#E5E2E1',
    },
    {
      label: 'Open',
      value: stats.open,
      colorClass: 'stat-card-blue',
      valueColor: '#60A5FA',
    },
    {
      label: 'Submitted',
      value: stats.submitted,
      colorClass: 'stat-card-info',
      valueColor: '#60A5FA',
    },
    {
      label: 'Completed',
      value: stats.completed,
      colorClass: 'stat-card-green',
      valueColor: '#34D399',
    },
  ];

  const filteredTasks = tasks.filter((task) => {
    const searchText = search.trim().toLowerCase();

    const matchSearch =
      searchText === '' ||
      task.title?.toLowerCase().includes(searchText);

    const matchStatus =
      statusFilter === 'All' ||
      task.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div
      className="flex min-h-screen"
      style={{ background: '#050505' }}
    >
      <Sidebar />

      <main
        className="ml-0 md:ml-[240px] flex-1 px-4 md:px-8 py-5 md:py-8 min-w-0"
        style={{ maxWidth: '100vw' }}
      >
        <div className="flex items-center justify-between mb-7 page-section">
          <div>
            <h1
              className="font-display text-[22px] font-semibold tracking-tight"
              style={{
                color: '#F0F0F0',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              Task Management
            </h1>

            <p
              className="mt-0.5 text-[13px]"
              style={{ color: '#6B7280' }}
            >
              Create, assign, and track all tasks across your talent pool.
            </p>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="btn-gradient flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-semibold cursor-pointer font-sans"
          >
            <IconPlus />
            Create Task
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6 page-section">
          {statCards.map(
            ({ label, value, colorClass, valueColor }) => (
              <div
                key={label}
                className={`stat-card ${colorClass}`}
              >
                <span
                  className="block text-[10.5px] font-semibold uppercase tracking-[0.08em] mb-3"
                  style={{
                    color: '#4B5563',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {label}
                </span>

                <span
                  className="block text-[32px] font-bold leading-none"
                  style={{
                    color: valueColor,
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  {value}
                </span>
              </div>
            )
          )}
        </div>

        <div className="tasks-container page-section">
          <div className="table-header-bar">
            <div className="flex items-center gap-2">
              <h2
                className="text-[15px] font-semibold"
                style={{
                  color: '#E5E2E1',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                All Tasks
              </h2>

              <span
                className="text-[11px] px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#6B7280',
                  border: '1px solid rgba(255,255,255,0.09)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {filteredTasks.length}{' '}
                {filteredTasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="relative">
                <span
                  className="absolute left-2.5 top-1/2 -translate-y-1/2"
                  style={{ color: '#4B5563' }}
                >
                  <IconSearch />
                </span>

                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input-glass"
                  style={{ minWidth: '180px' }}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="search-input-glass custom-select"
                style={{
                  paddingLeft: '12px',
                  cursor: 'pointer',
                }}
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="Claimed">Claimed</option>
                <option value="Submitted">Submitted</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <TasksTable
            tasks={filteredTasks}
            onEdit={setEditTask}
            onRefresh={loadTasks}
          />
        </div>
      </main>

      {showCreate && (
        <CreateTaskModal
          onClose={() => setShowCreate(false)}
          onCreated={loadTasks}
        />
      )}

      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onUpdated={() => {
            loadTasks();
            setEditTask(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;