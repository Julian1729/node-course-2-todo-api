var mongoose = require('mongoose');

// setup to use promises
mongoose.Promise = global.Promise;

//check if we are in Heroku Enviornment
// if(process.env.PORT){
//   console.log('Inside Heroku');
//   // http://mlab.com password
//   var username = 'theapp';
//   var password = 'j1102hJBJ';
//
//   var uri = `mongodb://${username}:${password}@ds149373.mlab.com:49373/todoappnodecourse`;
//   mongoose.connect(uri);
// }else{
//   // we are inside localhost
//   console.log('In Local Mode');
//   mongoose.connect('mongodb://localhost:27017/TodoApp');
// }

mongoose.connect(process.env.MLAB_URI);

// Production Database URI
// mongodb://julian1729:j1102hJBJ@ds149373.mlab.com:49373/todoappnodecourse





module.exports = {
  mongoose
};
