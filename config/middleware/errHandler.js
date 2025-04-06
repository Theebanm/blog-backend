const errHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message;
  const stack = process.env.NODE_ENV === "development" ? err.stack : null;

  res.status(statusCode).json({
    message,
    stack,
  });
};

module.exports = errHandler;
