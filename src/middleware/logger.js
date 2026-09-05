// Cloud Application Request Logging Middleware (Render Metrics & Diagnostics)

function requestLogger(req, res, next) {
    const start = Date.now();
    const timestamp = new Date().toISOString();
    const { method, originalUrl, ip } = req;

    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusCode = res.statusCode;
        const logLine = `[CLOUD LOG] ${timestamp} | ${method} ${originalUrl} | Status: ${statusCode} | ${duration}ms | IP: ${ip}`;

        if (statusCode >= 400) {
            console.error(logLine);
        } else {
            console.log(logLine);
        }
    });

    next();
}

module.exports = requestLogger;
