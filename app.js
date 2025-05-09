const port = process.env.PORT || 3005;
const express = require('express');
const app = express();

const errorsHandler = require('./middlewares/errorsHandler.js');
const notFound = require('./middlewares/notFound.js');

//body parser
app.use(express.json());

//connection to routers
const movieRouter = require('./routers/movies.js');
app.use('/movies', movieRouter);


//middlewares for handle errors

//error 500
app.use("/movies", errorsHandler);

//error 404
app.use(notFound);


app.listen(port, ()=>{
    console.log(`Connect to Port: ${port}`);
});