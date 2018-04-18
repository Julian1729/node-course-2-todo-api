require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  console.log(req);
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc)=>{
    res.send(doc)
  }, (e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  // get all of the todos
  Todo.find().then((todos)=>{
    res.send({todos});
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) =>{
  var id = req.params.id;
  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }
  Todo.findById(id).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => res.status(400).send())
});

app.delete('/todos/:id', (req, res) => {
  // get the id
  var id = req.params.id;
  // validate the id -> not valid return 404
  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }
  // remove todo by id
  Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e)=>res.status(400).send(e));
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  // specify which keys are updatable
  var body = _.pick(req.body, ['text', 'completed']);
  // check that id is valid
  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }
  // check if completed is boolean and is on body
  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else {
    body.completed = false;
    body.completedAt = null;
  }

  // update db
  Todo.findByIdAndUpdate(id, {
    $set: body
  },
  {
    new: true
  }).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch(()=>{
    res.status(400).send();
  });

});

// POST /users
app.post('/users', (req, res) => {
  var newUser = new User(_.pick(req.body, ['email', 'password']));
  newUser.save().then(() => {
    return newUser.generateAuthToken();
  }).then((token)=>{
    res.header('X-Auth', token).send(newUser);
  }).catch((e) => {
    res.status(400).send();
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user)=>{
    return user.generateAuthToken().then((token) => {
      res.header('X-Auth', token).send(user);
    });
  }).catch((e)=>{
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log('Started on port ' + port);
});

module.exports = {
  app
};
