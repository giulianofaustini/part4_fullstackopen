
const User = require('../models/user')
const logger = require('./logger')
const jwt = require('jsonwebtoken');



const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Token: ', request.token)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  }
  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  } else {
    request.token = null;
  }
  next(); 
};


const userExtractor = async (request, response, next) => {
  const token = request.token;
  console.log('i am the token in the backend middelware' , token)

  if (!token) {
    console.log('If I send a delete request from the frontend, No token found');
    return next();
  }
  try {

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken.id) {
      console.log('Token is missing user information');
      return response.status(401).json({ error: 'Token is missing user information' });
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
      console.log('User not found');
      return response.status(401).json({ error: 'User not found' });
    }

    request.user = user;
    console.log('User extracted:', request.user);
    next();
  } catch (error) {
    next(error);
  }
};

 
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
