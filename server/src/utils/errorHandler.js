import { ApiError } from "./ApiError.js";

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        console.log(err)
        const { statusCode, message, error, stack } = err;

        return res.status(statusCode).json({
            success: false,
            message,
            error,
            stack: process.env.NODE_ENV === "development" ? stack : undefined,
        });
    }

    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: [],
    });
};

export default errorHandler;
