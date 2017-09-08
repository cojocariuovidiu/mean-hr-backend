process.env.NODE_ENV = 'test';
require('dotenv').config();

require('chai').should();
const app     = require('../../app');
const request = require('supertest');
const User    = require('../../models/user');

describe('Controller: Users', () => {
  let admin, hr, manager, staff;

  before((done) => {
    admin = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: '12345',
      role: 'admin',
      avatar: ''
    });

    hr = new User({
      username: 'hr',
      email: 'hr@example.com',
      password: '12345',
      role: 'hr',
      avatar: ''
    });

    manager = new User({
      username: 'manager',
      email: 'manager@example.com',
      password: '12345',
      role: 'manager',
      avatar: ''
    });

    staff = new User({
      username: 'staff',
      email: 'staff@example.com',
      password: '12345',
      role: 'staff',
      avatar: ''
    });

    User.insertMany([admin, hr, manager, staff], (err, users) => {
      if (err) return done(err);
      admin._id = users[0]._id;
      hr._id = users[1]._id;
      manager._id = users[2]._id;
      staff._id = users[3]._id;
      done();
    });
  });

  after((done) => {
    User.remove({}, (err) => {
      if (err) return done(err);
      done();
    });
  });

  it('GET /api/users should return an array of users', (done) => {
    request(app)
      .get('/api/users')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .expect((res) => {
        res.body.length.should.equal(4);
        res.body[0]._id.should.equal(admin._id.toString());
        res.body[1].username.should.equal(hr.username);
        res.body[2].email.should.equal(manager.email);
        res.body[3].password.should.equal('12345');
        res.body[3].role.should.equal(staff.role);
      })
      .end(done);
  });

  it('GET /api/users/:id should return a specific user', (done) => {
    request(app)
      .get(`/api/users/${admin._id}`)
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .expect((res) => {
        res.body._id.should.equal(admin._id.toString());
        res.body.username.should.equal(admin.username);
        res.body.email.should.equal(admin.email);
        res.body.password.should.equal(admin.password);
        res.body.role.should.equal(admin.role);
      })
      .end(done);
  });

  it('GET /api/users/:id with invalid id should return error', (done) => {
    request(app)
      .get('/api/users/12345')
      .expect('Content-Type', /application\/json/)
      .expect(400)
      .expect((res) => {
        res.body.message.should.contain('Invalid user ID.');
      })
      .end(done);
  });

  it('GET /api/users/:id for non-existing user should return error',
    (done) => {
      request(app)
        .get('/api/users/59b28e08f3bd00a8ce1efe3c')
        .expect('Content-Type', /application\/json/)
        .expect(404)
        .expect((res) => {
          res.body.message.should.contain('User not found.');
        })
        .end(done);
    }
  );
});
