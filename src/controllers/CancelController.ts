import { Request, Response } from "express";
import { PaymentService } from "../services/PaymentService";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { getCodePlan } from "../config/products_info";


const paymentService = new PaymentService();

export const cancelSubscription = async (
  request: Request,
  response: Response
) => {
  const { userId } = request.params;

  const userRepository = AppDataSource.getRepository(User);

  try {
    const user = await userRepository.findOne({
      where: { id: parseInt(userId, 10) },
    });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    if (!user.stripeSubscriptionId) {
      return response
        .status(400)
        .json({ message: "User does not have an active subscription" });
    }

    await paymentService.cancelSubscription(user.stripeSubscriptionId);

    const subscription = await paymentService.createSubscription(
      user.stripeCustomerId,
      getCodePlan("F")
    );

    // Atualiza o usuário removendo os IDs de assinatura
    user.stripeSubscriptionId = subscription.id;
    await userRepository.save(user);

    response
      .status(200)
      .json({
        message: "Subscription canceled reverting to free subscription",
        subscription,
      });
  } catch (error) {
    response.status(500).json({ message: (error as Error).message });
  }
};
