const express = require('express');
const EvaluationController = require('../controllers/evaluationController');
const router = express.Router();
const authenticate = require('../utils/middlewares/authenticate'); // Middleware de autenticação

router.use(authenticate)

router.post('/', EvaluationController.createEvaluation);
router.delete('/', EvaluationController.deleteEvaluation);
router.get('/quadra/:id', EvaluationController.listEvaluationsByCourt);
router.get('/usuario/:id', EvaluationController.listEvaluationsByUser);

module.exports = router;
