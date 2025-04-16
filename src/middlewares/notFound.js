module.exports = (_req, res, _next) =>
  res.status(404).json({ message: "Not found" }).end();
