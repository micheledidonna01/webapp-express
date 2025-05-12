function notFound(err, _, res, next){
    res.status(404);
    res.json({
        errorStatus: 404,
        errorMessage: err.message
    });
}

module.exports= notFound;
