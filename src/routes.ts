import { Router } from "express";
import { signUp, signIn, updateUser  } from "./controllers/UserController";
import { createTodo, getTodos, updateTodo, deleteTodo } from "./controllers/TodoController";
import { createTask, getTasks,updateTask, deleteTask} from "./controllers/TaskController";
import {authenticateJWT} from "./middlewares/auth.middleware"

const routes = Router();

// Rotas de autenticação
routes.post("/signup", signUp);
routes.post("/signin", signIn);
routes.put("/users/:id", authenticateJWT, updateUser);

// Rotas de Todo
routes.post("/todos", authenticateJWT, createTodo);
routes.get("/todos", authenticateJWT, getTodos);
routes.put("/todos/:id", authenticateJWT, updateTodo);
routes.delete("/todos/:id", authenticateJWT, deleteTodo);

// Rotas de Task
routes.post("/tasks", authenticateJWT, createTask);
routes.get("/tasks/:todoId", authenticateJWT, getTasks);
routes.put("/tasks/:id", authenticateJWT, updateTask);
routes.delete("/tasks/:id", authenticateJWT, deleteTask);

export {routes}