import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [courseName, setCourseName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');

  async function loadAssignments() {
    setLoading(true);
    try {
      const data = await api.getAssignments();
      setAssignments(data.assignments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssignments();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      await api.createAssignment({ title, course_name: courseName, due_date: dueDate, priority });
      setTitle('');
      setCourseName('');
      setDueDate('');
      setPriority('Medium');
      loadAssignments();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggleComplete(assignment) {
    const newStatus = assignment.status === 'Complete' ? 'Not Started' : 'Complete';
    try {
      await api.updateStatus(assignment.id, newStatus);
      loadAssignments();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteAssignment(id);
      loadAssignments();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Assignments</h1>
        <Link to="/dashboard">Dashboard</Link>
      </div>

      <form onSubmit={handleCreate} style={{ marginBottom: 24, padding: 16, border: '1px solid #ccc' }}>
        <h3>New Assignment</h3>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ marginRight: 8 }} />
        <input placeholder="Course name" value={courseName} onChange={(e) => setCourseName(e.target.value)} required style={{ marginRight: 8 }} />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required style={{ marginRight: 8 }} />
        <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ marginRight: 8 }}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button type="submit">Add</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : assignments.length === 0 ? (
        <p>No assignments yet. Add one above.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                  <button onClick={() => handleToggleComplete(a)} style={{ marginRight: 8 }}>
                    {a.status === 'Complete' ? 'Undo' : 'Complete'}
                  </button>
                  <button onClick={() => handleDelete(a.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Assignments;