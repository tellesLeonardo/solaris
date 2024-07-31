import { Request, Response } from "express";
import { TaskService } from "../services/TaskService";

const taskService = new TaskService();

export const createTask = async (request: Request, response: Response) => {
    const { title, description, todoId } = request.body;
    const result = await taskService.createTask(title, description, todoId);
  
    if(result instanceof Error){
        response.status(400).json({ message: result.message }); 
    }

    response.status(201).send(result);
};

export const getTasks = async (request: Request, response: Response) => {
    const { todoId } = request.params;
    const result = await taskService.getTasks(Number(todoId));
    
    if(result instanceof Error){
        response.status(400).json({ message: result.message }); 
    }

    response.status(200).send(result);
};

export const updateTask = async (request: Request, response: Response) => {

    const { id } = request.params;
    const { title, description, completed } = request.body;
    const result = await taskService.updateTask(Number(id), title, description, completed);

    if(result instanceof Error){
        response.status(400).json({ message: result.message }); 
    }

    response.status(200).send(result);
};

export const deleteTask = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    await taskService.deleteTask(Number(id));
    response.status(204).send();
  } catch (error) {
    const typedError = error as Error;
    response.status(400).json({ message: typedError.message });
  }
};
