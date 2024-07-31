import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Todo } from './Todo';

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ type: 'char', length: 1 })
  plan!: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos!: Todo[];
}
