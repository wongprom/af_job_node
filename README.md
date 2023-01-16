## MongoDB, mongoose, API and Server stuff

<details>
  <summary>---template---</summary>
  [name](link)

```
npm install bcryptjs
```

###### file-name.js

```js

```

---

</details>

<details>
  <summary>Connect to mongoDB</summary>
  
  ###### server.js
 ```js
 import express from 'express';
 import connectDB from './db/connect.js';

const app = express();

// express.json() make json data available for us in controllers
app.use(express.json());

// ...some more code 👆

// Connect to db 👇
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

````
import connectDB from './db/connect.js'; , comes from
###### db/connect.js
```js
import mongoose from 'mongoose';

const connectDB = (url) => {
  return mongoose.connect(url);
};
export default connectDB;
````

---

</details>

<details>
  <summary>Create User schema with mongoose</summary>

###### models/User.js

```js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  lastName: {
    type: String,
    maxlength: 20,
    trim: true,
    default: 'lastName',
  },
  location: {
    type: String,
    maxlength: 20,
    trim: true,
    default: 'my city',
  },
});

export default mongoose.model('User', UserSchema);
```

---

</details>

<details>
  <summary>Validate email field</summary>

[https://www.npmjs.com/package/validator](https://www.npmjs.com/package/validator)

```
npm install validator
```

###### models/User.js

```js
import mongoose from 'mongoose';
import validator from 'validator'; // <--

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail, //<--
      message: 'Please provide a valid email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  lastName: {
    type: String,
    maxlength: 20,
    trim: true,
    default: 'lastName',
  },
  location: {
    type: String,
    maxlength: 20,
    trim: true,
    default: 'my city',
  },
});

export default mongoose.model('User', UserSchema);
```

</details>

<details>
  <summary>Register User</summary>

###### controllers/autController.js

```js
import User from '../models/User.js';
// register  👇
const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ msg: 'THERE WAS AN ERROR IN REGISTER' });
  }
};

const login = async (req, res) => {
  res.send('login');
};

const updateUser = async (req, res) => {
  res.send('updateUser');
};

export { register, login, updateUser };
```

`import User from '../models/User.js'`, comes from:

###### models/User.js

```js
import mongoose from 'mongoose';
import validator from 'validator';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  lastName: {
    type: String,
    maxlength: 20,
    trim: true,
    default: 'lastName',
  },
  location: {
    type: String,
    maxlength: 20,
    trim: true,
    default: 'my city',
  },
});

export default mongoose.model('User', UserSchema);
```

---

</details>

<details>
  <summary>Pass error to own errorHandlerMiddleware with `next()` when register user</summary>

###### controllers/autController.js

```js
import User from '../models/User.js';

const register = async (req, res, next /* <-- ⚠️ next */) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    // res.status(500).json({ msg: 'THERE WAS AN ERROR IN REGISTER' });
    next(error); // <-- ⚠️ with next(error) we pass error to our own errorHandlerMiddleware
  }
};

const login = async (req, res) => {
  res.send('login');
};

const updateUser = async (req, res) => {
  res.send('updateUser');
};

export { register, login, updateUser };
```

###### error-handler.js

```js
const errorHandlerMiddleware = (error, req, res, next) => {
  console.log(error);
  // return res.status(500).json({ msg: 'there was an error' });
  res.status(500).json({ msg: error }); // <-- ⚠️
};

export default errorHandlerMiddleware;
```

###### server.js

```js
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

// Middleware
import errorHandlerMiddleware from './middleware/error-handler.js';

const app = express();

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', jobsRouter);

app.use(someOtherMiddleware);
app.use(errorHandlerMiddleware); // <-- ⚠️ place errorHandlerMiddleware as the last middleware

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
```

---

</details>

<details>
  <summary>Remove try/catch blocks with express-async-errors package from controllers</summary>

[https://www.npmjs.com/package/express-async-errors](https://www.npmjs.com/package/express-async-errors)

```
npm install express-async-errors
```

###### server.js

```js
import express from 'express';
import dotenv from 'dotenv';
import 'express-async-errors'; // <-- ⚠️ if package does not work, move to be the first import
dotenv.config();

// db and authenticateUser
import connectDB from './db/connect.js';

// routers
import authRouter from './routes/authRouter.js';
import jobsRouter from './routes/jobsRouter.js';

// Middleware
import errorHandlerMiddleware from './middleware/error-handler.js';

const app = express();

// ...some more code 👇
```

###### controllers/autController.js

```js
import User from '../models/User.js';

const register = async (req, res, next) => {
  // ⚠️ Before using express-async-errors package with try/catch block
  // try {
  //   const user = await User.create(req.body);
  //   res.status(201).json({ user });
  // } catch (error) {
  //   next(error);
  // }
  const user = await User.create(req.body);
  res.status(201).json({ user });
};
const login = async (req, res) => {
  res.send('login');
};
const updateUser = async (req, res) => {
  res.send('updateUser');
};
export { register, login, updateUser };
```

---

</details>

<details>
  <summary>Use http-status-codes package for statusCodes</summary>

[https://www.npmjs.com/package/http-status-codes](https://www.npmjs.com/package/http-status-codes)

```sh
npm install http-status-codes

```

###### authController.js

```js
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';

const register = async (req, res) => {
  const user = await User.create(req.body);
  // res.status(201).json({ user }); ⚠️ Before
  res.status(StatusCodes.CREATED).json({ user }); // ⚠️ After
};
const login = async (req, res) => {
  res.send('login');
};
const updateUser = async (req, res) => {
  res.send('updateUser');
};
export { register, login, updateUser };
```

###### error-handler.js

```js
import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  // res.status(500).json({ msg: err }); <-- ⚠️ Before

  // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
  // different way to do use StatusCodes 👆 👇
  const defaultError = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    msg: 'Something went wrong, try again later',
  };
  res.status(defaultError.statusCode).json({ msg: err });
};

export default errorHandlerMiddleware;
```

### Error Codes

| Code | Constant                        | Reason Phrase                   |
| ---- | ------------------------------- | ------------------------------- |
| 100  | CONTINUE                        | Continue                        |
| 101  | SWITCHING_PROTOCOLS             | Switching Protocols             |
| 102  | PROCESSING                      | Processing                      |
| 200  | OK                              | OK                              |
| 201  | CREATED                         | Created                         |
| 202  | ACCEPTED                        | Accepted                        |
| 203  | NON_AUTHORITATIVE_INFORMATION   | Non Authoritative Information   |
| 204  | NO_CONTENT                      | No Content                      |
| 205  | RESET_CONTENT                   | Reset Content                   |
| 206  | PARTIAL_CONTENT                 | Partial Content                 |
| 207  | MULTI_STATUS                    | Multi-Status                    |
| 300  | MULTIPLE_CHOICES                | Multiple Choices                |
| 301  | MOVED_PERMANENTLY               | Moved Permanently               |
| 302  | MOVED_TEMPORARILY               | Moved Temporarily               |
| 303  | SEE_OTHER                       | See Other                       |
| 304  | NOT_MODIFIED                    | Not Modified                    |
| 305  | USE_PROXY                       | Use Proxy                       |
| 307  | TEMPORARY_REDIRECT              | Temporary Redirect              |
| 308  | PERMANENT_REDIRECT              | Permanent Redirect              |
| 400  | BAD_REQUEST                     | Bad Request                     |
| 401  | UNAUTHORIZED                    | Unauthorized                    |
| 402  | PAYMENT_REQUIRED                | Payment Required                |
| 403  | FORBIDDEN                       | Forbidden                       |
| 404  | NOT_FOUND                       | Not Found                       |
| 405  | METHOD_NOT_ALLOWED              | Method Not Allowed              |
| 406  | NOT_ACCEPTABLE                  | Not Acceptable                  |
| 407  | PROXY_AUTHENTICATION_REQUIRED   | Proxy Authentication Required   |
| 408  | REQUEST_TIMEOUT                 | Request Timeout                 |
| 409  | CONFLICT                        | Conflict                        |
| 410  | GONE                            | Gone                            |
| 411  | LENGTH_REQUIRED                 | Length Required                 |
| 412  | PRECONDITION_FAILED             | Precondition Failed             |
| 413  | REQUEST_TOO_LONG                | Request Entity Too Large        |
| 414  | REQUEST_URI_TOO_LONG            | Request-URI Too Long            |
| 415  | UNSUPPORTED_MEDIA_TYPE          | Unsupported Media Type          |
| 416  | REQUESTED_RANGE_NOT_SATISFIABLE | Requested Range Not Satisfiable |
| 417  | EXPECTATION_FAILED              | Expectation Failed              |
| 418  | IM_A_TEAPOT                     | I'm a teapot                    |
| 419  | INSUFFICIENT_SPACE_ON_RESOURCE  | Insufficient Space on Resource  |
| 420  | METHOD_FAILURE                  | Method Failure                  |
| 421  | MISDIRECTED_REQUEST             | Misdirected Request             |
| 422  | UNPROCESSABLE_ENTITY            | Unprocessable Entity            |
| 423  | LOCKED                          | Locked                          |
| 424  | FAILED_DEPENDENCY               | Failed Dependency               |
| 428  | PRECONDITION_REQUIRED           | Precondition Required           |
| 429  | TOO_MANY_REQUESTS               | Too Many Requests               |
| 431  | REQUEST_HEADER_FIELDS_TOO_LARGE | Request Header Fields Too Large |
| 451  | UNAVAILABLE_FOR_LEGAL_REASONS   | Unavailable For Legal Reasons   |
| 500  | INTERNAL_SERVER_ERROR           | Internal Server Error           |
| 501  | NOT_IMPLEMENTED                 | Not Implemented                 |
| 502  | BAD_GATEWAY                     | Bad Gateway                     |
| 503  | SERVICE_UNAVAILABLE             | Service Unavailable             |
| 504  | GATEWAY_TIMEOUT                 | Gateway Timeout                 |
| 505  | HTTP_VERSION_NOT_SUPPORTED      | HTTP Version Not Supported      |
| 507  | INSUFFICIENT_STORAGE            | Insufficient Storage            |
| 511  | NETWORK_AUTHENTICATION_REQUIRED | Network Authentication Required |

---

</details>

<details>
  <summary>Missing field error</summary>

###### error-handler.js

```js
import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  const defaultError = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    msg: 'Something went wrong, try again later',
  };
  // res.status(defaultError.statusCode).json({ msg: err }); <-- ⚠️ Before
  // 👇 ⚠️ After
  if (err.name === 'ValidationError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = Object.values(err.errors) // ⚠️ Get al error message, and put them in []
      .map((item) => item.message)
      .join(',');
  }
  // 👆 ⚠️ After
  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

export default errorHandlerMiddleware;
```

---

</details>

<details>
  <summary>Unique Field error</summary>

###### error-handler.js

```js
import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  const defaultError = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    msg: 'Something went wrong, try again later',
  };

  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`;
  }

  // res.status(defaultError.statusCode).json({ msg: err });
  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

export default errorHandlerMiddleware;
```

---

</details>

<details>
  <summary>Check for empty fields in controller</summary>

###### authController.js

```js
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';

const register = async (req, res) => {
  // Add
  const { name, email, password } = req.body;

  // Add
  if (!name || !email | !password) {
    throw new Error('Please provide all values');
  }

  //Before
  const user = await User.create(req.body);
  //After
  const user = await User.create({ name, email, password });
  // res.status(201).json({ user }); ⚠️ Before
  res.status(StatusCodes.CREATED).json({ user });
};
const login = async (req, res) => {
  res.send('login');
};
const updateUser = async (req, res) => {
  res.send('updateUser');
};
export { register, login, updateUser };
```

###### error-handler.js

```js
import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {
  const defaultError = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    // Before
    //msg:'Something went wrong, try again later',
    // After
    msg: err.message || 'Something went wrong, try again later',
  };

  if (err.name === 'ValidationError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',');
  }

  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`;
  }

  // res.status(defaultError.statusCode).json({ msg: err });
  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

export default errorHandlerMiddleware;
```

---

</details>

<details>
  <summary>Create CustomAPIError to change statusCode and error message when !name | !email | !password</summary>

###### authController.js

```js
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';

// New CustomAPIError
class CustomAPIError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email | !password) {
    throw new CustomAPIError('Please provide all values'); // Before, throw new Error('Please provide all values');
  }
  const user = await User.create({ name, email, password });
  res.status(StatusCodes.CREATED).json({ user });
};

const login = async (req, res) => {
  res.send('login');
};

const updateUser = async (req, res) => {
  res.send('updateUser');
};

export { register, login, updateUser };
```

###### error-handler.js

```js
import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err.message);
  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, // Before statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later',
  };

  if (err.name === 'ValidationError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',');
  }

  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`;
  }

  // res.status(defaultError.statusCode).json({ msg: err });
  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

export default errorHandlerMiddleware;
```

---

</details>

<details>
  <summary>Create BadRequestError, NotFoundError classes that extends from CustomAPIError</summary>

###### authController.js

```js
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';

class CustomAPIError extends Error {
  constructor(message) {
    super(message);
  }
}
// New classes BadRequestError, NotFoundError that extends from CustomAPIError that return different statusCodes.
class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email | !password) {
    throw new BadRequestError('Please provide all values');
  }
  const user = await User.create({ name, email, password });
  res.status(StatusCodes.CREATED).json({ user });
};
const login = async (req, res) => {
  res.send('login');
};
const updateUser = async (req, res) => {
  res.send('updateUser');
};
export { register, login, updateUser };
```

### Error Codes

| Code | Constant                        | Reason Phrase                   |
| ---- | ------------------------------- | ------------------------------- |
| 100  | CONTINUE                        | Continue                        |
| 101  | SWITCHING_PROTOCOLS             | Switching Protocols             |
| 102  | PROCESSING                      | Processing                      |
| 200  | OK                              | OK                              |
| 201  | CREATED                         | Created                         |
| 202  | ACCEPTED                        | Accepted                        |
| 203  | NON_AUTHORITATIVE_INFORMATION   | Non Authoritative Information   |
| 204  | NO_CONTENT                      | No Content                      |
| 205  | RESET_CONTENT                   | Reset Content                   |
| 206  | PARTIAL_CONTENT                 | Partial Content                 |
| 207  | MULTI_STATUS                    | Multi-Status                    |
| 300  | MULTIPLE_CHOICES                | Multiple Choices                |
| 301  | MOVED_PERMANENTLY               | Moved Permanently               |
| 302  | MOVED_TEMPORARILY               | Moved Temporarily               |
| 303  | SEE_OTHER                       | See Other                       |
| 304  | NOT_MODIFIED                    | Not Modified                    |
| 305  | USE_PROXY                       | Use Proxy                       |
| 307  | TEMPORARY_REDIRECT              | Temporary Redirect              |
| 308  | PERMANENT_REDIRECT              | Permanent Redirect              |
| 400  | BAD_REQUEST                     | Bad Request                     |
| 401  | UNAUTHORIZED                    | Unauthorized                    |
| 402  | PAYMENT_REQUIRED                | Payment Required                |
| 403  | FORBIDDEN                       | Forbidden                       |
| 404  | NOT_FOUND                       | Not Found                       |
| 405  | METHOD_NOT_ALLOWED              | Method Not Allowed              |
| 406  | NOT_ACCEPTABLE                  | Not Acceptable                  |
| 407  | PROXY_AUTHENTICATION_REQUIRED   | Proxy Authentication Required   |
| 408  | REQUEST_TIMEOUT                 | Request Timeout                 |
| 409  | CONFLICT                        | Conflict                        |
| 410  | GONE                            | Gone                            |
| 411  | LENGTH_REQUIRED                 | Length Required                 |
| 412  | PRECONDITION_FAILED             | Precondition Failed             |
| 413  | REQUEST_TOO_LONG                | Request Entity Too Large        |
| 414  | REQUEST_URI_TOO_LONG            | Request-URI Too Long            |
| 415  | UNSUPPORTED_MEDIA_TYPE          | Unsupported Media Type          |
| 416  | REQUESTED_RANGE_NOT_SATISFIABLE | Requested Range Not Satisfiable |
| 417  | EXPECTATION_FAILED              | Expectation Failed              |
| 418  | IM_A_TEAPOT                     | I'm a teapot                    |
| 419  | INSUFFICIENT_SPACE_ON_RESOURCE  | Insufficient Space on Resource  |
| 420  | METHOD_FAILURE                  | Method Failure                  |
| 421  | MISDIRECTED_REQUEST             | Misdirected Request             |
| 422  | UNPROCESSABLE_ENTITY            | Unprocessable Entity            |
| 423  | LOCKED                          | Locked                          |
| 424  | FAILED_DEPENDENCY               | Failed Dependency               |
| 428  | PRECONDITION_REQUIRED           | Precondition Required           |
| 429  | TOO_MANY_REQUESTS               | Too Many Requests               |
| 431  | REQUEST_HEADER_FIELDS_TOO_LARGE | Request Header Fields Too Large |
| 451  | UNAVAILABLE_FOR_LEGAL_REASONS   | Unavailable For Legal Reasons   |
| 500  | INTERNAL_SERVER_ERROR           | Internal Server Error           |
| 501  | NOT_IMPLEMENTED                 | Not Implemented                 |
| 502  | BAD_GATEWAY                     | Bad Gateway                     |
| 503  | SERVICE_UNAVAILABLE             | Service Unavailable             |
| 504  | GATEWAY_TIMEOUT                 | Gateway Timeout                 |
| 505  | HTTP_VERSION_NOT_SUPPORTED      | HTTP Version Not Supported      |
| 507  | INSUFFICIENT_STORAGE            | Insufficient Storage            |
| 511  | NETWORK_AUTHENTICATION_REQUIRED | Network Authentication Required |

---

</details>

<details>
  <summary>Refactor errors</summary>

- Create errors folder in Root
- Create/export bad-request, not-found, custom-api.js, index.js,
- import/export to/from errors/index.js

###### bad-request.js

```js
import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api.js';

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
export default BadRequestError;
```

###### not-found.js

```js
import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api.js';

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
export default NotFoundError;
```

###### custom-api.js

```js
class CustomAPIError extends Error {
  constructor(message) {
    super(message);
  }
}

export default CustomAPIError;
```

###### errors/index.js

```js
import BadRequestError from './bad-request.js';
import NotFoundError from './not-found.js';

export { BadRequestError, NotFoundError };
```

###### autController.js

```js
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import { BadRequestError } from '../errors/index.js';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email | !password) {
    throw new BadRequestError('Please provide all values');
  }
  const user = await User.create({ name, email, password });
  res.status(StatusCodes.CREATED).json({ user });
};
const login = async (req, res) => {
  res.send('login');
};
const updateUser = async (req, res) => {
  res.send('updateUser');
};
export { register, login, updateUser };
```

---

</details>

<details>
  <summary>Check for existing email in controller</summary>

###### authController.js

```js
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import { BadRequestError } from '../errors/index.js';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email | !password) {
    throw new BadRequestError('Please provide all values');
  }

  // New userAlreadyExists
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError('Email already in use');
  }

  const user = await User.create({ name, email, password });
  res.status(StatusCodes.CREATED).json({ user });
};
const login = async (req, res) => {
  res.send('login');
};
const updateUser = async (req, res) => {
  res.send('updateUser');
};
export { register, login, updateUser };
```

---

</details>

<details>
  <summary>Hash Password</summary>

[bcryptjs](https://www.npmjs.com/package/bcryptjs) - Optimized bcrypt in JavaScript with zero dependencies. Compatible to the C++ bcrypt binding on node.js and also working in the browser.

```
npm install bcryptjs
```

###### models/User.js

```js
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs'; // New import

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  lastName: {
    type: String,
    maxlength: 20,
    trim: true,
    default: 'lastName',
  },
  location: {
    type: String,
    maxlength: 20,
    trim: true,
    default: 'my city',
  },
});

// New UserSchema.pre... , do this code before save it to db
UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model('User', UserSchema);
```

---

</details>

<details>
  <summary>JWT Token</summary>

### 1. Create new new method, createJWT

###### models/User.js.js

```js
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  lastName: {
    type: String,
    maxlength: 20,
    trim: true,
    default: 'lastName',
  },
  location: {
    type: String,
    maxlength: 20,
    trim: true,
    default: 'my city',
  },
});

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//New method createJWT
UserSchema.methods.createJWT = function () {
  console.log(this);
};

export default mongoose.model('User', UserSchema);
```

### 2. run createJWT() from authController.js

###### auth-controller.js

```js
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import { BadRequestError } from '../errors/index.js';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email | !password) {
    throw new BadRequestError('Please provide all values');
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError('Email already in use');
  }

  const user = await User.create({ name, email, password });
  user.createJWT(); // New , run function
  res.status(StatusCodes.CREATED).json({ user });
};
const login = async (req, res) => {
  res.send('login');
};
const updateUser = async (req, res) => {
  res.send('updateUser');
};
export { register, login, updateUser };
```

### 3. jsonwebtoken

[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

```
 npm install jsonwebtoken
```

###### auth-controller.js

```js
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import { BadRequestError } from '../errors/index.js';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email | !password) {
    throw new BadRequestError('Please provide all values');
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError('Email already in use');
  }

  const user = await User.create({ name, email, password });
  const token = user.createJWT(); // New, create const that holds token
  res.status(StatusCodes.CREATED).json({ user, token }); // New, pass token with response
};
const login = async (req, res) => {
  res.send('login');
};
const updateUser = async (req, res) => {
  res.send('updateUser');
};
export { register, login, updateUser };
```

###### User.js

```js
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // New, import

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  lastName: {
    type: String,
    maxlength: 20,
    trim: true,
    default: 'lastName',
  },
  location: {
    type: String,
    maxlength: 20,
    trim: true,
    default: 'my city',
  },
});

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, 'jwtSecret', { expiresIn: '1d' }); // New, return created token
};

export default mongoose.model('User', UserSchema);
```

### 4. Set up JWT_SECRET in .env

[www.allkeysgenerator.com](https://www.allkeysgenerator.com/)

Use 256-bite. Change from tab _Ecryption key_

###### .env.js

```js
JWT_SECRET=VALUE_FROM_www.allkeysgenerator.com
JWT_LIFETIME=1d
```

###### User.js

```js
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  lastName: {
    type: String,
    maxlength: 20,
    trim: true,
    default: 'lastName',
  },
  location: {
    type: String,
    maxlength: 20,
    trim: true,
    default: 'my city',
  },
});

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
// BEFORE
// UserSchema.methods.createJWT = function () {
//   return jwt.sign({ userId: this._id }, 'jwtSecret', { expiresIn: '1d' });
// };

// AFTER
UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

export default mongoose.model('User', UserSchema);
```

---

</details>

<details>
  <summary>Remove password from return</summary>

###### authController.js

```js
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import { BadRequestError } from '../errors/index.js';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email | !password) {
    throw new BadRequestError('Please provide all values');
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError('Email already in use');
  }

  const user = await User.create({ name, email, password });
  const token = user.createJWT();

  // res.status(StatusCodes.CREATED).json({ user, token });  <-- BEFORE
  res.status(StatusCodes.CREATED).json({
    // AFTER
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    token,
    location: user.location,
  });
};

const login = async (req, res) => {
  res.send('login');
};
const updateUser = async (req, res) => {
  res.send('updateUser');
};
export { register, login, updateUser };
```

###### User.js

```js
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    select: false, // New
  },
  lastName: {
    type: String,
    maxlength: 20,
    trim: true,
    default: 'lastName',
  },
  location: {
    type: String,
    maxlength: 20,
    trim: true,
    default: 'my city',
  },
});

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

export default mongoose.model('User', UserSchema);
```

---

</details>

<details>

  <summary>Start front and backend with 1 terminal command</summary>

[concurrently](https://www.npmjs.com/package/concurrently)

```
npm install concurrently --save-dev
```

###### package.json

Add and edit to look like this

```js
 "scripts": {
    "server": "nodemon server --ignore client",
    "client": "npm start --prefix client",
    "start": "concurrently --kill-others-on-fail \"npm run server\" \" npm run client\""
  },
```

Use this command to start backend(server) and frontend

```
npm start
```

---

</details>

<details>

  <summary>Navigate user to Dashboard after register</summary>

###### client/src/pages/Register.js

```js
import { useState, useEffect } from 'react';
import { Logo, FormRow, Alert } from '../components';
import Wrapper from '../assets/wrappers/RegisterPage';
import { useAppContext } from '../context/appContext';
import { useNavigate } from 'react-router-dom'; // <--

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: false,
};

const Register = () => {
  const [values, setValues] = useState(initialState);
  const { isLoading, showAlert, displayAlert, registerUser, user } =
    useAppContext(); // <-- add user
  const navigate = useNavigate(); // <-- navigate

  useEffect(() => {
    // <-- useEffect
    if (user) {
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  }, [user, navigate]);

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }
    const currentUser = { name, email, password };

    if (isMember) {
      console.log('Already a member');
    } else {
      registerUser(currentUser);
    }

    console.log(values);
  };

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? 'Login' : 'Register'}</h3>
        {showAlert && <Alert />}
        {!values.isMember && (
          <FormRow
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
          />
        )}
        <FormRow
          type="email"
          value={values.email}
          name="email"
          onChange={handleChange}
        />
        <FormRow
          type="password"
          value={values.password}
          name="password"
          onChange={handleChange}
        />

        <button type="submit" className="btn btn-block" disabled={isLoading}>
          submit
        </button>
        <p>
          {values.isMember ? 'Not a member yet?' : 'Already a member?'}
          <button type="button" onClick={toggleMember} className="member-btn">
            {values.isMember ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </Wrapper>
  );
};
export default Register;
```

---

</details>

<details>
  <summary>Add user and other things to localStorage</summary>

###### client/src/context/appContext.js

```js
import { useReducer, useContext, createContext } from 'react';
import axios from 'axios';
import reducer from './reducer';
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
} from './actions';
const AppContext = createContext();

// New localStorage.getItem
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
const userLocation = localStorage.getItem('location');

export const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null, // <--
  token: token, // <--
  userLocation: userLocation || '', // <--
  jobLocation: userLocation || '', // <--
};
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 1500);
  };

  // new addUserToLocalStorage
  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('location', location);
  };
  // new removeUserFromLocalStorage
  const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('location');
  };

  const registerUser = async (currentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      const response = await axios.post('/api/v1/auth/register', currentUser);
      console.log('response', response);
      const { user, token, location } = response.data;
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: { user, token, location },
      });
      // new addUserToLocalStorage
      addUserToLocalStorage({
        user,
        token,
        location,
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: appContext.js:44 ~ registerUser ~ error.response',
        error.response
      );

      dispatch({
        type: REGISTER_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        registerUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider };
```

---

</details>

<details>
  <summary>Use HTTP request logger middleware morgan </summary>

[https://www.npmjs.com/package/morgan](https://www.npmjs.com/package/morgan) - HTTP request logger middleware for node.js

```
npm install morgan
```

###### ROOT/server.js

```js
import express from 'express';
import dotenv from 'dotenv';
import 'express-async-errors';
import morgan from 'morgan'; //<-- New import
dotenv.config();

// db and authenticateUser
import connectDB from './db/connect.js';

// routers
import authRouter from './routes/authRouter.js';
import jobsRouter from './routes/jobsRouter.js';

// Middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

const app = express();

// New if
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ msg: 'Welcome!' });
});
app.get('/api/v1', (req, res) => {
  res.json({ msg: 'API' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', jobsRouter);

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
```

---

</details>

<details>
  <summary>Compare password</summary>

###### ROOT/errors/unauthenticated.js

this unauthenticated.js file is new

```js
import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api.js';

class UnAuthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnAuthenticatedError;
```

###### ROOT/errors/index.js

```js
import BadRequestError from './bad-request.js';
import NotFoundError from './not-found.js';
import UnAuthenticatedError from './unauthenticated.js'; // <--

export { BadRequestError, NotFoundError, UnAuthenticatedError }; // <--
```

###### ROOT/controllers/authController.js

```js
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'; // <--

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email | !password) {
    throw new BadRequestError('Please provide all values');
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError('Email already in use');
  }

  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    token,
    location: user.location,
  });
};
// New, everything in login func
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnAuthenticatedError('Invalid credentials');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError('Invalid credentials');
  }
  const token = user.createJWT();
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user, token, location: user.location });

  // res.send('login');
};
const updateUser = async (req, res) => {
  res.send('updateUser');
};
export { register, login, updateUser };
```

###### ROOT/models/User.js

```js
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    select: false,
  },
  lastName: {
    type: String,
    maxlength: 20,
    trim: true,
    default: 'lastName',
  },
  location: {
    type: String,
    maxlength: 20,
    trim: true,
    default: 'my city',
  },
});
// New UserSchema.methods.comparePassword
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

export default mongoose.model('User', UserSchema);
```

---

</details>

<details>
  <summary>Login user + add to localStorage + add to global context</summary>

###### ROOT/client/src/context/actions.js

```js
export const DISPLAY_ALERT = 'SHOW_ALERT';
export const CLEAR_ALERT = 'CLEAR_ALERT';

export const REGISTER_USER_BEGIN = 'REGISTER_USER_BEGIN';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_ERROR = 'REGISTER_USER_ERROR';

// New LOGIN...
export const LOGIN_USER_BEGIN = 'LOGIN_USER_BEGIN';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_ERROR = 'LOGIN_USER_ERROR';
```

###### ROOT/client/src/context/appContext.js

```js
import { useReducer, useContext, createContext } from 'react';
import axios from 'axios';
import reducer from './reducer';
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  // New LOGIN...
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
} from './actions';
const AppContext = createContext();

const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
const userLocation = localStorage.getItem('location');

export const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '',
  jobLocation: userLocation || '',
};
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 1500);
  };

  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('location', location);
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('location');
  };

  const registerUser = async (currentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      const response = await axios.post('/api/v1/auth/register', currentUser);
      console.log('response', response);
      const { user, token, location } = response.data;
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: { user, token, location },
      });
      addUserToLocalStorage({
        user,
        token,
        location,
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: appContext.js:44 ~ registerUser ~ error.response',
        error.response
      );

      dispatch({
        type: REGISTER_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  // New loginUser content
  const loginUser = async (currentUser) => {
    dispatch({ type: LOGIN_USER_BEGIN });
    try {
      const { data } = await axios.post('/api/v1/auth/login', currentUser);
      const { user, token, location } = data;
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: { user, token, location },
      });
      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        loginUser, // <--
        displayAlert,
        registerUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider };
```

###### ROOT/client/src/context/reducer.js

```js
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  // New LOGIN...
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
} from './actions';

const reducer = (state, action) => {
  if (action.type === DISPLAY_ALERT) {
    return {
      ...state,
      showAlert: true,
      alertType: 'danger',
      alertText: 'Please provide all values!',
    };
  }
  if (action.type === CLEAR_ALERT) {
    return {
      ...state,
      showAlert: false,
      alertType: '',
      alertText: '',
    };
  }

  if (action.type === REGISTER_USER_BEGIN) {
    return { ...state, isLoading: true };
  }

  if (action.type === REGISTER_USER_SUCCESS) {
    return {
      ...state,
      user: action.payload.user,
      token: action.payload.token,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'User Created! Redirecting...',
    };
  }

  if (action.type === REGISTER_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }
  // New LOGIN_USER_BEGIN
  if (action.type === LOGIN_USER_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }
  // New LOGIN_USER_SUCCESS
  if (action.type === LOGIN_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      user: action.payload.user,
      token: action.payload.token,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      showAlert: true,
      alertType: 'success',
      alertText: 'Login Successful! Redirecting...',
    };
  }
  // New LOGIN_USER_ERROR
  if (action.type === LOGIN_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }

  throw new Error(`no such action :${action.type}`);
};
export default reducer;
```

###### ROOT/client/src/pages/Register.js

```js
import { useState, useEffect } from 'react';
import { Logo, FormRow, Alert } from '../components';
import Wrapper from '../assets/wrappers/RegisterPage';
import { useAppContext } from '../context/appContext';
import { useNavigate } from 'react-router-dom';

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: false,
};

const Register = () => {
  const [values, setValues] = useState(initialState);
  const { isLoading, showAlert, displayAlert, registerUser, user, loginUser } =
    useAppContext(); // <-- loginUser
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  }, [user, navigate]);

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }
    const currentUser = { name, email, password };

    if (isMember) {
      //  console.log('Already a member');  <-- Before
      loginUser(currentUser); //  <-- After
    } else {
      registerUser(currentUser);
    }

    console.log(values);
  };

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? 'Login' : 'Register'}</h3>
        {showAlert && <Alert />}
        {!values.isMember && (
          <FormRow
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
          />
        )}
        <FormRow
          type="email"
          value={values.email}
          name="email"
          onChange={handleChange}
        />
        <FormRow
          type="password"
          value={values.password}
          name="password"
          onChange={handleChange}
        />

        <button type="submit" className="btn btn-block" disabled={isLoading}>
          submit
        </button>
        <p>
          {values.isMember ? 'Not a member yet?' : 'Already a member?'}
          <button type="button" onClick={toggleMember} className="member-btn">
            {values.isMember ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </Wrapper>
  );
};
export default Register;
```

---

</details>

<details>
  <summary>Setup nested routes</summary>
Example basic  nested structure...

_(http://localhost:3000/stats)_
_(http://localhost:3000/all-jobs)_
_(http://localhost:3000/add-job)_

###### App.js

```js
import {
  AddJob,
  AllJobs,
  Profile,
  Stats,
  SharedLayout,
} from './pages/dashboard/index';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="stats" element={<Stats />} />
          <Route path="all-jobs" element={<AllJobs />}></Route>
          <Route path="add-job" element={<AddJob />}></Route>
          <Route path="profile" element={<Profile />}></Route>
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route
          path="*"
          element={
            <div>
              <Error />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

---

</details>

<details>
  <summary>Create protected route and navigate user if logged in or not</summary>

###### App.js

```js
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Error, Landing, Register, ProtectedRoute } from './pages';
import {
  AddJob,
  AllJobs,
  Profile,
  Stats,
  SharedLayout,
} from './pages/dashboard/index';
// New <Route path="/" element={ <ProtectedRoute>.....
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Stats />} />
          <Route path="all-jobs" element={<AllJobs />}></Route>
          <Route path="add-job" element={<AddJob />}></Route>
          <Route path="profile" element={<Profile />}></Route>
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route
          path="*"
          element={
            <div>
              <Error />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

###### ROOT/src/pages/ProtectedRoute.js

New file

```js
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();

  if (!user) {
    return <Navigate to="landing" />;
  }
  return children;
};
export default ProtectedRoute;
```

###### ROOT/client/src/pages/index.js

```js
import Error from './Error';
import Landing from './Landing';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute'; // <--

export { Error, Landing, Register, ProtectedRoute }; // <--
```

---

</details>

<br>

## Auth - Server Setup
