
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Election Management API',
      version: '1.0.0',
      description: 'API documentation for election system',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    components: {
      schemas: {
        Voter: {
          type: 'object',
          required: ['name', 'age'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: 'Sakshi Kore'
            },
            age: {
              type: 'integer',
              example: 22
            }
          }
        },
        Candidate: {
          type: 'object',
          required: ['name', 'party'],
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Arjun' },
            party: { type: 'string', example: 'Democratic' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
