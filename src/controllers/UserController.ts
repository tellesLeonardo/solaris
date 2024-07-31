import { Request, Response } from "express";
import { UserService } from "../services/UserService";

const userService = new UserService();

export const signUp =  async (request: Request, response: Response) => {
    const {username, password, plan} = request.body;

    const result = await userService.createUser(username, password, plan);

    if(result instanceof Error){
        return response.status(400).json(result.message);
    }

    return response.status(201).send(result);
};

export const signIn =  async (request: Request, response: Response) => {

    const { username, password } = request.body;
    const result = await userService.authenticateUser(username, password);
    
    if (result instanceof Error){
        return response.status(400).json({ message: result.message });
    };

    return response.status(200).json({ result });
};

export const updateUser = async (request: Request, response: Response) => {
    const { id } = request.params;
    const { username, password, plan } = request.body;
    const result = await userService.updateUser(Number(id), username, password, plan);
    
    if(result instanceof Error){
        return response.status(400).json({ message: result.message });
    }

    return response.status(200).send(result);
};