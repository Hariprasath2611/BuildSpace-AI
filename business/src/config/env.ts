import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/buildspace-business',
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'mock_webhook_secret'
  },
  cashfree: {
    appId: process.env.CASHFREE_APP_ID || 'mock_cf_app_id',
    secretKey: process.env.CASHFREE_SECRET_KEY || 'mock_cf_secret',
    env: process.env.CASHFREE_ENV || 'SANDBOX'
  },
  gst: {
    companyStateCode: '29', // Assuming Karnataka (29) for CGST/SGST vs IGST defaults
  }
};
