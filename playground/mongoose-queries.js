const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

const {User} = require('./../server/models/user');

// var id = '5acf74f87229c0d114ce18da';
//
// if ( !ObjectId.isValid(id) ){
//   console.log('ID not valid');
// }

// // find all that match the query
// Todo.find({
//   _id: id
// }).then((todos)=>{
//   console.log('Todos', todos);
// });
//
// // simply grabs the first one that matches the query
// Todo.findOne({
//   _id: id
// }).then((todo)=>{
//   console.log('Todo', todo);
// });


// find by id
// Todo.findById(id).then((todo)=>{
//   if(!todo){
//     return console.log('id not found');
//   }
//   console.log('Todo By Id', todo);
// }).catch((e) => console.log(e));

// query users collection
User.findById('5ace4e14b30e27c90c49e041').then((user)=>{
  if(!user){
    return console.log('user not found');
  }
  console.log('user', user);
}).catch((e)=>console.log(e))
