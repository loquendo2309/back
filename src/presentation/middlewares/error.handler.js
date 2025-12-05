const { BaseError } = require('../../domain/errors');

function errorHandler(err, req, res, next) {
    if (err instanceof BaseError) {
        return res.status(err.statusCode).json({
            message: err.message,
        });
    }

    // log the error for debugging purposes
    console.error(err);

    // send a generic error response
    res.status(500).json({
        message: 'An internal server error occurred',
    });
}

module.exports = errorHandler;
