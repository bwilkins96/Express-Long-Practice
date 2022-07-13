const express = require('express');
require('express-async-errors');
require('dotenv').config();
const dogs = require("./routes/dogs.js");
const app = express();

app.use(express.json());
app.use("/static", express.static("./assets"));

app.use((req, res, next) => {
  console.log(req.method, req.url);
  res.on('finish', () => {
    console.log(res.statusCode);
  });
  next();
});

app.use("/dogs", dogs);

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!");
});

app.use((req, res, next) => {
  let error = new Error("The requested resource couldn't be found.");
  error.statusCode = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.log(err.message);
  let status = err.statusCode || 500;
  res.status(status);
  if (process.env.NODE_ENV === "production") {
    res.json(
      {
        message: err.message,
        statusCode: status
      }
    );
  } else {
    res.json(
      {
        message: err.message,
        statusCode: status,
        stack: err.stack
      }
    );
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server is listening on port', port));
