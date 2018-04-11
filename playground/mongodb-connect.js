//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to mongodb server');
  }
  console.log('Connected to mongodb server');

  // db.collection('Todos').insertOne({
  //   text : 'this new one',
  //   completed: false
  // }, (err, result) => {
  //   if(err){
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, null, 2));
  // });

  db.collection('Users').insertOne({
    name : 'Julian Hernandez',
    age : 19,
    location : 'Philadelphia, PA'
  }, (err, result) => {
    if(err){
      return console.log(err);
    }
    console.log(result.ops[0]._id.getTimestamp());
  });

  db.close();
});
