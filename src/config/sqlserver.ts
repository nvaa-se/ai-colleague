export default {
  host: process.env.SQLSERVER_HOST,
  user: process.env.SQLSERVER_USER,
  domain: process.env.SQLSERVER_KOMMUN,
  port: parseInt(process.env.SQLSERVER_PORT) || 5432,
  password: process.env.SQLSERVER_PASSWORD,
  database: process.env.SQLSERVER_DATABASE,
}
