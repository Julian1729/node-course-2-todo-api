const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// delete multiple records "Todo.remove()"
// works much like Todo.find(), removes all docs that match query
// Todo.remove({}) deleted all records
Todo.remove({}).then((res)=>{
  console.log(res);
});
