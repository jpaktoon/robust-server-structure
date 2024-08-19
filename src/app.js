const express = require("express");
const app = express();
const urlsRouter = require("./urls/urls.router");
const usesRouter = require("./uses/uses.router");

app.use(express.json());

app.use("/urls", urlsRouter);
app.use("/uses", usesRouter);

// Not found handler
app.use((request, response, next) => {
  const error = new Error(`Not found: ${request.originalUrl}`);
  error.status = 404; // Set the status code to 404
  next(error);
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error.message);
  const { status = 404, message = "Something went wrong!" } = error;
  res.status(status).json({ error: message });
});

module.exports = app;
