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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const image_ingestion_1 = require("./services/image-ingestion");
const payment_1 = require("./services/payment");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Set up Multer for memory storage to avoid writing images to disk at all if possible,
// but for the sake of S3 uploading, we keep it in memory.
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
app.post('/api/scan', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }
        // 1. Send to Ephemeral Pipeline
        console.log('[API] Received scan, starting ephemeral pipeline...');
        const result = yield (0, image_ingestion_1.processAndDiscardImage)(req.file);
        // 2. Return the parsed metadata overlay (Board, Class, Topic) to the Magic Camera UI
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        console.error('[API] Error processing scan:', error);
        res.status(500).json({ error: 'Failed to process scan' });
    }
}));
// Payment API integration
app.post('/api/pay/create-order', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, metadata } = req.body;
        // 2% standard rate processing handled in wrapper
        const order = yield (0, payment_1.createBillingOrder)(amount, metadata);
        res.json({ success: true, order });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create payment order' });
    }
}));
app.post('/api/pay/verify', (req, res) => {
    const { order_id, payment_id, signature } = req.body;
    const isVerified = (0, payment_1.verifyPaymentSignature)(order_id, payment_id, signature);
    if (isVerified) {
        res.json({ success: true, message: 'Payment verified successfully' });
    }
    else {
        res.status(400).json({ success: false, error: 'Invalid signature' });
    }
});
app.listen(port, () => {
    console.log(`[Server] AI Pathshala Backend listening on port ${port}`);
});
