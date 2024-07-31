import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async createUser(username: string, password: string, plan: string): Promise<User | Error> {
    const upperPlan = plan.toUpperCase();

    if (!process.env.PLANS_ACCEPTS?.split(",").includes(upperPlan)) {
        return new Error(`Plan must be one of the following values: ${process.env.PLANS_ACCEPTS}`);    
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.username = username;
    user.password = hashedPassword;
    user.plan = upperPlan;

    return await this.userRepository.save(user);
  }

  async authenticateUser(username: string, password: string): Promise<string | Error> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      return new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Error('Invalid password');
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET!, { expiresIn: '4h' });

    return token;
  }

  async updateUser(id: number, username?: string, password?: string, plan?: string): Promise<User | Error> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      return new Error('User not found');
    }

    if (username) user.username = username;
    if (password) user.password = await bcrypt.hash(password, 10);;
    if (plan) {
      const upperPlan = plan.toUpperCase();
      if (!process.env.PLANS_ACCEPTS?.split(",").includes(upperPlan)) {
        return new Error(`Plan must be one of the following values: ${process.env.PLANS_ACCEPTS}`);
      }
      user.plan = upperPlan;
    }

    return await this.userRepository.save(user);
  }
}
