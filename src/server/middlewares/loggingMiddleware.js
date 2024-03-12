const loggingMiddleware = (db) =>
    (req, res, next) => {
        const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
        const header = JSON.stringify(req.headers);
        const originalUrl = req.originalUrl;
        const action = req.url
        // Persist this info on DB
        db.logging.create({ ip, header, originalUrl , action})
        next();
    }

module.exports = loggingMiddleware;