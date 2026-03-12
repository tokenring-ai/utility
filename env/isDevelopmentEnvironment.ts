export function isDevelopmentEnvironment(): boolean {
  return process.env.NODE_ENV === 'development';
}