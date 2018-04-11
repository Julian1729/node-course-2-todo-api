//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to mongodb server');
  }
  console.log('Connected to mongodb server');

  // deleteMany
  // db.collection('Users').deleteMany({text: "eat lunch"}).then((result)=>{
  //   console.log(result);
  // });

  // deleteOne
  // db.collection('Todos').deleteOne({text:'eat lunch'}).then((result)=>{
  //    console.log(result);
  // });

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((doc)=>{
  //   console.log(doc);
  // });


  //db.close();
});
