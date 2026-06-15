export const config = {
  port: 3000,
  nodeEnv: 'production',

  databaseUrl:
    'postgresql://postgres.eylrejetndvqlohvpcvw:it-recruit123%21@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
  directUrl:
    'postgresql://postgres.eylrejetndvqlohvpcvw:it-recruit123%21@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',

  jwtSecret: 'it-recruit-jwt-secret-2026',
  jwtExpiresIn: '1h',
};

process.env.DATABASE_URL = config.databaseUrl;
process.env.DIRECT_URL = config.directUrl;
process.env.JWT_SECRET = config.jwtSecret;
process.env.JWT_EXPIRES_IN = config.jwtExpiresIn;
process.env.NODE_ENV = config.nodeEnv;
