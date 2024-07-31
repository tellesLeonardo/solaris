import { AppDataSource } from "../data-source";
import { Task } from "../entity/Task";
import { Todo } from "../entity/Todo";

export class TaskService {
  private taskRepository = AppDataSource.getRepository(Task);
  private todoRepository = AppDataSource.getRepository(Todo);

  async createTask(title: string, description: string, todoId: number): Promise<Task | Error> {
    const todo = await this.todoRepository.findOneBy({ id: todoId });

    if (!todo) {
        return new Error('Todo not found');
    }

    const task = new Task();
    task.title = title;
    task.description = description;
    task.todo = todo;

    return await this.taskRepository.save(task);
  }

  async getTasks(todoId: number): Promise<Task[] | Error> {
    const todo = await this.todoRepository.findOneBy({ id: todoId });

    if (!todo) {
        return new Error('Todo not found');
    }

    return await this.taskRepository.find({ where: { todo: { id: todoId } } });
  }

  async updateTask(id: number, title?: string, description?: string, completed?: boolean): Promise<Task | Error> {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
        return new Error('Task not found');
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (completed !== undefined) task.completed = completed;

    return await this.taskRepository.save(task);
  }

  async deleteTask(id: number): Promise<void | Error> {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
        throw new Error('Task not found');
    }

    await this.taskRepository.remove(task);
  }

}
