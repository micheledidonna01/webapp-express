const { default: slugify } = require('slugify');
const connection = require('../data/db.js');


//index
function index(req, res) {
    const { search } = req.query;

    const preparedParams = [];

    console.log(search);

    //query
    let sql = `SELECT movies.*, ROUND(AVG(reviews.vote), 2) AS "voto_medio" FROM movies_db.movies
            LEFT JOIN movies_db.reviews ON reviews.movie_id = movies.id `
    // GROUP BY movies.id;`;

    if (search) {
        sql += `WHERE movies.title LIKE ? OR movies.director LIKE ? OR movies.genre LIKE ? `;
        preparedParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += `GROUP BY movies.id;`;

    // execute query
    connection.query(sql, preparedParams, (err, results) => {
        if (err) return res.status(500).json({ errorMessage: err.message });
        res.json(results.map(result => ({
            ...result,
            imagePath: process.env.IMG_PATH + "movies_cover/" + result.image
        })));
    });
}


//show
function show(req, res) {

    const { slug } = req.params;


    //query 1
    const sql = `SELECT movies.* ,ROUND(AVG(reviews.vote), 2) AS "voto_medio"
                FROM movies
                LEFT JOIN reviews ON reviews.movie_id = movies.id
                WHERE movies.slug = ?`;

    //query 2
    const sqlReviews = `SELECT reviews.id, reviews.name, reviews.text, reviews.vote
                            FROM movies_db.reviews
                            WHERE movie_id = `;

    // execute query 1
    connection.query(sql, [slug], (err, result) => {
        if (err) return res.status(500).json({ errorMessage: 'Error Server' });
        if (result.length === 0) return res.status(404).json({ errorMessage: 'Not Found' });
        let movie = result[0];
        

        // execute query 2
        connection.query(sqlReviews, [slug], (err, resultReviews) => {
            if (err) return res.status(500).json({ errorMessage: 'Error Server' });

            // add array of object review on movie object
            movie.reviews = resultReviews;

            movie.imagePath = process.env.IMG_PATH + "movies_cover/" + movie.image;
            res.json(movie);
        });

        console.log(movie);

    });

}

//store review
function storeReview(req, res) {

    const { slug } = req.params;
    const { name, vote, text } = req.body;

    console.log(name, vote, text);

    const sql = `INSERT INTO reviews (movie_id, name, vote, text)
     VALUES (?, ?, ?, ?);`

    connection.query(sql, [name, vote, text], (err, result) => {
        if (err) return res.status(500).json({ errorMessage: 'Error Server' });

        console.log(result);
        res.status(201);
        res.json({
            name,
            vote,
            text
        });
    })
}

//store movie
function storeMovie(req, res) {

    const { title, director, genre, release_year, abstract } = req.body;
    const imageName = req.file.filename;
    const sql = `INSERT INTO movies_db.movies(title, director, genre, release_year, abstract, image, slug)
            VALUES(?, ?, ?, ?, ?, ?, ?)`;


    const slug = slugify(title, {
        lower: true,
        trim: true
    });

    connection.query(sql, [title, director, genre, release_year, abstract, imageName, slug], (err, response) => {
        if (err) return res.status(500).json({ errorMessage: 'Error Server' });

        res.status(201);
        res.json({
            title,
            director,
            genre,
            release_year,
            abstract,
            image: imageName,
            slug
        });

    });
}

module.exports = { index, show, storeReview, storeMovie };
