import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';
import { Task } from './Task';

@Entity("todos")
export class Todo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ default: true })
  active!: boolean;
    
  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn({ name: "userId" })
  user!: User;

  @OneToMany(() => Task, (task) => task.todo)
  tasks!: Task[];
}
