import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../api/client';

function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getDashboard();
        setKpis(data.kpis);
        setChartData(data.chartData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading dashboard...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</p>;

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Dashboard</h1>
        <Link to="/assignments">Go to Assignments</Link>
      </div>

      <div style={{ display: 'flex', gap: 16, margin: '24px 0' }}>
        <KpiCard label="Total" value={kpis.total} />
        <KpiCard label="Overdue" value={kpis.overdue} color="#c0392b" />
        <KpiCard label="Due This Week" value={kpis.dueThisWeek} color="#d68910" />
        <KpiCard label="Completed" value={kpis.completed} color="#27ae60" />
      </div>

      <h3>Completion Over Time</h3>
      {chartData.length === 0 ? (
        <p>No completed assignments yet — complete some to see your progress chart.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3498db" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function KpiCard({ label, value, color = '#333' }) {
  return (
    <div style={{ flex: 1, padding: 16, border: '1px solid #ddd', borderRadius: 8, textAlign: 'center' }}>
      <div style={{ fontSize: 28, fontWeight: 'bold', color }}>{value}</div>
      <div style={{ color: '#666' }}>{label}</div>
    </div>
  );
}

export default Dashboard;