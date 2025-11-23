const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);

    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: err.errors.map(e => e.message)
        });
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            success: false,
            message: 'Duplicate entry. Record already exists.'
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;