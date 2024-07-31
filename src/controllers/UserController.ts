import { Request, Response } from "express";
import { UserService } from "../services/UserService";

const userService = new UserService();

export const signUp = async (request: Request, response: Response) => {
  const { email, password, plan, paymentMethodId } = request.body;

  const result = await userService.createUser(
    email,
    password,
    plan,
    paymentMethodId
  );

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

  return response.status(200).json({ result });
};

export const updateUser = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { email, password, plan } = request.body;
  const result = await userService.updateUser(
    Number(id),
    email,
    password,
    plan
  );

  if (result instanceof Error) {
    return response.status(400).json({ message: result.message });
  }

  return response.status(200).send(result);
};
