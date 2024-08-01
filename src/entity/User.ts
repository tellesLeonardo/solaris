import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Todo } from "./Todo";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "char", length: 1 })
  plan!: string;

  @Column({ nullable: true })
  stripeCustomerId?: string;

  @Column({ nullable: true })
  stripeSubscriptionId?: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos!: Todo[];

  canCreateMoreTodos(currentTodoCount: number): boolean {
    switch (this.plan) {
      case "F": // Free plan
        return currentTodoCount < 3;
      case "P": // Pro plan
        return currentTodoCount < 10;
      case "D": // Deluxe plan
        return true;
      default:
        return false;
    }
  }

  TranslateCharPlan(): string {
    switch (this.plan) {
      case "F":
        return "Free plan";
      case "P":
        return "Pro plan";
      case "D":
        return "Deluxe plan";
      default:
        return "Free plan";
    }
  }
}
