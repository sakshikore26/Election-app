const { createCandidate, getCandidateById } = require('../services/candidateService');
const db = require('../models');

// Mock the Sequelize models
jest.mock('../models', () => ({
  Candidate: {
    create: jest.fn(),
    findByPk: jest.fn(),
  },
}));

describe('Candidate Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCandidate', () => {
    it('should create a candidate successfully', async () => {
      const mockCandidate = { id: 1, name: 'Alice', party: 'Demo' };
      db.Candidate.create.mockResolvedValue(mockCandidate);

      const result = await createCandidate({ name: 'Alice', party: 'Demo' });

      expect(result).toEqual(mockCandidate);
      expect(db.Candidate.create).toHaveBeenCalledWith({ name: 'Alice', party: 'Demo' });
    });

    it('should throw error if name or party is missing', async () => {
      await expect(createCandidate({ name: '' })).rejects.toMatchObject({
        message: 'Name and Party are required',
        status: 400,
      });

      expect(db.Candidate.create).not.toHaveBeenCalled();
    });
  });

  describe('getCandidateById', () => {
    it('should return candidate if found', async () => {
      const mockCandidate = { id: 1, name: 'Alice', party: 'Demo' };
      db.Candidate.findByPk.mockResolvedValue(mockCandidate);

      const result = await getCandidateById(1);

      expect(result).toEqual(mockCandidate);
      expect(db.Candidate.findByPk).toHaveBeenCalledWith(1);
    });

    it('should throw 404 error if candidate not found', async () => {
      db.Candidate.findByPk.mockResolvedValue(null);

      await expect(getCandidateById(999)).rejects.toMatchObject({
        message: 'Candidate not found',
        status: 404,
      });
    });
  });
});
