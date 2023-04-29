const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const dev = require('./config');
const connectDatabase = require('./config/db');
const seedRouter = require('./routes/seedRouter');
const userRouter = require('./routes/userRouter');
const { getRandomString } = require('./helpers/randomValue');
const authRouter = require('./routes/authRouter');

const app = express();
const PORT = dev.app.port || 8000;
app.get('/test', (req, res, next) => {
  res.status(200).send('api is working fine');
});
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectDatabase();
});

// get random string
// getRandomString();

// all the middlewares
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  })
);
app.use(cookieParser());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/seed', seedRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.use((req, res, next) => {
  next(createError(404, 'not found'));
});

// all the errors will come here in the end from all the routes
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});
