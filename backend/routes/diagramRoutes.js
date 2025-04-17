const express = require('express');
const router = express.Router();
const { createDiagram, getAllDiagrams, deleteDiagram } = require('../controllers/diagramController');
const isAuthenticated = require('../middleware/authMiddleware');

router.post('/', isAuthenticated, createDiagram);
router.get('/', isAuthenticated, getAllDiagrams);
router.delete('/:id', isAuthenticated, deleteDiagram);

module.exports = router;
