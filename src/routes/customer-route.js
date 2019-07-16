'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/customer-controller')
const authService = require('../services/auth-service');

router.get('/', controller.get);
router.get('/admin/:id', controller.getById);
router.post('/', controller.post);
router.post('/authenticate', controller.authenticate);
router.put('/:id', controller.put);
router.delete('/', controller.delete);
router.post('/refresh-token', authService.authrize, controller.refreshToken);

module.exports = router; 