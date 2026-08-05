const request = require('supertest');
const app = require('../../app');
const { clearDatabase } = require('../helpers/dbHelper');

const testUser = {
  name: 'Test User',
  email: 'assignments@example.com',
  password: 'password123',
};

const sampleAssignment = {
  title: 'Midterm Essay',
  course_name: 'History 101',
  due_date: '2026-12-15',
  priority: 'High',
};

async function registerAndLogin(agent) {
  await agent.post('/api/auth/register').send(testUser);
}

describe('Assignments API', () => {
  let agent;

  beforeEach(async () => {
    clearDatabase();
    agent = request.agent(app);
    await registerAndLogin(agent);
  });

  it('POST /api/assignments creates an assignment', async () => {
    const res = await agent.post('/api/assignments').send(sampleAssignment);

    expect(res.status).toBe(201);
    expect(res.body.assignment).toMatchObject({
      title: sampleAssignment.title,
      course_name: sampleAssignment.course_name,
      due_date: sampleAssignment.due_date,
      priority: sampleAssignment.priority,
      status: 'Not Started',
    });
    expect(res.body.assignment.id).toBeDefined();
  });

  it('POST /api/assignments rejects missing fields', async () => {
    const res = await agent.post('/api/assignments').send({ title: 'Incomplete' });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('required');
  });

  it('GET /api/assignments returns user assignments', async () => {
    await agent.post('/api/assignments').send(sampleAssignment);
    await agent.post('/api/assignments').send({
      ...sampleAssignment,
      title: 'Lab Report',
      course_name: 'Chemistry',
      priority: 'Medium',
    });

    const res = await agent.get('/api/assignments');

    expect(res.status).toBe(200);
    expect(res.body.assignments).toHaveLength(2);
  });

  it('GET /api/assignments filters by course', async () => {
    await agent.post('/api/assignments').send(sampleAssignment);
    await agent.post('/api/assignments').send({
      ...sampleAssignment,
      title: 'Lab Report',
      course_name: 'Chemistry',
    });

    const res = await agent.get('/api/assignments').query({ course: 'History 101' });

    expect(res.status).toBe(200);
    expect(res.body.assignments).toHaveLength(1);
    expect(res.body.assignments[0].course_name).toBe('History 101');
  });

  it('GET /api/assignments requires authentication', async () => {
    const res = await request(app).get('/api/assignments');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('You must be logged in to do that.');
  });

  it('GET /api/assignments/export returns CSV', async () => {
    await agent.post('/api/assignments').send(sampleAssignment);

    const res = await agent.get('/api/assignments/export');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/csv/);
    expect(res.text).toContain('"Title","Course","Due Date","Priority","Status"');
    expect(res.text).toContain('Midterm Essay');
    expect(res.text).toContain('History 101');
  });
});
