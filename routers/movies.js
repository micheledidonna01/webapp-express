const express = require('express');
const router = express.Router();
const movieController = require('../controllers/moviesController.js');
const multer = require('multer');
const upload = require('../middlewares/multer.js');

//index
router.get('/', movieController.index);

//show
router.get('/:id', movieController.show);

//store review
router.post('/:id/reviews', movieController.storeReview);

//store movie
router.post('/', upload.single("image"), movieController.storeMovie);

module.exports = router;