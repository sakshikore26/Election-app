const db = require('../models');

const createCandidate = async (data) => {
  if (!data.name || !data.party) {
    const err = new Error("Name and Party are required");
    err.status = 400;
    throw err;
  }

  const candidate = await db.Candidate.create(data);
  return candidate;
};

const getCandidateById = async (id) => {
  const candidate = await db.Candidate.findByPk(id);
  if (!candidate) {
    const err = new Error("Candidate not found");
    err.status = 404;
    throw err;
  }
  return candidate;
};

module.exports = { createCandidate, getCandidateById };