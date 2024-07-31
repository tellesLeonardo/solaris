import { Router } from "express";
import { signUp, signIn, updateUser } from "./controllers/UserController";
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} from "./controllers/TodoController";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "./controllers/TaskController";
import { authenticateJWT } from "./middlewares/AuthMiddleware";
import { cancelSubscription } from "./controllers/CancelController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operações de Autenticação
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Registrar um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - plan
 *               - paymentMethodId
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               plan:
 *                 type: string
 *               paymentMethodId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 plan:
 *                   type: string
 *                 stripeCustomerId:
 *                   type: string
 *                 stripeSubscriptionId:
 *                   type: string
 *             examples:
 *               application/json: 
 *                 value: {
 *                   "id": 1,
 *                   "username": "testuser@example.com",
 *                   "plan": "P",
 *                   "stripeCustomerId": "cus_XXXXXXXXXXXXXX",
 *                   "stripeSubscriptionId": "sub_XXXXXXXXXXXXXX"
 *                 }
 *       400:
 *         description: Erro na criação do usuário
 */
router.post('/signup', signUp);

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Autenticar um usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário autenticado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *             examples:
 *               application/json: 
 *                 value: {
 *                   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 }
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/signin', signIn);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualizar um usuário
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               plan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/users/:id', authenticateJWT, updateUser);

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Criar um novo TODO
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: TODO criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 userId:
 *                   type: integer
 *             examples:
 *               application/json: 
 *                 value: {
 *                   "id": 1,
 *                   "title": "Novo TODO",
 *                   "description": "Descrição do TODO",
 *                   "userId": 1
 *                 }
 *       400:
 *         description: Erro na criação do TODO
 */
router.post('/todos', authenticateJWT, createTodo);

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Obter todos os TODOs
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: Lista de TODOs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   userId:
 *                     type: integer
 *             examples:
 *               application/json: 
 *                 value: [
 *                   {
 *                     "id": 1,
 *                     "title": "TODO 1",
 *                     "description": "Descrição do TODO 1",
 *                     "userId": 1
 *                   },
 *                   {
 *                     "id": 2,
 *                     "title": "TODO 2",
 *                     "description": "Descrição do TODO 2",
 *                     "userId": 1
 *                   }
 *                 ]
 *       401:
 *         description: Não autorizado
 */
router.get('/todos', authenticateJWT, getTodos);

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Atualizar um TODO
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do TODO
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: TODO atualizado com sucesso
 *       404:
 *         description: TODO não encontrado
 */
router.put('/todos/:id', authenticateJWT, updateTodo);


/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Deletar um TODO
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do TODO
 *     responses:
 *       200:
 *         description: TODO deletado com sucesso
 *       404:
 *         description: TODO não encontrado
 */
router.delete('/todos/:id', authenticateJWT, deleteTodo);

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Operações de Tasks
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Criar uma nova Task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - todoId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               todoId:
 *                 type: integer
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 todoId:
 *                   type: integer
 *             examples:
 *               application/json: 
 *                 value: {
 *                   "id": 1,
 *                   "title": "Nova Task",
 *                   "description": "Descrição da Task",
 *                   "todoId": 1
 *                 }
 *       400:
 *         description: Erro na criação da Task
 */
router.post('/tasks', authenticateJWT, createTask);

/**
 * @swagger
 * /tasks/{todoId}:
 *   get:
 *     summary: Obter todas as Tasks de um TODO
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: todoId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do TODO
 *     responses:
 *       200:
 *         description: Lista de Tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   todoId:
 *                     type: integer
 *             examples:
 *               application/json: 
 *                 value: [
 *                   {
 *                     "id": 1,
 *                     "title": "Task 1",
 *                     "description": "Descrição da Task 1",
 *                     "todoId": 1
 *                   },
 *                   {
 *                     "id": 2,
 *                     "title": "Task 2",
 *                     "description": "Descrição da Task 2",
 *                     "todoId": 1
 *                   }
 *                 ]
 *       401:
 *         description: Não autorizado
 */
router.get('/tasks/:todoId', authenticateJWT, getTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Atualizar uma Task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da Task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task atualizada com sucesso
 *       404:
 *         description: Task não encontrada
 */
router.put('/tasks/:id', authenticateJWT, updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Deletar uma Task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da Task
 *     responses:
 *       200:
 *         description: Task deletada com sucesso
 *       404:
 *         description: Task não encontrada
 */
router.delete('/tasks/:id', authenticateJWT, deleteTask);


/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Operações de Assinaturas
 */

/**
 * @swagger
 * /subscriptions/{userId}:
 *   delete:
 *     summary: Cancelar uma assinatura
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Assinatura cancelada com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/subscriptions/:userId', authenticateJWT, cancelSubscription);

export { router };
