jest.mock('../../repository/assignment.repository');

const assignmentRepository = require('../../repository/assignment.repository');
const dashboardService = require('../../services/dashboard.service');

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function daysFromToday(offset) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return formatDate(d);
}

describe('dashboard.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboardData', () => {
    it('calculates KPIs and chart data from assignments', () => {
      assignmentRepository.findAssignmentsByUser.mockReturnValue([
        {
          id: 1,
          status: 'Complete',
          due_date: daysFromToday(-5),
          completed_at: `${daysFromToday(-2)}T10:00:00.000Z`,
        },
        {
          id: 2,
          status: 'Complete',
          due_date: daysFromToday(-1),
          completed_at: `${daysFromToday(-2)}T12:00:00.000Z`,
        },
        {
          id: 3,
          status: 'Not Started',
          due_date: daysFromToday(-3),
        },
        {
          id: 4,
          status: 'In Progress',
          due_date: daysFromToday(3),
        },
        {
          id: 5,
          status: 'Not Started',
          due_date: daysFromToday(10),
        },
      ]);

      const result = dashboardService.getDashboardData(1);

      expect(assignmentRepository.findAssignmentsByUser).toHaveBeenCalledWith(1, {});
      expect(result.kpis).toEqual({
        total: 5,
        completed: 2,
        overdue: 1,
        dueThisWeek: 1,
      });
      expect(result.chartData).toEqual([
        { date: daysFromToday(-2), count: 2 },
      ]);
    });

    it('returns zero KPIs when user has no assignments', () => {
      assignmentRepository.findAssignmentsByUser.mockReturnValue([]);

      const result = dashboardService.getDashboardData(1);

      expect(result.kpis).toEqual({
        total: 0,
        overdue: 0,
        dueThisWeek: 0,
        completed: 0,
      });
      expect(result.chartData).toEqual([]);
    });
  });
});
