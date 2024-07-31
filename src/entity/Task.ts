import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Todo } from './Todo';

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ default: false })
  completed!: boolean;

  @ManyToOne(() => Todo, (todo) => todo.tasks)
  todo!: Todo;
}
