const express = require('express');
const router = express.Router();
const movieController = require('../controllers/moviesController.js');
const upload = require('../middlewares/multer.js');

//index
router.get('/', movieController.index);

//show
router.get('/:slug', movieController.show);

//store movie
router.post('/add-movie', upload.single("image"), movieController.storeMovie);

//store review
router.post('/:slug/reviews', movieController.storeReview);


module.exports = router;