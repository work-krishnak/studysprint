const request = require('supertest');
const app = require('../../app');
const { clearDatabase } = require('../helpers/dbHelper');

const testUser = {
  name: 'Dashboard User',
  email: 'dashboard@example.com',
  password: 'password123',
};

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function daysFromToday(offset) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return formatDate(d);
}

async function createAssignment(agent, overrides = {}) {
  return agent.post('/api/assignments').send({
    title: 'Assignment',
    course_name: 'Test Course',
    due_date: daysFromToday(5),
    priority: 'Medium',
    ...overrides,
  });
}

describe('Dashboard API', () => {
  let agent;

  beforeEach(async () => {
    clearDatabase();
    agent = request.agent(app);
    await agent.post('/api/auth/register').send(testUser);
  });

  it('GET /api/dashboard returns KPIs and chart data', async () => {
    await createAssignment(agent, { title: 'Overdue Task', due_date: daysFromToday(-2) });
    await createAssignment(agent, { title: 'Due Soon', due_date: daysFromToday(3) });
    await createAssignment(agent, { title: 'Future Task', due_date: daysFromToday(14) });

    const completeRes = await createAssignment(agent, {
      title: 'Done Task',
      due_date: daysFromToday(-1),
    });
    await agent
      .patch(`/api/assignments/${completeRes.body.assignment.id}/status`)
      .send({ status: 'Complete' });

    const res = await agent.get('/api/dashboard');

    expect(res.status).toBe(200);
    expect(res.body.kpis).toEqual({
      total: 4,
      overdue: 1,
      dueThisWeek: 1,
      completed: 1,
    });
    expect(Array.isArray(res.body.chartData)).toBe(true);
    expect(res.body.chartData.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/dashboard requires authentication', async () => {
    const res = await request(app).get('/api/dashboard');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('You must be logged in to do that.');
  });

  it('GET /api/dashboard returns empty KPIs for new user', async () => {
    const res = await agent.get('/api/dashboard');

    expect(res.status).toBe(200);
    expect(res.body.kpis).toEqual({
      total: 0,
      overdue: 0,
      dueThisWeek: 0,
      completed: 0,
    });
    expect(res.body.chartData).toEqual([]);
  });
});
