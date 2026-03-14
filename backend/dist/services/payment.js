"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBillingOrder = createBillingOrder;
exports.verifyPaymentSignature = verifyPaymentSignature;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});
// Standard rate 2% processing strategy wrapper
function createBillingOrder(amount, metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: metadata, // Store 7-layer context IDs if needed
        };
        try {
            const order = yield razorpay.orders.create(options);
            return order;
        }
        catch (error) {
            console.error("[Razorpay] Error creating order:", error);
            throw new Error("Billing integration failed");
        }
    });
}
function verifyPaymentSignature(order_id, payment_id, signature) {
    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret';
    const generated_signature = crypto_1.default
        .createHmac('sha256', secret)
        .update(order_id + "|" + payment_id)
        .digest('hex');
    if (generated_signature === signature) {
        return true;
    }
    return false;
}
