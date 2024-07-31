import { AppDataSource } from "../data-source";
import { Todo } from "../entity/Todo";
import { User } from "../entity/User";

export class TodoService {
  private todoRepository = AppDataSource.getRepository(Todo);
  private userRepository = AppDataSource.getRepository(User);

  async createTodo(
    title: string,
    description: string,
    userId: number
  ): Promise<Todo | Error> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["todos"],
    });

    if (!user) {
      return new Error("User not found");
    }

    const activeTodos = user.todos.filter((todo) => todo.active);
    const currentActiveTodoCount = activeTodos.length;

    if (!user.canCreateMoreTodos(currentActiveTodoCount)) {
      return new Error(
        `The user has exceeded the maximum limit of ALL that can be created by the plan ${user.TranslateCharPlan()}`
      );
    }

    const todo = new Todo();
    todo.title = title;
    todo.description = description;
    todo.user = user;

    return await this.todoRepository.save(todo);
  }

  async getTodos(userId: number): Promise<Todo[] | Error> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      return new Error("User not found");
    }

    return await this.todoRepository.find({
      where: { user: { id: userId } },
      relations: ["tasks"],
    });
  }

  async updateTodo(
    id: number,
    title?: string,
    description?: string,
    active?: boolean
  ): Promise<Todo | Error> {
    const todo = await this.todoRepository.findOneBy({ id });

    if (!todo) {
      return new Error("Todo not found");
    }

    if (title) todo.title = title;
    if (description) todo.description = description;
    if (active) todo.active = active;

    return await this.todoRepository.save(todo);
  }

  //   vou manter um soft delete por achar que é mais interessante
  async deleteTodo(id: number): Promise<void | Error> {
    const todo = await this.todoRepository.findOneBy({ id });

    if (!todo) {
      throw new Error("Todo not found");
    }

    todo.active = false;

    await this.todoRepository.save(todo);
  }
}
