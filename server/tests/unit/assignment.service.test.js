jest.mock('../../repository/assignment.repository');

const assignmentRepository = require('../../repository/assignment.repository');
const assignmentService = require('../../services/assignment.service');

const validInput = {
  title: 'Essay',
  course_name: 'History',
  due_date: '2026-12-01',
  priority: 'High',
};

describe('assignment.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAssignment', () => {
    it('throws 400 when required fields are missing', () => {
      expect(() => assignmentService.createAssignment(1, {})).toThrow(
        expect.objectContaining({
          status: 400,
          message: 'Title, course name, due date, and priority are required.',
        })
      );
    });

    it('throws 400 for invalid priority', () => {
      expect(() =>
        assignmentService.createAssignment(1, { ...validInput, priority: 'Urgent' })
      ).toThrow(
        expect.objectContaining({
          status: 400,
          message: 'Priority must be one of: High, Medium, Low.',
        })
      );
    });

    it('creates assignment via repository', () => {
      const created = { id: 1, user_id: 1, ...validInput, status: 'Not Started' };
      assignmentRepository.createAssignment.mockReturnValue(created);

      const result = assignmentService.createAssignment(1, validInput);

      expect(assignmentRepository.createAssignment).toHaveBeenCalledWith(1, validInput);
      expect(result).toEqual(created);
    });
  });

  describe('updateAssignment', () => {
    it('throws 404 when assignment does not exist', () => {
      assignmentRepository.findAssignmentById.mockReturnValue(null);

      expect(() => assignmentService.updateAssignment(1, 99, validInput)).toThrow(
        expect.objectContaining({ status: 404, message: 'Assignment not found.' })
      );
    });

    it('throws 404 when assignment belongs to another user', () => {
      assignmentRepository.findAssignmentById.mockReturnValue({ id: 1, user_id: 2, ...validInput });

      expect(() => assignmentService.updateAssignment(1, 1, validInput)).toThrow(
        expect.objectContaining({ status: 404 })
      );
    });
  });

  describe('updateStatus', () => {
    it('throws 400 for invalid status', () => {
      assignmentRepository.findAssignmentById.mockReturnValue({ id: 1, user_id: 1, ...validInput });

      expect(() => assignmentService.updateStatus(1, 1, 'Done')).toThrow(
        expect.objectContaining({
          status: 400,
          message: 'Status must be one of: Not Started, In Progress, Complete.',
        })
      );
    });

    it('updates status via repository', () => {
      assignmentRepository.findAssignmentById.mockReturnValue({ id: 1, user_id: 1, ...validInput });
      assignmentRepository.updateStatus.mockReturnValue({ id: 1, status: 'Complete' });

      const result = assignmentService.updateStatus(1, 1, 'Complete');

      expect(assignmentRepository.updateStatus).toHaveBeenCalledWith(1, 'Complete');
      expect(result.status).toBe('Complete');
    });
  });

  describe('exportAssignmentsCsv', () => {
    it('returns CSV with headers and escaped values', () => {
      assignmentRepository.findAssignmentsByUser.mockReturnValue([
        {
          title: 'Essay "Draft"',
          course_name: 'History',
          due_date: '2026-12-01',
          priority: 'High',
          status: 'Not Started',
        },
      ]);

      const csv = assignmentService.exportAssignmentsCsv(1, { course: 'History' });

      expect(assignmentRepository.findAssignmentsByUser).toHaveBeenCalledWith(1, { course: 'History' });
      expect(csv).toBe(
        '"Title","Course","Due Date","Priority","Status"\n"Essay ""Draft""","History","2026-12-01","High","Not Started"'
      );
    });

    it('returns headers only when there are no assignments', () => {
      assignmentRepository.findAssignmentsByUser.mockReturnValue([]);

      const csv = assignmentService.exportAssignmentsCsv(1, {});

      expect(csv).toBe('"Title","Course","Due Date","Priority","Status"');
    });
  });
});
