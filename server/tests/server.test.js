const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

// beforeEach runs code before every single test case, only moves on once we call noe
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {

  it('should create a new todo', (done) => {
    var text = 'Test todo text';
    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((response)=>{
      expect(response.body.text).toBe(text);
    })
    .end((err, res)=>{
      if(err){
        return done(err);
      }
      // verify that it was put into the database
      Todo.find({text}).then((todos)=>{
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e)=>done(e));
    })
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send()
      .expect(400)
      .end((err, res)=>{
        if(err){
          return done(err);
        }
        Todo.find().then((todos)=>{
          expect(todos.length).toBe(2);
          done();
        }).catch((e)=>done(e));
      });
  });

});

describe('GET /todos', () => {

  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect( (res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });

});

describe('GET /todos:id', () => {

  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectId().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non object id', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });

});

describe('DELETE /todos/:id', () => {

  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, response) => {
        if(err){
          return done();
        }
        // query db to make sure todo doesnt exist
        Todo.findById(hexId).then((todo) =>{
          expect(todo).toNotExist();
          done();
        }).catch(done);
      });
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectId().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });

});

describe('PATCH /todos/:id', ()=>{


  it('should update our todo', (done)=>{
    // grab id of first item
    var id = todos[0]._id.toHexString();
    var newObj = {
      text: "this the new text bruh",
      completed: true
    };
    // make patch request
    request(app)
      .patch('/todos/' + id)
      // update the text, set completed = true
      .send(newObj)
      // assert that we get 200
      .expect(200)
      // assert tht text is changed, competed is true, and completedAt is a number
      .expect((res)=>{
        expect(res.body.todo).toInclude(newObj);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done)=>{
    // grab id of second item
    var id = todos[0]._id.toHexString();
    // update text, set completed to false
    var text = "this is anotha one";
    var compeleted = false;
    request(app)
      .patch('/todos/' + id)
      .send({
        text,
        compeleted
      })
    // 200
      .expect(200)
    // text is changed, completed false, completedAt is null (.toNotExist)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.compeleted).toBeFalsy();
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });

});

describe('GET /users/me', () => {

  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('X-Auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return a 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });

  describe('POST /users', () => {
    it('should create a user', (done) => {
      var email = '123@123.com';
      var password = '123mnb!';

      request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toExist();
          expect(res.body._id).toExist();
          expect(res.body.email).toBe(email);
        })
        .end((err) => {
          if(err){
            return done(err);
          }
          User.findOne({email}).then((user) => {
            expect(user).toExist();
            expect(user.password).toNotBe(password);
            done();
          });
        });
    });

    it('should return validation errors if request invalid', (done) => {
      var email = 'invalidemail';
      request(app)
        .post('/users')
        .send({email})
        .expect(400)
        .end(done);
    });

    it('should not create user if email already in use', (done) => {
      request(app)
        .post('/users')
        .send({
          email: users[0].email,
          password: 'thisispassword'
        })
        .expect(400)
        .end(done);
    });

  });

});

describe('POST /users/login', () => {

  it('should login user and return auth token', (done) => {

      request(app)
        .post('/users/login')
        .send({
          email: users[1].email,
          password: users[1].password
        })
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toExist();
        })
        .end((err, res) => {
          if(err){
            return done(err);
          }
          User.findById(users[1]._id).then((user) => {
            expect(user.tokens[0]).toInclude({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          }).catch((e) => done(e));
        });

  });

  it('should reject invalid login', (done) => {

    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + 'messsup'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });

  });

});
