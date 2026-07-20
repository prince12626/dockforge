export {};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open(): void;
    };
  }

  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    order_id: string;
    name: string;
    description?: string;

    handler(response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }): void;

    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };

    theme?: {
      color?: string;
    };

    modal?: {
      ondismiss?: () => void;
    };
  }
}
