const assignmentRepository = require('../repository/assignment.repository');

const VALID_PRIORITIES = ['High', 'Medium', 'Low'];
const VALID_STATUSES = ['Not Started', 'In Progress', 'Complete'];

function validateAssignmentInput({ title, course_name, due_date, priority }) {
  if (!title || !course_name || !due_date || !priority) {
    throw { status: 400, message: 'Title, course name, due date, and priority are required.' };
  }
  if (!VALID_PRIORITIES.includes(priority)) {
    throw { status: 400, message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}.` };
  }
}

function createAssignment(userId, data) {
  validateAssignmentInput(data);
  return assignmentRepository.createAssignment(userId, data);
}

function getAssignments(userId, filters) {
  return assignmentRepository.findAssignmentsByUser(userId, filters);
}

function updateAssignment(userId, id, data) {
  const existing = assignmentRepository.findAssignmentById(id);
  if (!existing || existing.user_id !== userId) {
    throw { status: 404, message: 'Assignment not found.' };
  }
  validateAssignmentInput({ ...existing, ...data });
  return assignmentRepository.updateAssignment(id, data);
}

function updateStatus(userId, id, status) {
  const existing = assignmentRepository.findAssignmentById(id);
  if (!existing || existing.user_id !== userId) {
    throw { status: 404, message: 'Assignment not found.' };
  }
  if (!VALID_STATUSES.includes(status)) {
    throw { status: 400, message: `Status must be one of: ${VALID_STATUSES.join(', ')}.` };
  }
  return assignmentRepository.updateStatus(id, status);
}

function deleteAssignment(userId, id) {
  const existing = assignmentRepository.findAssignmentById(id);
  if (!existing || existing.user_id !== userId) {
    throw { status: 404, message: 'Assignment not found.' };
  }
  assignmentRepository.deleteAssignment(id);
}

function exportAssignmentsCsv(userId, filters) {
  const assignments = assignmentRepository.findAssignmentsByUser(userId, filters);
  const headers = ['Title', 'Course', 'Due Date', 'Priority', 'Status'];
  const rows = assignments.map((a) => [a.title, a.course_name, a.due_date, a.priority, a.status]);

  const escapeCsv = (val) => `"${String(val).replace(/"/g, '""')}"`;
  const csvLines = [headers.map(escapeCsv).join(',')];
  rows.forEach((row) => csvLines.push(row.map(escapeCsv).join(',')));

  return csvLines.join('\n');
}

module.exports = {
  createAssignment,
  getAssignments,
  updateAssignment,
  updateStatus,
  deleteAssignment,
  exportAssignmentsCsv,
};