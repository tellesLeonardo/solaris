import { Request, Response } from "express";
import { TodoService } from "../services/TodoService";

const todoService = new TodoService();

export const createTodo = async (request: Request, response: Response) => {
  const { title, description } = request.body;
  const userId = request.user.id;
  const result = await todoService.createTodo(title, description, userId);

  if (result instanceof Error) {
    response.status(400).json({ message: result.message });
  }

  response.status(201).send(result);
};

export const getTodos = async (request: Request, response: Response) => {
  const userId = request.user.id;
  const result = await todoService.getTodos(userId);

  if (result instanceof Error) {
    response.status(400).json({ message: result.message });
  }

  response.status(200).send(result);
};

export const updateTodo = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { title, description, active } = request.body;
  const result = await todoService.updateTodo(
    Number(id),
    title,
    description,
    active
  );

  if (result instanceof Error) {
    response.status(400).json({ message: result.message });
  }

  response.status(200).send(result);
};

export const deleteTodo = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    await todoService.deleteTodo(Number(id));
    response.status(204).send();
  } catch (error) {
    const typedError = error as Error;
    response.status(400).json({ message: typedError.message });
  }
};
