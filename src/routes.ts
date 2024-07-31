import { Router } from "express";
import { signUp, signIn, updateUser  } from "./controllers/UserController";
import {authenticateJWT} from "./middlewares/auth.middleware"

const routes = Router();


  // Rotas de autenticação
  routes.post("/signup", signUp);
  routes.post("/signin", signIn);
  routes.put("/users/:id", authenticateJWT, updateUser);



// rotas protegidas 

export {routes}