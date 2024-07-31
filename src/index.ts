import "reflect-metadata";
import { AppDataSource } from "./data-source";
import express from "express";
import { router } from "./routes";
import { swaggerSpec, swaggerUi } from "./swagger";

const app = express();
const port = 3000;

AppDataSource.initialize()
  .then(async () => {
    app.use(express.json());

    app.use(router);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));

export { app };
