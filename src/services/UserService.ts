import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { DicProductStrip, getCodePlan } from "../config/products_info";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PaymentService } from "../services/PaymentService";
import * as dotenv from "dotenv";

dotenv.config();

const paymentService = new PaymentService();

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async createUser(
    email: string,
    password: string,
    plan: string,
    paymentMethodId: string
  ): Promise<User | Error> {
    const upperPlan = plan.toUpperCase();

    const existsUser = await this.userRepository.findOneBy({ email });

    if (existsUser) {
      return new Error(`User already exists`);
    }

    if (!DicProductStrip.plans.includes(upperPlan)) {
      return new Error(
        `Plan must be one of the following values: ${DicProductStrip.plans}`
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.email = email;
    user.password = hashedPassword;
    user.plan = upperPlan;

    const customer = await paymentService.createCustomer(
      email,
      paymentMethodId
    ); // aqui eu crio o cliente na stripe
    const subscription = await paymentService.createSubscription(
      customer.id,
      getCodePlan(upperPlan)
    ); // aqui eu coloco o cliente para pagar a assinatura

    user.stripeCustomerId = customer.id;
    user.stripeSubscriptionId = subscription.id;

    return await this.userRepository.save(user);
  }

  async authenticateUser(
    email: string,
    password: string
  ): Promise<string | Error> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      return new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Error("Invalid password");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "4h" }
    );

    return token;
  }

  async updateUser(
    id: number,
    email?: string,
    password?: string,
    plan?: string
  ): Promise<User | Error> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      return new Error("User not found");
    }

    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (plan) {
      const upperPlan = plan.toUpperCase();
      let stripeSubscriptionId = user.stripeSubscriptionId ?? "";

      if (!DicProductStrip.plans.includes(upperPlan)) {
        return new Error(
          `Plan must be one of the following values: ${DicProductStrip.plans}`
        );
      }

      if (user.stripeCustomerId) {
        await paymentService.cancelSubscription(stripeSubscriptionId); // aqui eu apago a assinatura antiga
        const subscription = await paymentService.createSubscription(
          user.stripeCustomerId,
          getCodePlan(upperPlan)
        ); // aqui eu coloco o cliente para pagar a assinatura
        stripeSubscriptionId = subscription.id;
      }

      user.stripeSubscriptionId = stripeSubscriptionId;
      user.plan = upperPlan;
    }

    return await this.userRepository.save(user);
  }
}
