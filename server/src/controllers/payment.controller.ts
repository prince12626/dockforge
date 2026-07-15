import type { Request, Response } from "express";

import * as paymentService from "../services/payment.service.js";
import * as subscriptionService from "../services/subscription.service.js";

export async function verifyPayment(req: Request, res: Response) {
      try {
            if (!req.user) {
                  return res.status(401).json({
                        success: false,
                        message: "Unauthorized",
                  });
            }

            const {
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature,
            } = req.body;

            if (
                  !razorpay_order_id ||
                  !razorpay_payment_id ||
                  !razorpay_signature
            ) {
                  return res.status(400).json({
                        success: false,
                        message: "Missing payment details.",
                  });
            }

            const payment =
                  await paymentService.getPendingPayment(razorpay_order_id);

            if (!payment) {
                  return res.status(404).json({
                        success: false,
                        message: "Pending payment not found.",
                  });
            }

            // Prevent verifying another user's payment
            if (payment.userId !== req.user.id) {
                  return res.status(403).json({
                        success: false,
                        message: "Forbidden.",
                  });
            }

            const verified = paymentService.verifySignature(
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature,
            );

            if (!verified) {
                  await paymentService.markPaymentFailed(payment._id);

                  return res.status(400).json({
                        success: false,
                        message: "Payment verification failed.",
                  });
            }

            await paymentService.markPaymentSuccess({
                  paymentId: payment._id,
                  razorpayPaymentId: razorpay_payment_id,
                  signature: razorpay_signature,
            });

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30);

            await subscriptionService.createSubscription({
                  userId: payment.userId,
                  planId: payment.planId,
                  expiresAt,
            });

            return res.status(200).json({
                  success: true,
                  message: "Payment verified successfully.",
            });
      } catch (error) {
            console.error(error);

            return res.status(500).json({
                  success: false,
                  message: "Internal Server Error",
            });
      }
}
