import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { PaymentService } from "../services/PaymentService";

const userService = new UserService();

export const signUp = async (request: Request, response: Response) => {
  const { email, password, plan } = request.body;

  const result = await userService.createUser(email, password, plan);

  if (result instanceof Error) {
    return response.status(400).json(result.message);
  }

  return response.status(201).send(result);
};

export const signIn = async (request: Request, response: Response) => {
  const { email, password } = request.body;
  const result = await userService.authenticateUser(email, password);

  if (result instanceof Error) {
    return response.status(400).json({ message: result.message });
  }

  userService.updateSubscription(email);

  return response.status(200).json({ result });
};

export const updateUser = async (request: Request, response: Response) => {
  const { email, password } = request.body;
  const result = await userService.updateUser(request.user.id, email, password);

  if (result instanceof Error) {
    return response.status(400).json({ message: result.message });
  }

  return response.status(200).send(result);
};

export const updatePlanUser = async (request: Request, response: Response) => {
  const { plan } = request.body;
  const result = await userService.updatePlanUser(request.user.id, plan);

  if (result instanceof Error) {
    return response.status(400).json({ message: result.message });
  }

  return response.status(200).send(result);
};
