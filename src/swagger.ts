import swaggerJSDoc, { Options, SwaggerDefinition } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Configurações do Swagger
const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Todo API',
    version: '1.0.0',
    description: 'API de gerenciamento de tarefas',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de Desenvolvimento',
    },
  ],
};

const options: Options = {
  swaggerDefinition,
  apis: ['./src/routes.ts', './src/controller/*.ts'], // Caminho para os arquivos que contêm as anotações JSDoc
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec, swaggerUi };
