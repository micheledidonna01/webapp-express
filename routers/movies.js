const express = require('express');
const router = express.Router();
const movieController = require('../controllers/moviesController.js');


//index
router.get('/', movieController.index);

//show
router.get('/:id', movieController.show);

module.exports = router;