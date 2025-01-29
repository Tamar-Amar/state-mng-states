import { createLogger, format, transports } from 'winston';

// הגדרות הפורמט של הלוגים
const logFormat = format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

// יצירת לוגים עם Winston
const logger = createLogger({
    level: 'info', 
    format: format.combine(
        format.timestamp(), 
        logFormat 
    ),
    transports: [
        new transports.File({ filename: 'logs/app.log' }),

        new transports.File({ filename: 'logs/error.log', level: 'error' }),
    ],
});


if (process.env.NODE_ENV === 'development') {
    logger.add(
        new transports.Console({
            format: format.combine(format.colorize(), logFormat),
        })
    );
}

export default logger;
