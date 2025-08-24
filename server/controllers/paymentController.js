const { Transaction, Client } = require('../models');
const { encryptData } = require('../utils/security');
const { logDataAccess } = require('../utils/popia');

// Process payment
exports.processPayment = async (req, res) => {
  try {
    const { amount, currency, paymentMethod, clientId, projectId } = req.body;
    
    // POPIA: Log payment initiation
    await logDataAccess(req.user.id, 'payment_initiated', 'client', clientId);
    
    // Encrypt sensitive payment data
    const encryptedCard = encryptData(req.body.cardDetails);
    
    // Create transaction record
    const transaction = await Transaction.create({
      amount,
      currency,
      paymentMethod,
      status: 'pending',
      clientId,
      projectId,
      encryptedData: encryptedCard,
      userId: req.user.id
    });
    
    // Process payment with payment gateway (simplified)
    // In a real implementation, integrate with PayFast, Peach Payments, etc.
    const paymentResult = await processPaymentGateway(amount, currency, req.body.cardDetails);
    
    if (paymentResult.success) {
      // Update transaction status
      transaction.status = 'completed';
      await transaction.save();
      
      // Create payout records
      await createPayouts(transaction.id, amount);
      
      // POPIA: Log payment completion
      await logDataAccess(req.user.id, 'payment_completed', 'transaction', transaction.id);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Payment processed successfully',
        transactionId: transaction.id
      });
    } else {
      transaction.status = 'failed';
      transaction.error = paymentResult.error;
      await transaction.save();
      
      return res.status(400).json({ 
        success: false, 
        message: 'Payment failed',
        error: paymentResult.error
      });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Helper function to process payment with gateway
async function processPaymentGateway(amount, currency, cardDetails) {
  // Simulated payment processing
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
}

// Create payouts according to the specified distribution
async function createPayouts(transactionId, amount) {
  const apexAmount = amount * 0.2; // 20% to Apex Digital AI
  const nexusAmount = amount * 0.2; // 20% to Nexus Platforms AI
  const ownerAmount = amount * 0.6; // 60% to owner
  
  // Create payout records in the database
  // This would typically integrate with your bank's API
}
