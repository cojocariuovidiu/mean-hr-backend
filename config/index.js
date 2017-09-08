let config;

if (process.env.NODE_ENV === 'development') {
  config = {
    db: process.env.DB_DEVELOPMENT,
    secret: process.env.SECRET
  };
} else if (process.env.NODE_ENV === 'test') {
  config = {
    db: process.env.DB_TEST,
    secret: process.env.SECRET
  };
}

module.exports = config;
