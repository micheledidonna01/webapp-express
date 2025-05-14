const port = process.env.PORT || 3005;
const express = require('express');
const app = express();
const cors = require('cors');

const errorsHandler = require('./middlewares/errorsHandler.js');
const notFound = require('./middlewares/notFound.js');


//connection to routers
const movieRouter = require('./routers/movies.js');

//cors middleware
app.use(cors({
    origin: process.env.FE_APP
}));

//static middleware
app.use(express.static('public'));

//body parser
app.use(express.json());//req.body


//route to homepage
app.get('/', (req, res)=>{
    res.send('Benvenuto nella homepage');
});

//route of movies
app.use('/api/movies', movieRouter);


//middlewares for handle errors

//error 500
app.use("/api/movies", errorsHandler);

//error 404
app.use(notFound);


app.listen(port, ()=>{
    console.log(`Connect to Port: ${port}`);
});