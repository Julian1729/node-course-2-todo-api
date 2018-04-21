const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

// dummy users
const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const users = [
  {
    _id: userOneId,
    email: 'andrew@example.com',
    password: 'userOnePass',
    tokens:[
      {
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: 'hernandez.julian17@gmail.com',
    password: 'userTwoPass',
    tokens:[
      {
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
      }
    ]
  }
];

// dummy todos
const todos = [
  {
    _id: new ObjectId(),
    text: 'First test todo',
    _creator: userOneId
  },
  {
    _id: new ObjectId(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
  }
];

const populateTodos = (done)=>{
  // empty databse before every request, and enter dummy todos
  Todo.remove({}).then(()=> {
    return Todo.insertMany(todos);
  }).then( () => done() );

};

const populateUsers = (done) => {

  User.remove({}).then(()=>{
    // create users
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    // this takes multiple promises
    return Promise.all([userOne, userTwo]).then(()=>done());
  });

};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};
