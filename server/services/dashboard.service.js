const assignmentRepository = require('../repository/assignment.repository');

function getDashboardData(userId) {
  const all = assignmentRepository.findAssignmentsByUser(userId, {});

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekFromNow = new Date(today);
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const total = all.length;
  const completed = all.filter((a) => a.status === 'Complete').length;
  const overdue = all.filter((a) => {
    const due = new Date(a.due_date);
    return due < today && a.status !== 'Complete';
  }).length;
  const dueThisWeek = all.filter((a) => {
    const due = new Date(a.due_date);
    return due >= today && due <= weekFromNow && a.status !== 'Complete';
  }).length;

  const chartData = buildCompletionChart(all);

  return {
    kpis: { total, overdue, dueThisWeek, completed },
    chartData,
  };
}

function buildCompletionChart(assignments) {
  const counts = {};
  assignments.forEach((a) => {
    if (a.status === 'Complete' && a.completed_at) {
      const date = a.completed_at.split('T')[0];
      counts[date] = (counts[date] || 0) + 1;
    }
  });
  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

module.exports = { getDashboardData };