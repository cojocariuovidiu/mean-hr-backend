process.env.NODE_ENV = 'test';
require('dotenv').config();

require('chai').should();
const User = require('../../models/user');

describe('Model: User', () => {
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

  it('should return the correct count of users in the database', (done) => {
    User.count((err, count) => {
      if (err) done(err);

      count.should.equal(4);
      done();
    });
  });

  it('should validate that username is required', (done) => {
    let user = new User({
      username: '',
      email: 'x@example.com',
      password: '12345'
    });

    user.save(user, (err) => {
      err.errors.username.message.should
        .contain('Username is required.');
      done();
    });
  });

  it('should validate that username must not be empty spaces', (done) => {
    let user = new User({
      username: '     ',
      email: 'x@example.com',
      password: '12345'
    });

    user.save(user, (err) => {
      err.errors.username.message.should
        .contain('Username is required.');
      done();
    });
  });

  it('should validate that username must be at least (2) characters',
    (done) => {
      let user = new User({
        username: 'x',
        email: 'x@example.com',
        password: '12345'
      });

      user.save(user, (err) => {
        err.errors.username.message.should
          .contain('Username must be at least (2) characters.');
        done();
      });
    }
  );

  it('should validate that username must be at most (50) characters',
    (done) => {
      let user = new User({
        username: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        email: 'x@example.com',
        password: '12345'
      });

      user.save(user, (err) => {
        err.errors.username.message.should
          .contain('Username must be at most (50) characters.');
        done();
      });
    }
  );

  it('should validate that email is required', (done) => {
    let user = new User({
      username: 'xxxxx',
      email: '',
      password: '12345'
    });

    user.save(user, (err) => {
      err.errors.email.message.should.contain('Email is required.');
      done();
    });
  });

  it('should validate that email must not be empty spaces', (done) => {
    let user = new User({
      username: 'dummy',
      email: '        ',
      password: '12345'
    });

    user.save(user, (err) => {
      err.errors.email.message.should
        .contain('Email is required.');
      done();
    });
  });

  it('should validate that password is required', (done) => {
    let user = new User({
      username: 'xxxxx',
      email: 'xxxxx@example.com',
      password: ''
    });

    user.save(user, (err) => {
      err.errors.password.message.should.contain('Password is required.');
      done();
    });
  });

  it('should validate that role is required', (done) => {
    let user = new User({
      username: 'xxxxx',
      email: 'xxxxx@example.com',
      password: '12345',
      role: ''
    });

    user.save(user, (err) => {
      err.errors.role.message.should.contain('Role is required.');
      done();
    });
  });

  it('should assert that default user role is staff', (done) => {
    let user = new User({
      username: 'dummy',
      email: 'dummy@example.com',
      password: '12345'
    });

    user.save(user, (err, user) => {
      if (err) return done(err);

      user.role.should.equal('staff');
      done();
    });
  });
});
