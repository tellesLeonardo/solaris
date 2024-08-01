import { Stripe } from "stripe";
import { User } from "../entity/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export class PaymentService {
  // Método para criar um cliente no Stripe
  async createCustomer(email: string): Promise<Stripe.Customer> {
    try {
      // Cria um cliente no Stripe
      const customer = await stripe.customers.create({ email: email });

      return customer;
    } catch (error) {
      throw new Error(`Failed to create customer: ${(error as Error).message}`);
    }
  }

  // Método para criar uma assinatura no Stripe
  async createSubscription(
    customerId: string,
    plan: string
  ): Promise<Stripe.Subscription> {
    try {
      // Cria uma assinatura no Stripe
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: plan, // ID do plano de pagamento no Stripe
          },
        ],
        expand: ["latest_invoice.payment_intent"], // Expande a resposta para incluir detalhes do pagamento
      });

      if (subscription.status !== "active") {
        throw new Error("Subscription could not be created");
      }

      return subscription;
    } catch (error) {
      throw new Error(
        `Failed to create subscription: ${(error as Error).message}`
      );
    }
  }

  // Método para cancelar uma assinatura no Stripe
  async cancelSubscription(
    subscriptionId: string
  ): Promise<Stripe.Subscription> {
    try {
      const subscription = await stripe.subscriptions.cancel(subscriptionId);
      return subscription;
    } catch (error) {
      throw new Error(
        `Failed to cancel subscription: ${(error as Error).message}`
      );
    }
  }

  async Checkout(priceId: string, stripeCustomerId: string) {
    const checkout = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      customer: stripeCustomerId,
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    return checkout;
  }

  // Método para obter a assinatura de um cliente
  async getSubscription(
    customerId?: string
  ): Promise<Stripe.Subscription | null> {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        limit: 1,
      });

      return subscriptions.data.length ? subscriptions.data[0] : null;
    } catch (error) {
      throw new Error(
        `Failed to retrieve subscription: ${(error as Error).message}`
      );
    }
  }
}
