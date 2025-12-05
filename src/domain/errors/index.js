const BaseError = require('./base.error');

class NotFoundError extends BaseError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

class ConflictError extends BaseError {
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}

class BadRequestError extends BaseError {
    constructor(message = 'Bad request') {
        super(message, 400);
    }
}

class UnauthorizedError extends BaseError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

module.exports = {
    NotFoundError,
    ConflictError,
    BadRequestError,
    UnauthorizedError
};
