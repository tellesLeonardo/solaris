-- Cria a tabela de usuários

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    plan CHAR(1) NOT NULL
);

-- Plan vai ter apenas 1 char que siginifca  | F - free | P - pro | D - deluxe

-- Cria a tabela de grupos de tarefas (todos)
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    userId INTEGER NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
);

-- Cria a tabela de tarefas (tasks)
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    todoId INTEGER NOT NULL,
    FOREIGN KEY (todoId) REFERENCES todos (id) ON DELETE CASCADE
);
