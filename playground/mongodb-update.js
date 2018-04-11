//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to mongodb server');
  }
  console.log('Connected to mongodb server');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5acd6699ca0daa8fd5e9e0ec')
  // }, {
  //   $set:{
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result)=>{
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5acd5a8885e2aa07522c4a09')
  }, {
    $set:{
      name: 'Betzaida Hernandez'
    },
    $inc: {
      age: 28
    }
  }, {
    returnOriginal: false
  }).then((result)=>{
    console.log(result);
  });

  //db.close();
});
