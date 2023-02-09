import express from 'express';
import dotenv from 'dotenv';
import 'express-async-errors'; // <-- ⚠️ if package does not work, move to be the first import
import morgan from 'morgan';
dotenv.config();
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';

// db and authenticateUser
import connectDB from './db/connect.js';

// routers
import authRouter from './routes/authRouter.js';
import jobsRouter from './routes/jobsRouter.js';
import jobsRouterArbetsformedlingen from './routes/jobsRouterArbetsformedlingen.js';

// Middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import authenticateUser from './middleware/auth.js';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

//! only when ready to deploy, use code below
// const __dirname = dirname(fileURLToPath(import.meta.url));
// app.use(express.static(path.resolve(__dirname, './client/build')));

// express.json() make json data available for us in controllers
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.get('/', (req, res) => {
  res.json({ msg: 'Welcome!' });
});
app.get('/api/v1', (req, res) => {
  res.json({ msg: 'API' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);
app.use(
  '/api/v1/arbetsformedlingen',
  authenticateUser,
  jobsRouterArbetsformedlingen
);

//! only when ready to deploy, use code below
// app.get('*', function (request, response) {
//   response.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
// });

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};
start();
