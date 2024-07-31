import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Todo } from "./entity/Todo";
import { Task } from "./entity/Task";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION as any,
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT || "5432"),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    synchronize: true,
    logging: false,
    entities: [User, Todo, Task],
    migrations: [],
    subscribers: [],
});
