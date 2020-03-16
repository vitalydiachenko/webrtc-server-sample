export const DEFAULT_PORT = 8080;

export const DEFAULT_HOST = '0.0.0.0';

export const HOST = process.env.HOST || DEFAULT_HOST;

export const PORT = Number(process.env.PORT) || DEFAULT_PORT;
