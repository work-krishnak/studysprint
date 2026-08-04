import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Dashboard</h1>
      <Link to="/assignments">Go to Assignments</Link>
    </div>
  );
}

export default Dashboard;