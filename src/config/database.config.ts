import { Logger } from '@nestjs/common';

export const databaseConfig = {
  url: process.env.DATABASE_URL,
  logQueries: process.env.NODE_ENV !== 'production',
  connectionTimeout: 30000,
  pool: {
    min: 2,
    max: 10,
  },
};

export const validateDatabaseConfig = () => {
  const logger = new Logger('DatabaseConfig');
  
  if (!databaseConfig.url) {
    logger.error('DATABASE_URL environment variable is not set');
    throw new Error('DATABASE_URL is required');
  }
  
  logger.log('Database configuration validated successfully');
  logger.log(`Database URL: ${databaseConfig.url.substring(0, 20)}...`);
  logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  return databaseConfig;
}; 