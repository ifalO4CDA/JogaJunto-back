const express = require('express');
const EvaluationController = require('../controllers/evaluationController');
const router = express.Router();

router.post('/', EvaluationController.createEvaluation);
router.delete('/', EvaluationController.deleteEvaluation);
router.get('/quadra', EvaluationController.listEvaluationsByCourt);
router.get('/usuario', EvaluationController.listEvaluationsByUser);

module.exports = router;
