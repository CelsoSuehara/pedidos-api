'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/order-controller');
const authService = require('../services/auth-service');

router.get('/', authService.authrize, controller.get);
router.post('/', authService.authrize, controller.post);

module.exports = router;  