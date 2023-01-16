import { UnAuthenticatedError } from '../errors/index.js'; // <--

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // <-- if check
    throw new UnAuthenticatedError('Authentication Invalid');
  }
  next();
};

export default auth;
