import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [courseName, setCourseName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');

  const [filterCourse, setFilterCourse] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('due_date');

  async function loadAssignments() {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filterCourse) params.course = filterCourse;
      if (filterPriority) params.priority = filterPriority;
      if (filterStatus) params.status = filterStatus;
      if (sortBy) params.sort = sortBy;

      const data = await api.getAssignments(params);
      setAssignments(data.assignments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssignments();
  }, [filterCourse, filterPriority, filterStatus, sortBy]);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setActionLoading(true);
    try {
      await api.createAssignment({ title, course_name: courseName, due_date: dueDate, priority });
      setTitle('');
      setCourseName('');
      setDueDate('');
      setPriority('Medium');
      await loadAssignments();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  function handleExport() {
    const params = {};
    if (filterCourse) params.course = filterCourse;
    if (filterPriority) params.priority = filterPriority;
    if (filterStatus) params.status = filterStatus;
    api.exportAssignmentsCsv(params);
  }

  async function handleToggleComplete(assignment) {
    const newStatus = assignment.status === 'Complete' ? 'Not Started' : 'Complete';
    setActionLoading(true);
    try {
      await api.updateStatus(assignment.id, newStatus);
      await loadAssignments();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(id) {
    setActionLoading(true);
    try {
      await api.deleteAssignment(id);
      await loadAssignments();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <h1>Assignments</h1>
        <div>
          <button onClick={handleExport} disabled={actionLoading} style={{ marginRight: 12 }}>Export CSV</button>
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </div>

      <form onSubmit={handleCreate} style={{ marginBottom: 24, padding: 16, border: '1px solid #ccc' }}>
        <h3>New Assignment</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input placeholder="Course name" value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button type="submit" disabled={actionLoading}>{actionLoading ? 'Saving...' : 'Add'}</button>
        </div>
      </form>

      <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <strong>Filters:</strong>
        <input
          placeholder="Filter by course"
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
        />
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Complete">Complete</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="due_date">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
        </select>
        {loading && <span style={{ color: '#888' }}>Refreshing...</span>}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading assignments...</p>
      ) : assignments.length === 0 ? (
        <p>No assignments match your filters.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #333' }}>
                <th>Title</th>
                <th>Course</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td>{a.title}</td>
                  <td>{a.course_name}</td>
                  <td>{a.due_date}</td>
                  <td>{a.priority}</td>
                  <td>{a.status}</td>
                  <td>
                    <button onClick={() => handleToggleComplete(a)} disabled={actionLoading} style={{ marginRight: 8 }}>
                      {a.status === 'Complete' ? 'Undo' : 'Complete'}
                    </button>
                    <button onClick={() => handleDelete(a.id)} disabled={actionLoading}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Assignments;