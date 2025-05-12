const port = process.env.PORT || 3005;
const express = require('express');
const app = express();

const errorsHandler = require('./middlewares/errorsHandler.js');
const notFound = require('./middlewares/notFound.js');

//body parser
app.use(express.json());


//connection to routers
const movieRouter = require('./routers/movies.js');

//static middleware
app.use(express.static('public'));

//route to homepage
app.get('/', (req, res)=>{
    res.send('Benvenuto nella homepage');
});

//route of moviese
app.use('/api/movies', movieRouter);


//middlewares for handle errors

//error 500
app.use("/api/movies", errorsHandler);

//error 404
app.use(notFound);


app.listen(port, ()=>{
    console.log(`Connect to Port: ${port}`);
});