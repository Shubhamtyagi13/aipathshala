import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

// Standard rate 2% processing strategy wrapper
export async function createBillingOrder(amount: number, metadata: any) {
    const options = {
        amount: amount * 100, // amount in smallest currency unit (paise)
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: metadata, // Store 7-layer context IDs if needed
    };

    try {
        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        console.error("[Razorpay] Error creating order:", error);
        throw new Error("Billing integration failed");
    }
}

export function verifyPaymentSignature(
    order_id: string,
    payment_id: string,
    signature: string
) {
    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret';
    const generated_signature = crypto
        .createHmac('sha256', secret)
        .update(order_id + "|" + payment_id)
        .digest('hex');

    if (generated_signature === signature) {
        return true;
    }
    return false;
}
