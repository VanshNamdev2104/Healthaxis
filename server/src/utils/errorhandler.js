import { internalError } from "./responsehandler.js";

const errorhandlerMiddleware = (err, req, res, next) => {
   
    if (res.headersSent) {
        return next(err);
    }

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    return internalError(res, err.message, err.statusCode);
}

export default errorhandlerMiddleware;