var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  text: {
    // configure what "text" is
    type: String,
    // required
    required: true,
    // minimum length
    minlength: 1,
    // trim whitespace
    trim: true,
  },
  completed: {
    type: Boolean,
    // set default value
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    require: true,
    type: mongoose.Schema.Types.ObjectId
  }
});

module.exports = {Todo};
