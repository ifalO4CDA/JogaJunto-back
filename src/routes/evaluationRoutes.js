const express = require('express');
const evaluationController = require('../controllers/evaluationController');
const router = express.Router();

router.post('/', evaluationController.createEvaluation);
router.delete('/', evaluationController.deleteEvaluation);
router.get('/quadra', evaluationController.listCourtEvaluations);

module.exports = router;
