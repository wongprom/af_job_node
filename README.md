# Add and search for jobs

![image](/images/readme/Screenshot%202023-02-02%20at%2015.01.02.png)
![image](/images/readme/Screenshot%202023-02-02%20at%2015.01.10.png)
![image](/images/readme/Screenshot%202023-02-02%20at%2015.01.43.png)
![image](/images/readme/Screenshot%202023-02-02%20at%2015.01.56.png)
![image](/images/readme/Screenshot%202023-02-02%20at%2015.02.08.png)
![image](/images/readme/Screenshot%202023-02-02%20at%2015.02.26.png)

## MongoDB, mongoose, API and Server stuff

<details>
  <summary>---template---</summary><br>
  [name](link)

```
npm install bcryptjs
```

![image](/images/readme)

###### Root/

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

<details>
  <summary>Auth setup</summary>

Setup this middleware as a protected Route for updateUser

###### ROOT/middleware/auth.js

New auth.js

```js
const auth = async (req, res, next) => {
  console.log('auth is running');
  next();
};

export default auth;
```

###### ROOT/routes/authRouter.js

```js
import express from 'express';
import { register, login, updateUser } from '../controllers/authController.js';
import authenticateUser from '../middleware/auth.js'; // <--

const router = express.Router();

router.route('/register').post(register); // <-- public route
router.route('/login').post(login); // <-- public route
router.route('/updateUser').patch(authenticateUser, updateUser); // <-- auth check !!

export default router;
```

###### ROOT/server.js

```js
//...some code
// Middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import authenticateUser from './middleware/auth.js'; // <--

//...some code

app.use('/api/v1/jobs', authenticateUser, jobsRouter); // <-- add authenticateUser before jobsRouter

//...some code
```

---

</details>

<details>
  <summary>Setup UnAuthenticatedError if user not auth</summary>

##### _These and severely other server thingy checks are using with PostMan_

###### ROOT/middleware/auth.js

```js
import { UnAuthenticatedError } from '../errors/index.js';

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new UnAuthenticatedError('Authentication Invalid');
  }
  console.log('auth is running');
  next();
};

export default auth;
```

---

</details>

<details>
  <summary>Complete user auth</summary>

###### ROOT/middleware/auth.js

```js
import jwt from 'jsonwebtoken'; // <--
import { UnAuthenticatedError } from '../errors/index.js';

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    // <--
    throw new UnAuthenticatedError('Authentication Invalid');
  }

  const token = authHeader.split(' ')[1]; // "Bearer ghoul567567h" => ["ghoul567567h"]
  try {
    // <-- try/catch
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log('payload', payload);
    // req.user = payload;
    req.user = { userId: payload.userId }; // <-- add user to req response
    next();
  } catch (error) {
    throw new UnAuthenticatedError('Authentication Invalid');
  }
};

export default auth;
```

---

</details>

## Update User - Server

<details>
  <summary>authController and User Schema</summary>

###### ROOT/controllers/authController.js

```js
// ...some code
const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;

  if (!email || !name || !lastName || !location) {
    throw new BadRequestError('Please provide all values');
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user,
    token,
    location: user.location,
  });
};
export { register, login, updateUser };
```

###### ROOT/models/User.js

```js
import mongoose from 'mongoose';
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

// ...some code

UserSchema.pre('save', async function () {
  //console.log('this.modifiedPaths => ', this.modifiedPaths());
  //console.log('this.isModified => ', this.isModified('name'));
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ...some code

export default mongoose.model('User', UserSchema);
```

---

</details>

## Profile page - Front End

<details>
  <summary>Style Profile page and add/create existing functionality to form </summary>

###### Root/client/src/pages/dashboard/Profile.js

```js
import { useState } from 'react';
import { FormRow, Alert } from '../../components';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

const Profile = () => {
  const { user, showAlert, displayAlert, updateUser, isLoading } =
    useAppContext();
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [lastName, setLastName] = useState(user?.lastName);
  const [location, setLocation] = useState(user?.location);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !lastName || !location) {
      // test and remove temporary
      displayAlert();
      return;
    }

    updateUser({ name, email, lastName, location });
  };

  return (
    <Wrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h3>profile </h3>
        {showAlert && <Alert />}
        <div className="form-center">
          <FormRow
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormRow
            labelText="last name"
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <FormRow
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormRow
            type="text"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button className="btn btn-block" type="submit" disabled={isLoading}>
            {isLoading ? 'Please Wait...' : 'save changes'}
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default Profile;
```

###### ROOT/client/src/context/appContext.js

Create updateUser async func

```js
import { useContext, createContext } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  // ...some code

  // New updateUser
  const updateUser = async (currentUser) => {
    console.log(currentUser);
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        loginUser,
        displayAlert,
        registerUser,
        toggleSidebar,
        logoutUser,
        updateUser, // <--
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider };
```

---

</details>

## Axios - different approaches

<details>
  <summary>Manual approach - Bearer Token</summary>

###### ROOT/client/src/context/appContext.js

Demo on updateUser func

```js
import { useReducer, useContext, createContext } from 'react';
import axios from 'axios';
import reducer from './reducer';

const AppContext = createContext();

export const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '',
  jobLocation: userLocation || '',
  showSidebar: false,
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Check headers thingy with Bearer...
  const updateUser = async (currentUser) => {
    try {
      const { data } = await axios.patch(
        '/api/v1/auth/updateUser',
        currentUser,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      console.log(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        loginUser,
        displayAlert,
        registerUser,
        toggleSidebar,
        logoutUser,
        updateUser,
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
  <summary>Global approach - Bearer Token</summary>

###### ROOT/client/src/context/appContext.js

Demo on updateUser func

```js
import { useReducer, useContext, createContext } from 'react';
import axios from 'axios';
import reducer from './reducer';

const AppContext = createContext();

export const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '',
  jobLocation: userLocation || '',
  showSidebar: false,
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // set global headers as default
  axios.defaults.headers['Authorization'] = `Bearer ${state.token}`;

  const updateUser = async (currentUser) => {
    try {
      const { data } = await axios.patch(
        '/api/v1/auth/updateUser',
        currentUser
      );
      console.log(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        loginUser,
        displayAlert,
        registerUser,
        toggleSidebar,
        logoutUser,
        updateUser,
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
  <summary>Setup Axios instance</summary>

###### ROOT/client/src/context/appContext.js

Demo on updateUser func

```js
import { useReducer, useContext, createContext } from 'react';
import axios from 'axios';
import reducer from './reducer';

const AppContext = createContext();

export const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '',
  jobLocation: userLocation || '',
  showSidebar: false,
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // create instance
  const authFetch = axios.create({
    baseURL: '/api/v1',
    headers: {
      Authorization: `Bearer ${state.token}`,
    },
  });

  const updateUser = async (currentUser) => {
    try {
      //  authFetch.patch....
      const { data } = await authFetch.patch(
        '/api/v1/auth/updateUser',
        currentUser
      );
      console.log(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        loginUser,
        displayAlert,
        registerUser,
        toggleSidebar,
        logoutUser,
        updateUser,
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
  <summary>Axios interceptors</summary>

[https://axios-http.com/docs/interceptors](https://axios-http.com/docs/interceptors)

Demo on updateUser func

###### ROOT/client/src/context/appContext.js

```js
import { useReducer, useContext, createContext } from 'react';
import axios from 'axios';
import reducer from './reducer';

const AppContext = createContext();

export const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '',
  jobLocation: userLocation || '',
  showSidebar: false,
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Axios create instance
  const authFetch = axios.create({
    baseURL: '/api/v1',
  });

  // Request Interceptors
  authFetch.interceptors.request.use(
    (config) => {
      console.log('.interceptors.request');
      config.headers['Authorization'] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptors
  authFetch.interceptors.response.use(
    (response) => {
      console.log('.interceptors.response');
      return response;
    },
    (error) => {
      console.log(error.response);
      if (error.response.status === 401) {
        console.log('AUTH ERROR 401');
      }
      return Promise.reject(error);
    }
  );

  const updateUser = async (currentUser) => {
    try {
      const { data } = await authFetch.patch(
        '/api/v1/auth/updateUser',
        currentUser
      );
      console.log(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        loginUser,
        displayAlert,
        registerUser,
        toggleSidebar,
        logoutUser,
        updateUser,
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

## Update user + add to localStorage

<details>
  <summary>Update user in database, localStorage </summary>

###### ROOT/client/src/context/actions.js

```js
export const DISPLAY_ALERT = 'SHOW_ALERT';
export const CLEAR_ALERT = 'CLEAR_ALERT';

export const REGISTER_USER_BEGIN = 'REGISTER_USER_BEGIN';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_ERROR = 'REGISTER_USER_ERROR';

export const LOGIN_USER_BEGIN = 'LOGIN_USER_BEGIN';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_ERROR = 'LOGIN_USER_ERROR';

export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const LOGOUT_USER = 'LOGOUT_USER';

// New UPDATE_USER...
export const UPDATE_USER_BEGIN = 'UPDATE_USER_BEGIN';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_ERROR = 'UPDATE_USER_ERROR';
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
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN, // <--
  UPDATE_USER_SUCCESS, // <--
  UPDATE_USER_ERROR, // <--
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
  showSidebar: false,
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Axios Interceptors
  const authFetch = axios.create({
    baseURL: '/api/v1',
  });

  // Request Interceptors
  authFetch.interceptors.request.use(
    (config) => {
      config.headers['Authorization'] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptors
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        console.log('AUTH ERROR 401');
      }
      return Promise.reject(error);
    }
  );

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

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage();
  };

  // New stuff in updateUser func
  const updateUser = async (currentUser) => {
    dispatch({
      type: UPDATE_USER_BEGIN,
    });
    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser);
      const { user, location, token } = data;
      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, token, location },
      });
      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      dispatch({
        type: UPDATE_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        loginUser,
        displayAlert,
        registerUser,
        toggleSidebar,
        logoutUser,
        updateUser,
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
import { initialState } from './appContext';
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN, // <--
  UPDATE_USER_SUCCESS, // <--
  UPDATE_USER_ERROR, // <--
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

  if (action.type === LOGIN_USER_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }
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
  if (action.type === LOGIN_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }
  if (action.type === TOGGLE_SIDEBAR) {
    console.log('navbar toggled');
    return {
      ...state,
      showSidebar: !state.showSidebar,
    };
  }
  if (action.type === LOGOUT_USER) {
    console.log('LOGOUT_USER');
    return {
      ...initialState,
      user: null,
      token: null,
      userLocation: '',
      jobLocation: '',
    };
  }
  // 3 New UPDATE_USER_... action  types
  if (action.type === UPDATE_USER_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === UPDATE_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      token: action.payload.token,
      user: action.payload.user,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      showAlert: true,
      alertType: 'success',
      alertText: 'User Profile Updated!',
    };
  }

  if (action.type === UPDATE_USER_ERROR) {
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

---

</details>

<details>
  <summary>401 Error - user not Authorized</summary><br>

Logout user when not Authorized, instead of display error message. The often case is that token have expired.

###### ROOT/client/src/context/appContext.js

```js
// ...Some code

// Response Interceptors
authFetch.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      logoutUser(); // <-- Logout user
    }
    return Promise.reject(error);
  }
);

// ...Some code
```

```js
// ...Some code

const updateUser = async (currentUser) => {
  dispatch({
    type: UPDATE_USER_BEGIN,
  });
  try {
    const { data } = await authFetch.patch('/auth/updateUser', currentUser);
    const { user, location, token } = data;
    dispatch({
      type: UPDATE_USER_SUCCESS,
      payload: { user, token, location },
    });
    addUserToLocalStorage({ user, token, location });
  } catch (error) {
    // New if check...
    if (error.response.status !== 401) {
      dispatch({
        type: UPDATE_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
  }
  clearAlert();
};
// ...Some code
```

---

</details>

## Job Schema

<details>
  <summary>Create Schema for Job with mongoose</summary>

###### ROOT/models/Job.js

```js
import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },

    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship'],
      default: 'full-time',
    },
    jobLocation: {
      type: String,
      default: 'my city',
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
);
export default mongoose.model('Job', JobSchema);
```

---

</details>

<details>
  <summary>Update jobsController</summary>

Update func createJob

###### ROOT/controllers/jobsController.js

```js
// New imports, ALL of them
import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js';

// Content in func createJob
const createJob = async (req, res) => {
  const { position, company } = req.body;

  if (!position || !company) {
    throw new BadRequestError('Please provide all values');
  }
  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const deleteJob = async (req, res) => {
  res.send('deleteJob');
};
const getAllJobs = async (req, res) => {
  res.send('getAllJobs');
};
const updateJob = async (req, res) => {
  res.send('updateJob');
};
const showStats = async (req, res) => {
  res.send('showStats');
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
```

---

</details>

<details>
  <summary>Update initialState with "job" values</summary>

###### ROOT/client/src/context/appContext.js

InitialState before update

```js
export const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '',
  jobLocation: userLocation || '',
  showSidebar: false,
};
```

InitialState after update

```js
export const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '',
  jobLocation: userLocation || '',
  showSidebar: false,
  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  jobType: 'full-time',
  statusOptions: ['pending', 'interview', 'declined'],
  status: 'pending',
};
```

---

</details>

<details>
  <summary>Structure AddJobs and add style</summary>

###### ROOT/client/src/pages/dashboard/AddJob.js

```js
import { FormRow, Alert } from '../../components';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

const AddJob = () => {
  const {
    isEditing,
    showAlert,
    displayAlert,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
  } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!position || !company || !jobLocation) {
      displayAlert();
      return;
    }
    console.log('create job');
  };

  const handleJobInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log(`${name}:${value}`);
  };

  return (
    <Wrapper>
      <form className="form">
        <h3>{isEditing ? 'edit job' : 'add job'} </h3>
        {showAlert && <Alert />}
        <div className="form-center">
          <FormRow
            type="text"
            name="position"
            value={position}
            onChange={handleJobInput}
          />
          <FormRow
            type="text"
            name="company"
            value={company}
            onChange={handleJobInput}
          />
          <FormRow
            type="text"
            labelText="location"
            name="jobLocation"
            value={jobLocation}
            onChange={handleJobInput}
          />
          {/* job type */}

          {/* job status */}

          <div className="btn-container">
            <button
              className="btn btn-block submit-btn"
              type="submit"
              onClick={handleSubmit}
            >
              submit
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddJob;
```

---

</details>

<details>

  <summary>Add input field for job-type selector</summary>

###### ROOT/client/src/pages/dashboard/AddJob.js

```js
// ...some code
{
  /* job type */
}
<div className="form-row">
  <label htmlFor="jobType" className="form-label">
    job type
  </label>

  <select
    name="jobType"
    value={jobType}
    onChange={handleJobInput}
    className="form-select"
  >
    {jobTypeOptions.map((itemValue, index) => {
      return (
        <option key={index} value={itemValue}>
          {itemValue}
        </option>
      );
    })}
  </select>
</div>;

{
  /* job status */
}

// ...some code
```

---

</details>

<details>
  <summary>Create component for select input</summary>

New component FormRowSelect

###### ROOT/client/src/components/FormRowSelect.js

```js
const FormRowSelect = ({ labelText, name, value, handleChange, list }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>

      <select
        name={name}
        value={value}
        onChange={handleChange}
        className="form-select"
      >
        {list.map((itemValue, index) => {
          return (
            <option key={index} value={itemValue}>
              {itemValue}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default FormRowSelect;
```

Import/export FormRowSelect

###### ROOT/client/src/components/index.js

```js
import Logo from './Logo';
import FormRow from './FormRow';
import Alert from './Alert';
import Navbar from './Navbar';
import BigSidebar from './BigSidebar';
import SmallSidebar from './SmallSidebar';
import FormRowSelect from './FormRowSelect';

export {
  Logo,
  FormRow,
  Navbar,
  BigSidebar,
  SmallSidebar,
  Alert,
  FormRowSelect,
};
```

Import FormRowSelect component and return it with props

###### ROOT/client/src/pages/dashboard/AddJob.js

```js
import { FormRow, Alert, FormRowSelect } from '../../components'; // <--
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

const AddJob = () => {
  const {
    isEditing,
    showAlert,
    displayAlert,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
  } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!position || !company || !jobLocation) {
      displayAlert();
      return;
    }
    console.log('create job');
  };

  const handleJobInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log(`${name}:${value}`);
  };

  return (
    <Wrapper>
      <form className="form">
        <h3>{isEditing ? 'edit job' : 'add job'} </h3>
        {showAlert && <Alert />}
        <div className="form-center">
          {/* job type */}
          {/* job type */}
          <FormRowSelect
            labelText="job type"
            name="jobType"
            value={jobType}
            handleChange={handleJobInput}
            list={jobTypeOptions}
          />

          {/* job status */}
          <FormRowSelect
            name="status"
            value={status}
            handleChange={handleJobInput}
            list={statusOptions}
          />
          <div className="btn-container">
            <button
              className="btn btn-block submit-btn"
              type="submit"
              onClick={handleSubmit}
            >
              submit
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddJob;
```

---

</details>

<details>
  <summary> 🔥 Create func to handle global value  </summary>

[JS Nuggets Dynamic Object Keys](https://youtu.be/_qxCYtWm0tw)

###### ROOT/client/src/context/actions.js

```js
export const DISPLAY_ALERT = 'SHOW_ALERT';
export const CLEAR_ALERT = 'CLEAR_ALERT';

export const REGISTER_USER_BEGIN = 'REGISTER_USER_BEGIN';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_ERROR = 'REGISTER_USER_ERROR';

export const LOGIN_USER_BEGIN = 'LOGIN_USER_BEGIN';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_ERROR = 'LOGIN_USER_ERROR';

export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const LOGOUT_USER = 'LOGOUT_USER';

export const UPDATE_USER_BEGIN = 'UPDATE_USER_BEGIN';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_ERROR = 'UPDATE_USER_ERROR';

export const HANDLE_CHANGE = 'HANDLE_CHANGE'; // <--
```

###### ROOT/client/src/context/appContext.js

```js
// some code...
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE, // <--
} from './actions';
// some code ...
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // some code...

  // New handleChange
  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        loginUser,
        displayAlert,
        registerUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange, // <--
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
// some code...
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE, // <--
} from './actions';
// some code...
if (action.type === HANDLE_CHANGE) {
  return {
    ...state,
    [action.payload.name]: action.payload.value,
  };
}
// some code...
```

###### ROOT/client/src/pages/dashboard/AddJob.js

```js
import { FormRow, Alert, FormRowSelect } from '../../components';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

const AddJob = () => {
  const {
    isEditing,
    showAlert,
    displayAlert,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
    handleChange, // <--
  } = useAppContext();

  // some code...

  const handleJobInput = (e) => {
    // handleChange
    handleChange({ name: e.target.name, value: e.target.value });
  };

  return (
    <Wrapper>
      <form className="form">
        <h3>{isEditing ? 'edit job' : 'add job'} </h3>
        {showAlert && <Alert />}
        <div className="form-center">
          <FormRow
            type="text"
            name="position"
            value={position}
            onChange={handleJobInput}
          />
          <FormRow
            type="text"
            name="company"
            value={company}
            onChange={handleJobInput}
          />
          <FormRow
            type="text"
            labelText="location"
            name="jobLocation"
            value={jobLocation}
            onChange={handleJobInput}
          />

          {/* job type */}
          <FormRowSelect
            labelText="job type"
            name="jobType"
            value={jobType}
            handleChange={handleJobInput}
            list={jobTypeOptions}
          />

          {/* job status */}
          <FormRowSelect
            name="status"
            value={status}
            handleChange={handleJobInput}
            list={statusOptions}
          />
          <div className="btn-container">
            <button
              className="btn btn-block submit-btn"
              type="submit"
              onClick={handleSubmit}
            >
              submit
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddJob;
```

---

</details>

<details>
  <summary>Clear values in add job form</summary><br>

Clear form with an action.
⚠️ Place Clear button AFTER the submit button in the form, otherwise the the functionality for Enter button on keyboard won't work properly

###### ROOT/client/src/context/actions.js

```js
// some code...
export const CLEAR_VALUES = 'CLEAR_VALUES';
```

###### ROOT/client/src/context/appContext.js

```js
import {
  // some imports....
  CLEAR_VALUES,
} from './actions';
// some code...

const clearValues = () => {
  dispatch({
    type: CLEAR_VALUES,
  });
};

return (
  <AppContext.Provider
    value={{
      ...state,
      loginUser,
      displayAlert,
      registerUser,
      toggleSidebar,
      logoutUser,
      updateUser,
      handleChange,
      clearValues, // <--
    }}
  >
    {children}
  </AppContext.Provider>
);
// some code...
```

###### ROOT/client/src/context/reducer.js

```js
import {
  // some imports....
  CLEAR_VALUES,
} from './actions';

// some code...

if (action.type === CLEAR_VALUES) {
  const initialState = {
    isEditing: false,
    editJobId: '',
    position: '',
    company: '',
    jobLocation: state.userLocation,
    jobType: 'full-time',
    status: 'pending',
  };
  return { ...state, ...initialState };
}
// some code...
```

###### ROOT/client/src/pages/dashboard/AddJob.js

```js
import { FormRow, Alert, FormRowSelect } from '../../components';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

const AddJob = () => {
  const {
    isEditing,
    showAlert,
    displayAlert,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
    handleChange,
    clearValues, // <--
  } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!position || !company || !jobLocation) {
      displayAlert();
      return;
    }
    console.log('create job');
  };

  const handleJobInput = (e) => {
    handleChange({ name: e.target.name, value: e.target.value });
  };

  return (
    <Wrapper>
      <form className="form">
        <h3>{isEditing ? 'edit job' : 'add job'} </h3>
        {showAlert && <Alert />}
        <div className="form-center">
          <FormRow
            type="text"
            name="position"
            value={position}
            onChange={handleJobInput}
          />
          <FormRow
            type="text"
            name="company"
            value={company}
            onChange={handleJobInput}
          />
          <FormRow
            type="text"
            labelText="location"
            name="jobLocation"
            value={jobLocation}
            onChange={handleJobInput}
          />

          <FormRowSelect
            labelText="job type"
            name="jobType"
            value={jobType}
            handleChange={handleJobInput}
            list={jobTypeOptions}
          />

          <FormRowSelect
            name="status"
            value={status}
            handleChange={handleJobInput}
            list={statusOptions}
          />
          <div className="btn-container">
            <button
              className="btn btn-block clear-btn"
              onClick={(e) => {
                e.preventDefault();
                clearValues();
              }}
            >
              clear
            </button>
            <button
              className="btn btn-block submit-btn"
              type="submit"
              onClick={handleSubmit}
            >
              submit
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddJob;
```

---

</details>

<details>
  <summary>Submit/create new job</summary><br>
- Create action
- run func from handleSubmit

###### Root/client/src/context/actions.js

```js
// some other imports
export const CREATE_JOB_BEGIN = 'CREATE_JOB_BEGIN';
export const CREATE_JOB_SUCCESS = 'CREATE_JOB_SUCCESS';
export const CREATE_JOB_ERROR = 'CREATE_JOB_ERROR';
```

###### Root/client/src/context/appContext.js

```js
import {
  // some other imports
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
} from './actions';
// some code....

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Axios Instance
  const authFetch = axios.create({
    baseURL: '/api/v1',
  });

  // Request Interceptors
  authFetch.interceptors.request.use(
    (config) => {
      config.headers['Authorization'] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptors
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  // some code...

  // New createJob
  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.post('/jobs', {
        company,
        position,
        jobLocation,
        jobType,
        status,
      });

      dispatch({
        type: CREATE_JOB_SUCCESS,
      });

      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        // SOme code
        createJob,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
```

###### Root/client/src/context/reducer.js

```js
import { initialState } from './appContext';
import {
  // some other imports
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
} from './actions';

const reducer = (state, action) => {
  // some code...

  if (action.type === CREATE_JOB_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === CREATE_JOB_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'New Job Created!',
    };
  }

  if (action.type === CREATE_JOB_ERROR) {
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

###### Root/client/src/pages/dashboard/AddJob.js

```js
const {
  isLoading,
  isEditing,
  showAlert,
  displayAlert,
  position,
  company,
  jobLocation,
  jobType,
  jobTypeOptions,
  status,
  statusOptions,
  handleChange,
  clearValues,
  createJob,
} = useAppContext();

// some code ...
const handleSubmit = (e) => {
  e.preventDefault();
  // toggle comment for testing
  if (!position || !company || !jobLocation) {
    displayAlert();
    return;
  }
  if (isEditing) {
    // eventually editJob()
    return;
  }
  createJob();
  console.log('create job');
};
// some code ...

<button
  className="btn btn-block submit-btn"
  type="submit"
  onClick={handleSubmit}
  disabled={isLoading}
>
  submit
</button>;

// some code ...
```

---

</details>

## Get All (users) Jobs - Server

<details>
  <summary>Get all jobs</summary><br>
  Use postman for testing

###### Root/controllers/jobsController.js

```js
import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js';

// some code ...

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId });
  console.log('🚀 ~ file: jobsController.js:24 ~ getAllJobs ~ jobs', jobs);

  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numOfPages: 1 });
  res.send('getAllJobs');
};

// Some code....

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
```

---

</details>

## Get all jobs - frontend

<details>
  <summary>Get all jobs request </summary><br>

###### Root/client/src/context/actions.js

```js
// ...Some code
export const GET_JOBS_BEGIN = 'GET_JOBS_BEGIN';
export const GET_JOBS_SUCCESS = 'GET_JOBS_SUCCESS';
```

###### Root/client/src/context/appContext.js

```js
import { useReducer, useContext, createContext, useEffect } from 'react';
import axios from 'axios';
import reducer from './reducer';
import {
  // some code...
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
} from './actions';
const AppContext = createContext();

// some code ....

export const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '',
  showSidebar: false,
  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  jobType: 'full-time',
  statusOptions: ['pending', 'interview', 'declined'],
  status: 'pending',
  jobLocation: userLocation || '',
  // New added key value for jobs
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
};

const AppProvider = ({ children }) => {
  // some code...

  const getJobs = async () => {
    const url = `/jobs`;
    dispatch({ type: GET_JOBS_BEGIN });
    try {
      const { data } = await authFetch.get(url);
      const { jobs, totalJobs, numOfPages } = data;
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      });
    } catch (error) {
      console.log(error.response);
      logoutUser();
    }
    clearAlert();
  };
  // Temporary thing to get allJobs data
  useEffect(() => {
    getJobs();
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        // some code...
        getJobs,
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

###### Root/client/src/context/reducer.js

```js
import {
  // SOME CODE...
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
} from './actions';

// SOME CODE ...

if (action.type === GET_JOBS_BEGIN) {
  return {
    ...state,
    isLoading: true,
    showAlert: false,
  };
}

if (action.type === GET_JOBS_SUCCESS) {
  return {
    ...state,
    isLoading: false,
    jobs: action.payload.jobs,
    totalJobs: action.payload.totalJobs,
    numOfPages: action.payload.numOfPages,
  };
}
// SOME CODE ...
```

---

</details>

## Setup AllJobs Page - Frontend

<details>
  <summary>Lets render some data from AllJobs Page with new components</summary><br>

- Create/update some components...
- Render company name

<br>
New component SearchContainer

###### Root/client/src/components/SearchContainer.js

```js
const SearchContainer = () => {
  return <div>SearchContainer</div>;
};
export default SearchContainer;
```

New component Job

###### Root/client/src/components/Job.js

```js
const Job = ({ company }) => {
  return (
    <div>
      <h5>{company}</h5>
    </div>
  );
};
export default Job;
```

New component JobInfo

###### Root/client/src/components/JobInfo.js

```js
const JobInfo = () => {
  return <div>JobInfo</div>;
};
export default JobInfo;
```

New component JobsContainer

###### Root/client/src/components/JobsContainer.js

```js
import { useAppContext } from '../context/appContext';
import { useEffect } from 'react';
import Loading from './Loading';
import Job from './Job';
import Wrapper from '../assets/wrappers/JobsContainer';

const JobsContainer = () => {
  const { getJobs, jobs, isLoading, page, totalJobs } = useAppContext();
  useEffect(() => {
    getJobs();
  }, []);

  if (isLoading) {
    return <Loading center />;
  }

  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No jobs to display...</h2>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <h5>
        {totalJobs} job{jobs.length > 1 && 's'} found
      </h5>
      <div className="jobs">
        {jobs.map((job) => {
          return <Job key={job._id} {...job} />;
        })}
      </div>
    </Wrapper>
  );
};

export default JobsContainer;
```

New component Loading

###### Root/client/src/components/Loading.js

```js
const Loading = ({ center }) => {
  return <div className={center ? 'loading loading-center' : 'loading'}></div>;
};

export default Loading;
```

New component SearchContainer

###### Root/client/src/components/SearchContainer.js

```js
const SearchContainer = () => {
  return <div>SearchContainer</div>;
};
export default SearchContainer;
```

Update component JobsContainer

###### Root/client/src/pages/dashboard/AllJobs.js

```js
// Before update
const AllJobs = () => {
  return <div>AllJobs</div>;
};
export default AllJobs;
```

```js
// After update
import { JobsContainer, SearchContainer } from '../../components';
const AllJobs = () => {
  return (
    <>
      <SearchContainer />
      <JobsContainer />
    </>
  );
};

export default AllJobs;
```

---

</details>

<details>
  <summary>Formate date with package Moment</summary><br>

[https://momentjs.com/](https://momentjs.com/)

```
npm install moment
```

###### Root/client/src/components/Job.js

```js
// Before update Job
const Job = ({ company }) => {
  return (
    <div>
      <h5>{company}</h5>
    </div>
  );
};
export default Job;
```

```js
// Updated Job
import moment from 'moment'; // <--

const Job = ({ company, createdAt }) => {
  let date = moment(createdAt); // <--
  date = date.format('DD/MM/YYYY'); // --> 19/01/2023
  return (
    <div>
      <h5>{company}</h5>
      <h5>{date}</h5>
    </div>
  );
};
export default Job;
```

---

</details>

<details>
  <summary>Add some more styling to AllJobs page and sub components</summary><br>

Add some more styling to JobInfo

###### Root/client/src/components/JobInfo.js

```js
import Wrapper from '../assets/wrappers/JobInfo';

const JobInfo = ({ icon, text }) => {
  return (
    <Wrapper>
      <span className="icon">{icon}</span>
      <span className="text">{text}</span>
    </Wrapper>
  );
};

export default JobInfo;
```

Add some more styling to Job and basic func setEditJob, deleteJob

###### Root/client/src/components/Job.js

```js
import moment from 'moment';
import { Link } from 'react-router-dom';
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/Job';
import JobInfo from './JobInfo';

const Job = ({
  position,
  _id,
  status,
  jobType,
  jobLocation,
  createdBy,
  company,
  createdAt,
}) => {
  const { setEditJob, deleteJob } = useAppContext();
  let date = moment(createdAt);
  date = date.format('DD/MM/YYYY');
  return (
    <Wrapper>
      <header>
        <div className="main-icon">{company.charAt(0)}</div>
        <div className="info">
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />
          <div className={`status ${status}`}>{status}</div>
        </div>
        <footer>
          <div className="actions">
            <Link
              to="/add-job"
              onClick={() => setEditJob(_id)}
              className="btn edit-btn"
            >
              Edit
            </Link>
            <button
              type="button"
              className="btn delete-btn"
              onClick={() => deleteJob(_id)}
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};
export default Job;
```

Add func setEditJob, deleteJob

###### Root/client/src/context/appContext.js

```js
// some code...

const AppProvider = ({ children }) => {
  // some code...

  const setEditJob = (id) => {
    console.log(`set edit job : ${id}`);
  };
  const deleteJob = (id) => {
    console.log(`delete : ${id}`);
  };

  return (
    <AppContext.Provider
      value={{
        // Some code
        setEditJob,
        deleteJob,
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
  <summary>Setup func setEditJob before edit a specific job</summary><br>

Create new action, SET_EDIT_JOB

###### Root/client/src/context/actions.js

```js
export const SET_EDIT_JOB = 'SET_EDIT_JOB';
```

Setup in appContext

###### Root/client/src/context/appContext.js

```js
// some code..
import {
  // some code..
  SET_EDIT_JOB,
} from './actions';

// some code..

const AppProvider = ({ children }) => {
  // some code..
  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  };
  // some code..

  return (
    <AppContext.Provider
      value={{
        // some code...
        setEditJob,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider };
```

Setup functionality in reducer

###### Root/client/src/context/reducer.js

```js
import { initialState } from './appContext';
import {
  //some code..
  SET_EDIT_JOB,
} from './actions';

const reducer = (state, action) => {
  // some code...

  if (action.type === SET_EDIT_JOB) {
    const job = state.jobs.find((job) => job._id === action.payload.id);
    const { _id, position, company, jobLocation, jobType, status } = job;

    return {
      ...state,
      isEditing: true,
      editJobId: _id,
      position,
      company,
      jobLocation,
      jobType,
      status,
    };
  }

  throw new Error(`no such action :${action.type}`);
};
export default reducer;
```

Make some changes in AddJob

###### Root/client/src/pages/dashboard/AddJob.js

```js
import { FormRow, Alert, FormRowSelect } from '../../components';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

const AddJob = () => {
  const {
    isLoading,
    isEditing,
    showAlert,
    displayAlert,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
    handleChange,
    clearValues,
    createJob,
    editJob,
  } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    // toggle if check for testing
    if (!position || !company || !jobLocation) {
      displayAlert();
      return;
    }
    if (isEditing) {
      // is now true, after action SET_EDIT_JOB
      editJob(); // console.log gives "edit Job" for now
      return;
    }
    createJob();
    console.log('create job');
  };

  return (
    <Wrapper>
      <form className="form">
        <h3>{isEditing ? 'edit job' : 'add job'} </h3>
        {showAlert && <Alert />}
        <div className="form-center">
          {/* some code ...*/}
          <div className="btn-container">
            <button
              className="btn btn-block submit-btn"
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              submit
            </button>
            <button
              className="btn btn-block clear-btn"
              onClick={(e) => {
                e.preventDefault();
                clearValues();
              }}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddJob;
```

---

</details>

## Edit, delete job - server

<details>
  <summary>Edit Job Controller to save edited job</summary><br>

Add functionality to updateJob, make tests with Postman

###### Root/controllers/jobsController.js

```js
import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';

const updateJob = async (req, res) => {
  // give alias to id
  const { id: jobId } = req.params;
  const { company, position } = req.body;

  if (!company || !position) {
    throw new BadRequestError('Please provide all values');
  }

  //  find _id that matches jobId
  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`);
  }

  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ updatedJob });
};

export { updateJob };
```

---

</details>

<details>
  <summary>Alternative approach, save edited job to database</summary><br>

###### Root/controllers/jobsController.js

```js
const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position, jobLocation } = req.body;

  if (!position || !company) {
    throw new BadRequestError('Please provide all values');
  }
  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id :${jobId}`);
  }

  // alternative approach

  job.position = position;
  job.company = company;
  job.jobLocation = jobLocation;

  await job.save();
  res.status(StatusCodes.OK).json({ job });
};
```

---

</details>

<details>
  <summary>Check permission before edit a job</summary><br>

You should only have permission to edit jobs you have created. Create checkPermissions function

###### Root/utils/checkPermissions.js

```js
import { UnAuthenticatedError } from '../errors/index.js';

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnAuthenticatedError('Not authorized to access this route');
};

export default checkPermissions;
```

Import checkPermissions to jobsController, pass 2 arguments

###### Root/controllers/jobsController.js

```js
// some imports...
import checkPermissions from '../utils/checkPermissions.js';
// some code...

const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position } = req.body;

  if (!company || !position) {
    throw new BadRequestError('Please provide all values');
  }

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`);
  }
  // check permission
  checkPermissions(req.user, job.createdBy);

  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ updatedJob });
};

export { updateJob };
```

---

</details>

<details>
  <summary>Delete job</summary><br>

###### Root/controllers/jobsController.js

```js
const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id : ${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);

  await job.remove();
  res.status(StatusCodes.OK).json({ msg: 'Success! Job removed' });
};
```

---

</details>

## Edit, delete job - Frontend

<details>
  <summary>Delete job request</summary><br>

Create DELETE_JOB_BEGIN action and impl

###### Root/client/src/context/actions.js

```js
export const DELETE_JOB_BEGIN = 'DELETE_JOB_BEGIN';
```

###### Root/client/src/context/appContext.js

```js
import { useReducer, useContext, createContext, useEffect } from 'react';
import axios from 'axios';
import reducer from './reducer';
import {
  // some code
  DELETE_JOB_BEGIN,
} from './actions';

// some code...

const AppProvider = ({ children }) => {
  // some code...

  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN });

    try {
      await authFetch.delete(`/jobs/${jobId}`);
      getJobs();
    } catch (error) {
      logoutUser();
    }
  };

  return (
    <AppContext.Provider
      value={{
        // some code...
        deleteJob,
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

###### Root/client/src/context/reducer.js

```js
import { initialState } from './appContext';
import {
  // some code...
  DELETE_JOB_BEGIN,
} from './actions';

const reducer = (state, action) => {
  // some code ...

  if (action.type === DELETE_JOB_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }

  throw new Error(`no such action :${action.type}`);
};
export default reducer;
```

---

</details>

<details>
  <summary>Edit job functionality-</summary><br>

Create actions for EDIT_JOB...

###### Root/client/src/context/actions.js

```js
export const EDIT_JOB_BEGIN = 'EDIT_JOB_BEGIN';
export const EDIT_JOB_SUCCESS = 'EDIT_JOB_SUCCESS';
export const EDIT_JOB_ERROR = 'EDIT_JOB_ERROR';
```

Create actions for EDIT_JOB...

###### Root/client/src/context/appContext.js

```js
// some imports...

import {
  // some code...
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
} from './actions';

// some code...

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Axios Instance
  const authFetch = axios.create({
    baseURL: '/api/v1',
  });

  // Request Interceptors
  authFetch.interceptors.request.use(
    (config) => {
      config.headers['Authorization'] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptors
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  // some code...

  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.patch(`/jobs/${state.editJobId}`, {
        position,
        company,
        jobLocation,
        jobType,
        status,
      });
      dispatch({ type: EDIT_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  // some code...

  return (
    <AppContext.Provider
      value={{
        // some code..
        editJob,
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

## Populate Database With Fake Jobs, Mockaroo

<details>
  <summary>Use Mockaroo to create fake jobs</summary><br>

[Mockaroo](https://www.mockaroo.com/)

Use exact same fields names as in your Job.js
![image](/images/readme/mockaroo.png)

Schema structure Job.js
![image](/images/readme/jobJs.png)

How to get CreatedBy field value from postman ?

- Login a user and copy `_id` value.
  ![image](/images/readme/postman-createdBy.png)

Make some changes before download .json

- Rows = amount of jobs will be created.
- We want to have json data.
- we don't want null values
- DOWNLOAD DATA
  ![image](/images/readme/mockaroo-changes.png)

- I have changed file name to `mock-data`
- Add `mock-data.json` file to ROOT
  ![image](/images/readme/add-mock-data.png)

Create new file populate.js to run from terminal

###### Root/populate.js

```js
import { readFile } from 'fs/promises';

import dotenv from 'dotenv';
dotenv.config();

import connectDB from './db/connect.js';
import Job from './models/Job.js';

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL); //mongodb+srv://...something@....mongodb.net/?retryWrites=true&w=majority
    await Job.deleteMany();

    const jsonProducts = JSON.parse(
      await readFile(new URL('./mock-data.json', import.meta.url))
    );
    await Job.create(jsonProducts);
    console.log('Success!!!!');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
```

From ROOT, run populate file in terminal

```
node populate
```

- We have added 100 fake jobs to db!
  ![image](/images/readme/db.png)

---

</details>

## Show Stats - Aggregation

<details>
  <summary>Use aggregation in jobsController for stats data</summary><br>

![image](/images/readme/aggregate.png)

Setup showStats function

###### Root/controllers/jobsController.js

```js
import mongoose from 'mongoose';
// some imports

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  // Gives this structure now 👇
  // {
  //   stats: [
  //     {
  //       _id: "pending",
  //       count: 24
  //     },
  //     {
  //       _id: "declined",
  //       count: 12
  //     },
  //     {
  //       _id: "interview",
  //       count: 12
  //     },
  //   ]
  // }

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});
  // Gives this structure after reduce 👇
  // {
  //  "defaultStats": {
  //       "pending": 24,
  //       "declined": 12
  //       "interview": 12,
  //   },
  // }

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  res.status(StatusCodes.OK).json({ defaultStats });
};

export { showStats };
```

---

</details>

## Stats - Frontend

<details>
  <summary>Get stats data with new action SHOW_STATS...</summary><br>

###### Root/client/src/context/actions.js

```js
export const SHOW_STATS_BEGIN = 'SHOW_STATS_BEGIN';
export const SHOW_STATS_SUCCESS = 'SHOW_STATS_SUCCESS';
```

###### Root/client/src/context/appContext.js

```js
//some imports..
import {
  // some code...
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
} from './actions';

export const initialState = {
  // some code
  stats: {},
};

const AppProvider = ({ children }) => {
  // some code..

  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch.get(`/jobs/stats`);
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
        },
      });
    } catch (error) {
      //toggle func logoutUser for testing
      // logoutUser()
    }
    clearAlert();
  };

  return (
    <AppContext.Provider
      value={{
        // some code...
        showStats,
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

###### Root/client/src/context/reducer.js

```js
import { initialState } from './appContext';
import {
  // some imports...
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
} from './actions';

const reducer = (state, action) => {
  if (action.type === SHOW_STATS_BEGIN) {
    return {
      ...state,
      isLoading: true,
      showAlert: false,
    };
  }

  if (action.type === SHOW_STATS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      stats: action.payload.stats,
    };
  }

  throw new Error(`no such action :${action.type}`);
};
export default reducer;
```

---

</details>

<details>
  <summary>Setup basic structure for Stats Page</summary><br>

New ChartsContainer component

###### Root/client/src/components/ChartsContainer.js

```js
const ChartsContainer = () => {
  return <div>ChartsContainer</div>;
};
export default ChartsContainer;
```

New StatsItem component

###### Root/client/src/components/StatsItem.js

```js
const StatsItem = () => {
  return <div>StatsItem</div>;
};
export default StatsItem;
```

New StatsContainer component

###### Root/client/src/components/StatsContainer.js

```js
import StatsItem from './StatsItem';

const StatsContainer = () => {
  return (
    <div>
      <h1>StatsContainer</h1>
      <StatsItem />
    </div>
  );
};
export default StatsContainer;
```

Import/export from index.

###### Root/client/src/components/index.js

```js
// some imports...
import ChartsContainer from './ChartsContainer';
import StatsContainer from './StatsContainer';

export {
  // some exports...

  StatsContainer,
  ChartsContainer,
};
```

Update Stats Page

###### Root/client/src/pages/dashboard/Stats.js

```js
import { useEffect } from 'react';
import { useAppContext } from '../../context/appContext';
import { StatsContainer, Loading, ChartsContainer } from '../../components';

const Stats = () => {
  const { showStats, isLoading } = useAppContext();
  useEffect(() => {
    showStats();
  }, []);

  if (isLoading) {
    <Loading center />;
  }

  return (
    <>
      <StatsContainer />
      <ChartsContainer />
    </>
  );
};
export default Stats;
```

---

</details>

<details>
  <summary>Display aggregation stats with Styled-Components dynamic colors </summary><br>

###### Root/client/src/components/StatsContainer.js

```js
import { useAppContext } from '../context/appContext';

import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from 'react-icons/fa';
import Wrapper from '../assets/wrappers/StatsContainer';

import StatsItem from './StatsItem';

const StatsContainer = () => {
  const { stats } = useAppContext();

  const defaultStats = [
    {
      title: 'pending applications',
      count: stats.pending || 0,
      icon: <FaSuitcaseRolling />,
      color: '#e9b949',
      bcg: '#fcefc7',
    },
    {
      title: 'interviews scheduled',
      count: stats.interview || 0,
      icon: <FaCalendarCheck />,
      color: '#647acb',
      bcg: '#e0e8f9',
    },
    {
      title: 'jobs declined',
      count: stats.declined || 0,
      icon: <FaBug />,
      color: '#d66a6a',
      bcg: '#ffeeee',
    },
  ];
  return (
    <Wrapper>
      {defaultStats.map((item, index) => {
        return <StatsItem key={index} {...item} />;
      })}
    </Wrapper>
  );
};
export default StatsContainer;
```

###### Root/client/src/components/StatsItem.js

```js
import Wrapper from '../assets/wrappers/StatItem';

const StatsItem = ({ count, title, icon, color, bcg }) => {
  return (
    <Wrapper color={color} bcg={bcg}>
      <header>
        <span className="count">{count}</span>
        <div className="icon">{icon}</div>
      </header>
      <h5 className="title">{title}</h5>
    </Wrapper>
  );
};
export default StatsItem;
```

---

</details>

## Show Charts - Aggregation - Server

<details>
  <summary>Use aggregation in jobsController for chart (monthlyApplications)</summary><br>

![image](/images/readme/chart.png)

Setup showStats function for chart

###### Root/controllers/jobsController.js

```js
import mongoose from 'mongoose';
// some imports

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  // Gives this structure now 👇
  // {
  //   stats: [
  //     {
  //       _id: "pending",
  //       count: 24
  //     },
  //     {
  //       _id: "declined",
  //       count: 12
  //     },
  //     {
  //       _id: "interview",
  //       count: 12
  //     },
  //   ]
  // }

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});
  // Gives this structure after reduce 👇
  // {
  //  "defaultStats": {
  //       "pending": 24,
  //       "declined": 12
  //       "interview": 12,
  //   },
  // }

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: {
            $year: '$createdAt',
          },
          month: {
            $month: '$createdAt',
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 },
  ]);

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { showStats };
```

---

</details>

<details>
  <summary>Refactor aggregated data for charts and implement moment</summary><br>

[https://momentjs.com/](https://momentjs.com/)

```
npm install moment
```

###### Root/controllers/jobsController.js

```js
// some imports
import moment from 'moment';

// some code ...

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: {
            $year: '$createdAt',
          },
          month: {
            $month: '$createdAt',
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 },
  ]);

  // Refactor  👇
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      // accepts 0-11
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y');
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
```

---

</details>

## Monthly Application with charts - frontend

<details>
  <summary>Display bar chart with package recharts and new components</summary><br>

![image](/images/readme/barChart.png)

[Recharts](https://recharts.org)

```
npm install recharts
```

New component AreaChart

###### Root/client/src/components/AreaChart.js

```js
const AreaChart = () => {
  return <div>AreaChart</div>;
};
export default AreaChart;
```

New component BarChart

###### Root/client/src/components/BarChart.js

```js
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const BarChartComponent = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 50,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#2cb1bc" barSize={75} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
```

Update component ChartsContainer

###### Root/client/src/components/ChartsContainer.js

```js
import React, { useState } from 'react';

import BarChart from './BarChart';
import AreaChart from './AreaChart';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/ChartsContainer';

export default function ChartsContainer() {
  const [barChart, setBarChart] = useState(true);
  const { monthlyApplications: data } = useAppContext();

  return (
    <Wrapper>
      <h4>Monthly Applications</h4>

      <button type="button" onClick={() => setBarChart(!barChart)}>
        {barChart ? 'AreaChart' : 'BarChart'}
      </button>
      {barChart ? <BarChart data={data} /> : <AreaChart data={data} />}
    </Wrapper>
  );
}
```

---

</details>

<details>
  <summary>Display Area chart</summary><br>

Update AreaChart.
⚠️ Make sure that your component does not have the same name as the imports from recharts

###### Root/client/src/components/AreaChart.js

```js
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const AreaChartComponent = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{
          top: 50,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Area type="monotone" dataKey="count" stroke="#2cb1bc" fill="#bef8fd" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;
```

---

</details>

## Filter and sort - server

<details>
  <summary>Query params - status</summary><br>

Make changes in the function getAllJobs

###### Root/controllers/jobsController.js

```js
const getAllJobs = async (req, res) => {
  const { status, jobType, sort, search } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (status !== 'all') {
    queryObject.status = status;
  }

  // NO await
  let result = Job.find(queryObject);
  // Chain sort condition
  const jobs = await result;

  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numOfPages: 1 });
};
```

---

</details>

<details>
  <summary>Query params - jobType</summary><br>

`{{URL}}/jobs?status=interview&jobType=full-time` results in jobs with status interview and jobType is full-time will be sent
![image](/images/readme/postman-flter-server.png)
Make changes in the func getAllJobs

###### Root/controllers/jobsController.js

```js
const getAllJobs = async (req, res) => {
  const { status, jobType, sort, search } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (status !== 'all') {
    queryObject.status = status;
  }

  // add this  if check 👇
  if (jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  // NO await
  let result = Job.find(queryObject);
  // Chain sort condition
  const jobs = await result;

  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numOfPages: 1 });
};
```

---

</details>
<details>
  <summary>Query params - search</summary><br>

Make changes in the func getAllJobs

###### Root/controllers/jobsController.js

```js
const getAllJobs = async (req, res) => {
  const { status, jobType, sort, search } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (status !== 'all') {
    queryObject.status = status;
  }

  if (jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  // add this  if check 👇
  if (search) {
    queryObject.position = { $regex: search, $options: 'i' };
  }

  // NO await
  let result = Job.find(queryObject);
  // Chain sort condition
  const jobs = await result;

  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numOfPages: 1 });
};
```

---

</details>
<details>
  <summary>Query params - sort</summary><br>

`{{URL}}/jobs?status=all&jobType=all&sort=latest`

Make changes in the func getAllJobs

###### Root/controllers/jobsController.js

```js
const getAllJobs = async (req, res) => {
  const { status, jobType, sort, search } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (status !== 'all') {
    queryObject.status = status;
  }

  if (jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  if (search) {
    queryObject.position = { $regex: search, $options: 'i' };
  }

  // add these  if checks 👇
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }
  if (sort === 'a-z') {
    result = result.sort('position');
  }
  if (sort === 'z-a') {
    result = result.sort('-position');
  }

  // NO await
  let result = Job.find(queryObject);
  // Chain sort condition
  const jobs = await result;

  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numOfPages: 1 });
};
```

---

</details>

## Filter and sort - Frontend

<details>
  <summary>Search setup</summary><br>

![image](/images/readme/search-form.png)

Update global state from all inputs

###### Root/client/src/components/SearchContainer.js

```js
import { FormRow, FormRowSelect } from '.';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/SearchContainer';

const SearchContainer = () => {
  const {
    isLoading,
    search,
    searchStatus,
    searchType,
    sort,
    sortOptions,
    statusOptions,
    jobTypeOptions,
    handleChange,
    clearFilters,
  } = useAppContext();

  const handleSearch = (e) => {
    if (isLoading) return;
    handleChange({ name: e.target.name, value: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    clearFilters();
  };

  return (
    <Wrapper>
      <h4>search form</h4>
      <div className="form-center">
        <FormRow
          type="text"
          name="search"
          value={search}
          onChange={handleSearch}
        />
        {/* search by status */}
        <FormRowSelect
          labelText="job status"
          name="searchStatus"
          value={searchStatus}
          handleChange={handleSearch}
          list={['all', ...statusOptions]}
        />
        {/* search by type */}

        <FormRowSelect
          labelText="job type"
          name="searchType"
          value={searchType}
          handleChange={handleSearch}
          list={['all', ...jobTypeOptions]}
        />
        {/* sort */}

        <FormRowSelect
          name="sort"
          value={sort}
          handleChange={handleSearch}
          list={sortOptions}
        />
        <button
          className="btn btn-block btn-danger"
          disabled={isLoading}
          onClick={handleSubmit}
        >
          clear filters
        </button>
      </div>
    </Wrapper>
  );
};
export default SearchContainer;
```

Add to `initialState`

###### Root/client/src/context/appContext.js

```js
search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
```

Create clearFilters func and export

###### Root/client/src/context/appContext.js

```js
const clearFilters = () => {
  console.log('CLEAR FILTERS FUNC');
};
```

```js
  value={{ clearFilters }}
```

---

</details>

<details>
  <summary>Complete clearFilters func with new action-</summary><br>

Create CLEAR_FILTERS action

###### Root/client/src/context/actions.js

```js
export const CLEAR_FILTERS = 'CLEAR_FILTERS';
```

import CLEAR_FILTERS in appContext

###### Root/client/src/context/appContext.js

```js
import { CLEAR_FILTERS } from './actions';
```

import CLEAR_FILTERS in reducer

###### Root/client/src/context/reducer.js

```js
import { CLEAR_FILTERS } from './actions';
```

return default values

```js
if (action.type === CLEAR_FILTERS) {
  return {
    ...state,
    search: '',
    searchStatus: 'all',
    searchType: 'all',
    sort: 'latest',
  };
}
```

---

</details>

<details>
  <summary>Get jobs request</summary><br>
Set up query to send server when changes are made in the form. Trigger function when changes are made in the global state

###### Root/client/src/context/appContext.js

```js
const getJobs = async () => {
  const { search, searchStatus, searchType, sort } = state; // <--

  //update and new url and search 👇
  let url = `/jobs?status=${searchStatus}&jobType=${searchType}&sort=${sort}`;
  if (search) {
    url = url + `&search=${search}`;
  }

  dispatch({ type: GET_JOBS_BEGIN });
  try {
    const { data } = await authFetch.get(url);
    const { jobs, totalJobs, numOfPages } = data;
    dispatch({
      type: GET_JOBS_SUCCESS,
      payload: {
        jobs,
        totalJobs,
        numOfPages,
      },
    });
  } catch (error) {
    console.log(error.response);
    // Toggle logout() for testing
    // logoutUser();
  }
  clearAlert();
};
```

Add import from `search, searchStatus, searchType, sort` useAppContext and add them as dependency in the useEffect to trigger on change.

###### Root/client/src/components/JobsContainer.js

```js
const {
  getJobs,
  jobs,
  isLoading,
  page,
  totalJobs,
  search,
  searchStatus,
  searchType,
  sort,
} = useAppContext();
useEffect(() => {
  getJobs();
}, [search, searchStatus, searchType, sort]);
```

---

</details>

## Pagination - server

<details>
  <summary>Setup pagination for jobs</summary><br>

Update function getAllJObs

###### Root/controllers/jobsController.js

```js
const getAllJobs = async (req, res) => {
  const { status, jobType, sort, search } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (status && status !== 'all') {
    queryObject.status = status;
  }
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: 'i' };
  }

  // NO await
  let result = Job.find(queryObject);

  // Chain sort condition
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }
  if (sort === 'a-z') {
    result = result.sort('position');
  }
  if (sort === 'z-a') {
    result = result.sort('-position');
  }

  // Pagination 👇
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit; //10
  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};
```

---

</details>

<details>
  <summary>Display number of pages and jobs </summary><br>

MAke changes in the getAllJobs func

###### Root/controllers/jobsController.js

```js
const getAllJobs = async (req, res) => {
  const { status, jobType, sort, search } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (status && status !== 'all') {
    queryObject.status = status;
  }
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: 'i' };
  }

  // NO await
  let result = Job.find(queryObject);

  // Chain sort condition
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }
  if (sort === 'a-z') {
    result = result.sort('position');
  }
  if (sort === 'z-a') {
    result = result.sort('-position');
  }
  // Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit; //10
  result = result.skip(skip).limit(limit);

  const jobs = await result;
  // Add totalJobs, numOfPages and change return value in .json({})
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};
```

---

</details>

## Pagination - Frontend

<details>
  <summary>Display pagination btn</summary><br>

New component PageBtnContainer

###### Root/client/src/components/PageBtnContainer.js

```js
const PageBtnContainer = () => {
  return <div>PageBtnContainer</div>;
};
export default PageBtnContainer;
```

Import JobsContainer, numOfPages and render btn only if numbOfPage is more then 1

###### Root/client/src/components/JobsContainer.js

```js
import PageBtnContainer from './PageBtnContainer';

const { numOfPages } = useAppContext();

return (
  <Wrapper>
    <h5>
      {totalJobs} job{jobs.length > 1 && 's'} found
    </h5>
    <div className="jobs">
      {jobs.map((job) => {
        return <Job key={job._id} {...job} />;
      })}
    </div>
    {numOfPages > 1 && <PageBtnContainer />}
  </Wrapper>
);
```

---

</details>

<details>
  <summary>Add some styling and func to PageBtnContainer</summary><br>
  
![image](/images/readme/pageBtnContainer.png)
###### Root/client/src/components/PageBtnContainer.js

```js
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/PageBtnContainer';

const PageBtnContainer = () => {
  const { numOfPages, page } = useAppContext();

  const prevPage = () => {
    console.log('PrevPage');
  };

  const nextPage = () => {
    console.log('nextPage');
  };
  return (
    <Wrapper>
      <button className="prev-btn" onClick={prevPage}>
        <HiChevronDoubleLeft />
        prev
      </button>

      <div className="btn-container">buttons</div>

      <button className="next-btn" onClick={nextPage}>
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
};
export default PageBtnContainer;
```

---

</details>

<details>
  <summary>Render button with page number (without state change)</summary><br>

![image](/images/readme/paginationPageBtns.png)

###### Root/client/src/components/PageBtnContainer.js

```js
const pages = Array.from({ length: numOfPages }, (_, index) => {
  return index + 1;
});

return (
  <div className="btn-container">
    {pages.map((pageNumber) => {
      return (
        <button
          key={pageNumber}
          type="button"
          className={pageNumber === page ? 'pageBtn active' : 'pageBtn'}
          onClick={() => console.log(page)}
        >
          {pageNumber}
        </button>
      );
    })}
  </div>
);
```

---

</details>

<details>
  <summary>Render button with page number (state change with new action, works with search functionality)</summary><br>

![image](/images/readme/paginationbtnStateChange.png)

Create action CHANGE_PAGE

###### Root/client/src/context/actions.js

```js
export const CHANGE_PAGE = 'CHANGE_PAGE';
```

Import CHANGE_PAGE, create function changePage, make changePage accessible through the application

###### Root/client/src/context/appContext.js

```js
import { CHANGE_PAGE } from './actions';

const changePage = (page) => {
  dispatch({ type: CHANGE_PAGE, payload: { page } });
};

return (
  <AppContext.Provider
    value={{
      changePage,
    }}
  >
    {children}
  </AppContext.Provider>
);
```

---

</details>

<details>
  <summary>Change page/state with next and prev button</summary><br>
  
Add functionality to nextPage and prevPage
###### Root/client/src/components/PageBtnContainer.js

```js
const nextPage = () => {
  let newPage = page + 1;
  if (newPage > numOfPages) {
    newPage = 1;
  }
  changePage(newPage);
};

const prevPage = () => {
  let newPage = page - 1;
  if (newPage < 1) {
    newPage = numOfPages;
  }
  changePage(newPage);
};
```

---

</details>

<details>
  <summary>Trig getJobs on page change </summary><br>

We always want to be on first page when get all jobs

###### Root/client/src/context/reducer.js

```js
if (action.type === HANDLE_CHANGE) {
  return {
    ...state,
    page: 1, // <--
    [action.payload.name]: action.payload.value,
  };
}
```

In func all jobs. destruct `page` from state, add `page=${page}` to query

###### Root/client/src/context/appContext.js

```js
const getJobs = async () => {
  const { page, search, searchStatus, searchType, sort } = state;

  let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;
};
```

Add page to other dependencies on useEffect to trigger render on page state change

###### Root/client/src/components/JobsContainer.js

```js
useEffect(() => {
  getJobs();
}, [page, search, searchStatus, searchType, sort]);
```

---

</details>

## Build frontend for deployment

<details>
  <summary>Prepare frontend for deployment</summary><br>
  [name](link)

1. Add `build-client` for frontend in the package.json that is for the server

###### Root/package.json 👈

```js
"scripts": {
    "build-client": "cd client && npm run build", // <--
    "server": "nodemon server --ignore client",
    "client": "npm start --prefix client",
    "start": "concurrently --kill-others-on-fail \"npm run server\" \" npm run client\""
  },
```

2. Add imports, create variable \_\_dirname, add app.use(express.static...)

###### Root/server.js

```js
import { dirname } from 'path'; // <--
import { fileURLToPath } from 'url'; // <--
import path from 'path'; // <--

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// only when ready to deploy
const __dirname = dirname(fileURLToPath(import.meta.url)); // <--
app.use(express.static(path.resolve(__dirname, './client/build'))); // <--

// express.json() make json data available for us in controllers
app.use(express.json());
```

Run the new build command

```
npm run build-client
```

run application on port 5000

```
node server
```

---

</details>

## Security packages

<details>
  <summary>Install and import security packages</summary><br>

- [helmet](https://www.npmjs.com/package/helmet)
  Helmet helps you secure your Express apps by setting various HTTP headers.
- [xss-clean](https://www.npmjs.com/package/xss-clean)
  Node.js Connect middleware to sanitize user input coming from POST body, GET queries, and url params.
- [express-mongo-sanitize](https://www.npmjs.com/package/express-mongo-sanitize)
  Sanitizes user-supplied data to prevent MongoDB Operator Injection.
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
  Basic rate-limiting middleware for Express.

From ROOT...

```
npm install helmet xss-clean express-mongo-sanitize express-rate-limit
```

###### Root/server.js

```js
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';

app.use(express.json());
// after this  👆
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
```

---

</details>

<details>
  <summary>Request Limit</summary><br>
  
Setup request limit for route `register` and `login`

###### Root/routes/authRouter.js

```js
import rateLimiter from 'express-rate-limit';

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

router.route('/register').post(apiLimiter, register);
router.route('/login').post(apiLimiter, login);
```

---

</details>

## Use debounce for search

<details>
  <summary>Setup own debounce for search field</summary><br>

###### Root/client/src/components/SearchContainer.js

```js
import { FormRow, FormRowSelect } from '.';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/SearchContainer';
import { useState, useMemo } from 'react'; // <--

const SearchContainer = () => {
  const [localSearch, setLocalSearch] = useState(''); // <--
  const {
    isLoading,
    search,
    searchStatus,
    searchType,
    sort,
    sortOptions,
    statusOptions,
    jobTypeOptions,
    handleChange,
    clearFilters,
  } = useAppContext();

  // debounce function
  const debounce = () => {
    let timeoutID;
    return (e) => {
      setLocalSearch(e.target.value);
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        handleChange({ name: e.target.name, value: e.target.value });
      }, 500);
    };
  };

  const optimizedDebounce = useMemo(() => debounce(), []); // <--

  const handleSearch = (e) => {
    handleChange({ name: e.target.name, value: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalSearch(''); // <--
    clearFilters();
  };

  return (
    <Wrapper>
      <h4>search form</h4>
      <div className="form-center">
        <FormRow
          type="text"
          name="search"
          value={localSearch} // <--
          onChange={optimizedDebounce} // <--
        />
        {/*Some other inputs..*/}
      </div>
    </Wrapper>
  );
};
export default SearchContainer;
```

---

</details>

## Login with Test User account

<details>
  <summary>Login with Test User account</summary><br>

![image](/images/readme/demoUserLogin.png)

Create new user, in my case test user. Add new button that onClick trigger existing loginUser function with hard coded values.

###### Root/client/src/pages/Register.js

```js
<button
  type="button"
  className="btn btn-block btn-hipster"
  disabled={isLoading}
  onClick={() => {
    loginUser({ email: 'devtest@devtest.com', password: 'devtest' });
  }}
>
  {isLoading ? 'loading...' : 'demo'}
</button>
```

---

</details>

<details>
  <summary>Make Test User to Read Only</summary><br>

Create middleware testUser.js
Make Test User Read Only for routes

- createJob
- deleteJob
- updateJob
- updateUser

Create middleware testUser

###### Root/middleware/testUser.js

```js
import { BadRequestError } from '../errors/index.js';

const testUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError('Test User, Read Only');
  }
  next();
};

export default testUser;
```

Implement middleware testUser in jobsRouter

###### Root/routes/jobsRouter.js

```js
import testUser from '../middleware/testUser.js';

router.route('/').post(testUser, createJob).get(getAllJobs);
router.route('/:id').delete(testUser, deleteJob).patch(testUser, updateJob);
```

Implement middleware testUser in jobsRouter

###### Root/routes/jobsRouter.js

```js
import testUser from '../middleware/testUser.js';

router.route('/').post(testUser, createJob).get(getAllJobs);
router.route('/:id').delete(testUser, deleteJob).patch(testUser, updateJob);
```

Implement middleware testUser in authRouter

###### Root/routes/authRouter.js

```js
import testUser from '../middleware/testUser.js';

router.route('/updateUser').patch(authenticateUser, testUser, updateUser);
```

Implement check in auth if testUser

###### Root/middleware/auth.js

```js
import jwt from 'jsonwebtoken';
import { UnAuthenticatedError } from '../errors/index.js';

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnAuthenticatedError('Authentication Invalid');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const testUser = payload.userId === '63d79d65d112dff48470c484'; // <--
    req.user = { userId: payload.userId, testUser }; // <--
    next();
  } catch (error) {
    throw new UnAuthenticatedError('Authentication Invalid');
  }
};

export default auth;
```

Make some changes for frontend when Test User tries to delete a job

###### Root/client/src/context/actions.js

```js
export const DELETE_JOB_ERROR = 'DELETE_JOB_ERROR';
```

###### Root/client/src/context/appContext.js

```js
import { DELETE_JOB_ERROR } from './actions';

const deleteJob = async (jobId) => {
  dispatch({ type: DELETE_JOB_BEGIN });

  try {
    await authFetch.delete(`/jobs/${jobId}`);
    getJobs();
  } catch (error) {
    // update catch block
    if (error.response.status === 401) return;
    dispatch({
      type: DELETE_JOB_ERROR,
      payload: { msg: error.response.data.msg },
    });
  }
  clearAlert(); // <--
};
```

###### Root/client/src/context/reducer.js

```js
import { DELETE_JOB_ERROR } from './actions';

if (action.type === DELETE_JOB_ERROR) {
  return {
    ...state,
    isLoading: false,
    showAlert: true,
    alertType: 'danger',
    alertText: action.payload.msg,
  };
}
```

###### Root/client/src/components/JobsContainer.js

```js
import Alert from './Alert';

const { showAlert } = useAppContext();

return (
  <Wrapper>
    {showAlert && <Alert />} {/* <-- */}
    <h5>
      {totalJobs} job{jobs.length > 1 && 's'} found
    </h5>
    <div className="jobs">
      {jobs.map((job) => {
        return <Job key={job._id} {...job} />;
      })}
    </div>
    {numOfPages > 1 && <PageBtnContainer />}
  </Wrapper>
);
```

---

</details>

## Auth with cookies

<details>
  <summary>Setup cookie</summary><br>

###### Root/controllers/authController.js

```js
const token = user.createJWT();
user.password = undefined;
// 👇
const oneDay = 1000 * 60 * 60 * 24;
res.cookie('token', token, {
  httpOnly: true,
  expires: new Date(Date.now() + oneDay),
  secure: process.env.NODE_ENV === 'production',
});
```

---

</details>

<details>
  <summary>Move cookie to own file so we can reuse it.</summary><br>

###### Root/utils/attachCookies.js

```js
const attachCookies = ({ res, token }) => {
  console.log('attachCookies');
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });
};

export default attachCookies;
```

How to import and invoke cookie

###### Root/controllers/authController.js

```js
import attachCookies from '../utils/attachCookies.js';

const register = async (req, res) => {
  // some code...

  const token = user.createJWT();

  attachCookies({ res, token });

  // some code...
};

const login = async (req, res) => {
  // some code...
  const token = user.createJWT();

  attachCookies({ res, token });

  // some code...
};

const updateUser = async (req, res) => {
  // some code...

  const token = user.createJWT();

  attachCookies({ res, token });

  // some code...
};
```

---

</details>

<details>
  <summary>Setup cookie-parser and log cookie in auht</summary><br>

[https://www.npmjs.com/package/cookie-parser](https://www.npmjs.com/package/cookie-parser)- Parse Cookie header and populate req.cookies with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret so it may be used by other middleware.

```
npm install cookie-parser
```

###### Root/server.js

```js
import cookieParser from 'cookie-parser';

app.use(express.json());
// 👇 👆
app.use(cookieParser());
```

###### Root/middleware/auth.js

```js
import cookieParser from 'cookie-parser';

const auth = async (req, res, next) => {
  console.log(req.cookies); // <--
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnAuthenticatedError('Authentication Invalid');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const testUser = payload.userId === '63d79d65d112dff48470c484';
    req.user = { userId: payload.userId, testUser };
    next();
  } catch (error) {
    throw new UnAuthenticatedError('Authentication Invalid');
  }
};
```

---

</details>

<details>
  <summary>Refactor Auth Middleware</summary><br>

Refactor auth

###### Root/middleware/auth.js

```diff
import jwt from 'jsonwebtoken';
import { UnAuthenticatedError } from '../errors/index.js';

const auth = async (req, res, next) => {
-  console.log(req.cookies);
-  const authHeader = req.headers.authorization;
-  if (!authHeader || !authHeader.startsWith('Bearer')) {
-    throw new UnAuthenticatedError('Authentication Invalid');
-  }

-  const token = authHeader.split(' ')[1];

+const token = req.cookies.token;
+ if (!token) {
+   throw new UnAuthenticatedError  ('Authentication Invalid');
+ }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const testUser = payload.userId === '63d79d65d112dff48470c484';
    req.user = { userId: payload.userId, testUser };
    next();
  } catch (error) {
    throw new UnAuthenticatedError('Authentication Invalid');
  }
};

export default auth;
```

Remove token from res

###### Root/controllers/authController.js

```diff
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js';
import attachCookies from '../utils/attachCookies.js';

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
  attachCookies({ res, token });
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
-    token,
    location: user.location,
  });
};

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

  attachCookies({ res, token });

-  res.status(StatusCodes.OK).json({ user, token, location: user.location });
+  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError('Please provide all values');
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  const token = user.createJWT();
  attachCookies({ res, token });
  res.status(StatusCodes.OK).json({
    user,
-    token,
    location: user.location,
  });
};
export { register, login, updateUser };

```

---

</details>

<details>
  <summary>Remove token from state and local storage</summary><br>
  
Remove token from reducer.
###### Root/client/src/context/reducer.js

```diff
if (action.type === REGISTER_USER_SUCCESS) {
    return {
      ...state,
      user: action.payload.user,
-      token: action.payload.token,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'User Created! Redirecting...',
    };
  }

  if (action.type === LOGIN_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      user: action.payload.user,
-      token: action.payload.token,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      showAlert: true,
      alertType: 'success',
      alertText: 'Login Successful! Redirecting...',
    };
  }

   if (action.type === LOGOUT_USER) {
    return {
      ...initialState,
      user: null,
-     token: null,
      userLocation: '',
      jobLocation: '',
    };
  }

   if (action.type === UPDATE_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
-      token: action.payload.token,
      user: action.payload.user,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      showAlert: true,
      alertType: 'success',
      alertText: 'User Profile Updated!',
    };
  }
```

Remove local storage and refactor local state

###### Root/client/src/context/appContext.js

```diff
import { useReducer, useContext, createContext, useEffect } from 'react';
import axios from 'axios';
import reducer from './reducer';
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  DELETE_JOB_ERROR,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
} from './actions';
const AppContext = createContext();

-const token = localStorage.getItem('token');
-const user = localStorage.getItem('user');
-const userLocation = localStorage.getItem('location');

export const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
-  user: user ? JSON.parse(user) : null,
+  user: null,
-  token: token,
-  userLocation: userLocation || '',
+  userLocation: '',
  showSidebar: false,
  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  jobType: 'full-time',
  statusOptions: ['pending', 'interview', 'declined'],
  status: 'pending',
-  jobLocation: userLocation || '',
+  jobLocation: '',
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Axios Instance
  const authFetch = axios.create({
    baseURL: '/api/v1',
  });

  // Request Interceptors
-  authFetch.interceptors.request.use(
-    (config) => {
-      config.headers['Authorization'] = `Bearer ${state.token}`;
-      return config;
-    },
-    (error) => {
-      return Promise.reject(error);
-    }
-  );

  // Response Interceptors
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 1500);
  };

-  const addUserToLocalStorage = ({ user, token, location }) => {
-    localStorage.setItem('user', JSON.stringify(user));
-    localStorage.setItem('token', token);
-    localStorage.setItem('location', location);
-  };

-  const removeUserFromLocalStorage = () => {
-    localStorage.removeItem('user');
-    localStorage.removeItem('token');
-    localStorage.removeItem('location');
-  };

  const registerUser = async (currentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      const response = await axios.post('/api/v1/auth/register', currentUser);
-      const { user, token, location } = response.data;
+      const { user, location } = response.data;
      dispatch({
        type: REGISTER_USER_SUCCESS,
-        payload: { user, token, location },
+        payload: { user, location },
      });
-      addUserToLocalStorage({
-        user,
-        token,
-        location,
-      });
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

  const loginUser = async (currentUser) => {
    dispatch({ type: LOGIN_USER_BEGIN });
    try {
      const { data } = await axios.post('/api/v1/auth/login', currentUser);
-     const { user, token, location } = data;
+      const { user, location } = data;
      dispatch({
        type: LOGIN_USER_SUCCESS,
-        payload: { user, token, location },
+        payload: { user, location },
      });
-      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
-    removeUserFromLocalStorage();
  };

  const updateUser = async (currentUser) => {
    dispatch({
      type: UPDATE_USER_BEGIN,
    });
    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser);
-      const { user, location, token } = data;
+     const { user, location } = data;
      dispatch({
        type: UPDATE_USER_SUCCESS,
-        payload: { user, token, location },
+        payload: { user, location },
      });
-      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };

  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  const clearValues = () => {
    dispatch({
      type: CLEAR_VALUES,
    });
  };

  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.post('/jobs', {
        company,
        position,
        jobLocation,
        jobType,
        status,
      });

      dispatch({
        type: CREATE_JOB_SUCCESS,
      });

      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const getJobs = async () => {
    const { page, search, searchStatus, searchType, sort } = state;

    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;
    if (search) {
      url = url + `&search=${search}`;
    }

    dispatch({ type: GET_JOBS_BEGIN });
    try {
      const { data } = await authFetch.get(url);
      const { jobs, totalJobs, numOfPages } = data;
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      });
    } catch (error) {
      console.log(error.response);
      logoutUser();
    }
    clearAlert();
  };
  useEffect(() => {
    getJobs();
  }, []);

  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  };

  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.patch(`/jobs/${state.editJobId}`, {
        position,
        company,
        jobLocation,
        jobType,
        status,
      });
      dispatch({ type: EDIT_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN });

    try {
      await authFetch.delete(`/jobs/${jobId}`);
      getJobs();
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: DELETE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch.get(`/jobs/stats`);
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: appContext.js:314 ~ showStats ~ error',
        error.response
      );
      logoutUser();
    }
    clearAlert();
  };
  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };

  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        loginUser,
        displayAlert,
        registerUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
        changePage,
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
  <summary> getCurrentUser  - server</summary><br>

Create getCurrentUser in authController

###### Root/controllers/authController.js

```js
const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({
    user,
    location: user.location,
  });
};

export { register, login, updateUser, getCurrentUser };
```

Import getCurrentUser from authRouter

###### Root/routes/authRouter.js

```js
import { getCurrentUser } from '../controllers/authController.js';

router.route('/updateUser').patch(authenticateUser, testUser, updateUser);
// 👇
router.route('/getCurrentUser').get(authenticateUser, getCurrentUser);
```

---

</details>

<details>
  <summary>getCurrentUser - frontend</summary><br>

Add action GET_CURRENT_USER_BEGIN

###### Root/client/src/context/actions.js

```js
export const GET_CURRENT_USER_BEGIN = 'GET_CURRENT_USER_BEGIN';
export const GET_CURRENT_USER_SUCCESS = 'GET_CURRENT_USER_SUCCESS';
```

###### Root/client/src/context/appContext.js

```js
import { GET_CURRENT_USER_BEGIN, GET_CURRENT_USER_SUCCESS } from './actions';

export const initialState = {
  userLoading: true,
};

const getCurrentUser = async () => {
  dispatch({ type: GET_CURRENT_USER_BEGIN });
  try {
    const { data } = await authFetch('/auth/getCurrentUser');
    const { user, location } = data;

    dispatch({ type: GET_CURRENT_USER_SUCCESS, payload: { user, location } });
  } catch (error) {
    if (error.response.status === 401) return;
    logoutUser();
  }
};
useEffect(() => {
  getCurrentUser();
}, []);
```

###### Root/client/src/context/reducer.js

```diff
import {
+  GET_CURRENT_USER_BEGIN,
+  GET_CURRENT_USER_SUCCESS,
} from './actions';

  if (action.type === LOGOUT_USER) {
    return {
      ...initialState,
-     user: null,
-      userLocation: '',
-      jobLocation: '',
+      userLoading: false
    };
  }
// add  👇
    if (action.type === GET_CURRENT_USER_BEGIN) {
    return { ...state, userLoading: true, showAlert: false };
  }

  if (action.type === GET_CURRENT_USER_SUCCESS) {
    return {
      ...state,
      userLoading: false,
      user: action.payload.user,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
    };
  }
// add   👆

```

###### Root/client/src/pages/ProtectedRoute.js

```js
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import Loading from '../components/Loading'; // <--

const ProtectedRoute = ({ children }) => {
  const { user, userLoading } = useAppContext();
  if (userLoading) return <Loading />; // <--

  if (!user) {
    return <Navigate to="landing" />;
  }
  return children;
};
export default ProtectedRoute;
```

---

</details>

## Minor Landing Page fix

<details>
  <summary>Small navigation fix if user exist </summary><br>

Update Landing imports and return

###### Root/client/src/pages/Landing.js

```js
import { Navigate } from 'react-router-dom';
{
  /* < -- */
}
import { useAppContext } from '../context/appContext';
{
  /* < -- */
}

const Landing = () => {
  const { user } = useAppContext();
  {
    /* < -- */
  }

  return (
    <React.Fragment>
      {' '}
      {/* < -- */}
      {user && <Navigate to="/" />} {/* < -- */}
      <Wrapper>
        <nav>
          <Logo />
        </nav>
        <div className="container page">
          <div className="info">
            <h1>
              job<span> tracking </span>app
            </h1>
            <p>
              I'm baby live-edge woke you probably haven't heard of them,
              tousled kinfolk schlitz enamel pin. Letterpress gluten-free sus
              ugh. Adaptogen sus beard pug readymade vaporware subway tile
              whatever taxidermy plaid cray literally artisan next level.
            </p>
            <Link to="/register" className="btn btn-hero">
              Login/register
            </Link>
          </div>
          <img src={main} alt="job hunt" className="img main-img" />
        </div>
      </Wrapper>
    </React.Fragment>
  );
};

export default Landing;
```

---

</details>

## Remove cookie when user logout

<details>
  <summary>Create route - server</summary><br>

Remove cookie

###### Root/controllers/authController.js

```js
const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

export { logout };
```

###### Root/routes/authRouter.js

```js
import {
  // some imports....
  logout,
} from '../controllers/authController.js';

router.route('/logout').get(logout);
```

---

</details>

<details>
  <summary>implement logout functionality - frontend </summary><br>

###### Root/client/src/context/appContext.js

```js
const logoutUser = async () => {
  await authFetch.get('/auth/logout'); // <--
  dispatch({ type: LOGOUT_USER });
};
```

---

</details>

## Prep for deployment

<details>
  <summary>Delete folders and add/run script</summary><br>

Delete folders from client

- build
- node_modules

Delete folders from server

- node_modules

Make sure that you have build folder, node_modules in gitignore files.

Add script in package.json - on the server

###### Root/package.json

```js
"scripts":{
  "setup-production":"npm run install-client && npm run build-client && npm install",
  "install-client":"cd client && npm install",
}
```

run script

```
npm run setup-production
```

run script

```
node server
```

Go to [http://localhost:5000/](http://localhost:5000/)

---

</details>

## What I use to deploy application

<details>
  <summary>Details</summary><br>

[https://render.com/](https://render.com/) (free tier) - Render is a unified cloud to build and run all your apps and websites with free TLS certificates, a global CDN, DDoS protection, private networks, and auto deploys from Git.Render is a unified cloud to build and run all your apps and websites with free TLS certificates, a global CDN, DDoS protection, private networks, and auto deploys from Git.

[https://github.com/](https://github.com/) - Let’s build from here. Harnessed for productivity. Designed for collaboration. Celebrated for built-in security. Welcome to the platform developers love.

</details>

## Steps in Render

<details>
  <summary>How to deploy steps on Render</summary><br>

![image](/images/readme/Screenshot%202023-02-02%20at%2013.27.43.png)
![image](/images/readme/Screenshot%202023-02-02%20at%2013.28.21.png)
![image](/images/readme/Screenshot%202023-02-02%20at%2013.29.14.png)
![image](/images/readme/Screenshot%202023-02-02%20at%2013.31.30.png)
![image](/images/readme/Screenshot%202023-02-02%20at%2013.34.20.png)
![image](/images/readme/Screenshot%202023-02-02%20at%2013.48.07.png)
![image](/images/readme/Screenshot%202023-02-02%20at%2013.50.28.png)

###### Root/

```js

```

---

</details>

## How to deploy changes to Render

<details>
  <summary>Steps to deploy changes</summary><br>

1. Push new changes to github
2. Delete both node_modules and build folders
3. Run script in terminal: npm run setup-production
4. Chose a deploy option
   ![image](/images/readme/Screenshot%202023-02-02%20at%2014.36.01.png)

###### Root/

```js

```

---

</details>

## Arbetsformedlingen, to do

[X] - Add jobs to context<p>
[X] - Display jobs <p>
[X] - Structure data in controller that will be sent to frontend <p>
[X] - Pass params to search Arbetsförmedlingen jobs <p>


---

</details>

<br>
<br>
<br>
<br>
⚠️ fix warning in console this https://stackoverflow.com/questions/70469717/cant-load-a-react-app-after-starting-server ⚠️
