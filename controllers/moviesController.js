const connection = require('../data/db.js');


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
            imagePath : process.env.IMG_PATH + "api/movies/" +  result.image
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
        if (err) return res.status(500).json({ errorMessage: 'Error Server' });
        if (result.length === 0) return res.status(404).json({errorMessage: 'Not Found'});
        const movie = result[0];

        // execute query 2
        connection.query(sqlReviews, [id], (err, resultReviews) => {
            if (err) return res.status(500).json({errorMessage: 'Error Server' });

            movie.reviews = resultReviews.map(review => {
                return {'name': review.name, 'review': review.text};
            });

            movie.imagePath = process.env.IMG_PATH + "api/movies/" + movie.image;
            res.json(movie);
        });
        

    });

}

module.exports = {index, show};