// if we are on production this will be set, if not we set it to development
var env = process.env.NODE_ENV || 'development';

switch (env) {
  case 'development':
    process.env.PORT = 3000;
    // Set Local DB URI
    process.env.MLAB_URI = 'mongodb://localhost:27017/TodoApp';
    break;
  case 'test':
    process.env.PORT = 3000;
    // set Test Database URI
    process.env.MLAB_URI = 'mongodb://localhost:27017/TodoAppTest';
    break;
}

console.log('Enviornment: ', env);
