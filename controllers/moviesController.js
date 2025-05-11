const connection = require('../data/db.js');
const errorsHandler = require('../middlewares/errorsHandler.js');


//index
function index(req, res){

    //query
    const sql = `SELECT movies.*, ROUND(AVG(reviews.vote), 2) AS "voto_medio" FROM movies_db.movies
            JOIN movies_db.reviews ON reviews.movie_id = movies.id
            GROUP BY movies.id;`;

    // execute query
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({errorMessage: err.message});
        res.json(results.map(result =>({
            ...result,
            imagePath : process.env.IMG_PATH + "movies/" +  result.title.toLowerCase().replace(" ", "_") + ".jpg"
        })));
    });
}


//show
function show(req, res){

    const {id} = req.params;

    //query 1
    const sql = `SELECT * FROM movies WHERE id = ?`;

    //query 2
    const sqlReviews = `SELECT reviews.name, reviews.text FROM reviews
            JOIN movies ON reviews.movie_id = movies.id
            WHERE reviews.movie_id = ?`;

    // execute query 1
    connection.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ errorMessage: err.message });
        if (result.length === 0) return res.status(404).json({errorMessage: err.message});
        const movie = result[0];

        // execute query 2
        connection.query(sqlReviews, [id], (err, resultReviews) => {
            if (err) return res.status(500).json({ errorMessage: err.message });

            movie.reviews = resultReviews.map(review => {
                return {'name': review.name, 'review': review.text};
            });

            movie.imagePath = process.env.IMG_PATH + "movies/" + movie.title.toLowerCase().replace(" ", "_") + ".jpg";
            res.json(movie);
        });
        

    });

}

module.exports = {index, show};