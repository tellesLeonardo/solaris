import "reflect-metadata";
import { AppDataSource } from "./data-source";
import express, { Request, Response } from "express";
import { routes } from "./routes";

const app = express();
const port = 3000;

AppDataSource.initialize()
  .then(async () => {
    app.use(express.json());

    app.use(routes);

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));

export { app };
