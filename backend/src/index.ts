import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { processAndDiscardImage } from './services/image-ingestion';
import { createBillingOrder, verifyPaymentSignature } from './services/payment';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Set up Multer for memory storage to avoid writing images to disk at all if possible,
// but for the sake of S3 uploading, we keep it in memory.
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/scan', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        // 1. Send to Ephemeral Pipeline
        console.log('[API] Received scan, starting ephemeral pipeline...');
        const result = await processAndDiscardImage(req.file);

        // 2. Return the parsed metadata overlay (Board, Class, Topic) to the Magic Camera UI
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('[API] Error processing scan:', error);
        res.status(500).json({ error: 'Failed to process scan' });
    }
});

// Payment API integration
app.post('/api/pay/create-order', async (req, res) => {
    try {
        const { amount, metadata } = req.body;
        // 2% standard rate processing handled in wrapper
        const order = await createBillingOrder(amount, metadata);
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create payment order' });
    }
});

app.post('/api/pay/verify', (req, res) => {
    const { order_id, payment_id, signature } = req.body;
    const isVerified = verifyPaymentSignature(order_id, payment_id, signature);
    if (isVerified) {
        res.json({ success: true, message: 'Payment verified successfully' });
    } else {
        res.status(400).json({ success: false, error: 'Invalid signature' });
    }
});

app.listen(port, () => {
    console.log(`[Server] AI Pathshala Backend listening on port ${port}`);
});
