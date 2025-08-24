const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// Owner authentication required for all dashboard routes
router.use(authMiddleware.ownerOnly);

// Dashboard routes
router.get('/revenue', dashboardController.getRevenueData);
router.get('/projects', dashboardController.getProjectData);
router.get('/clients', dashboardController.getClientData);
router.get('/transactions', dashboardController.getTransactionData);
router.get('/payouts', dashboardController.getPayoutData);

module.exports = router;
