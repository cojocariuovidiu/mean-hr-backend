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
      password: '12345678',
      role: 'admin',
    });

    hr = new User({
      username: 'hr',
      email: 'hr@example.com',
      password: '12345678',
      role: 'hr',
    });

    manager = new User({
      username: 'manager',
      email: 'manager@example.com',
      password: '12345678',
      role: 'manager',
    });

    staff = new User({
      username: 'staff',
      email: 'staff@example.com',
      password: '12345678',
      role: 'staff',
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
      password: '12345678'
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
      password: '12345678',
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
        password: '12345678'
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
        password: '12345678'
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
      password: '12345678'
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
      password: '12345678'
    });

    user.save(user, (err) => {
      err.errors.email.message.should
        .contain('Email is required.');
      done();
    });
  });

  it('should validate that email must be a valid email address', (done) => {
    let user = new User({
      username: 'dummy',
      email: 'some invalid email',
      password: '12345678'
    });

    user.save(user, (err) => {
      err.errors.email.message.should
        .contain('Email is not a valid email address.');
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

  it('should validate that password must be at least (8) characters',
    (done) => {
      let user = new User({
        username: 'xxxxx',
        email: 'x@example.com',
        password: '12345'
      });

      user.save(user, (err) => {
        err.errors.password.message.should
          .contain('Password must be at least (8) characters.');
        done();
      });
    }
  );

  it('should validate that role is required', (done) => {
    let user = new User({
      username: 'xxxxx',
      email: 'xxxxx@example.com',
      password: '12345678',
      role: ''
    });

    user.save(user, (err) => {
      err.errors.role.message.should.contain('Role is required.');
      done();
    });
  });

  it('should assert that default user role is staff', (done) => {
    let user = new User({
      username: 'dummyx',
      email: 'dummy@example.com',
      password: '12345678'
    });

    user.save(user, (err, user) => {
      if (err) return done(err);

      user.role.should.equal('staff');
      done();
    });
  });

  it('should encrypt the password before saving new user', (done) => {
    let user = new User({
      username: 'dummyxxx',
      email: 'dummyxxx@example.com',
      password: '12345678'
    });

    user.save(user, (err, user) => {
      if (err) return done(err);

      user.password.should.not.equal('12345678');
      done();
    });
  });

  it('should match if password and hash match', (done) => {
    let newUser = new User({
      username: 'new user',
      email: 'new@user.com',
      password: '12345678'
    });

    newUser.save((err, user) => {
      if (err) return done(err);

      user.comparePassword('12345678', (err, isMatch) => {
        if (err) return done(err);

        isMatch.should.be.true;
        done();
      });
    });
  });

  it('should not match if password and hash do not match', (done) => {
    let newUser = new User({
      username: 'anorther new user',
      email: 'anothernew@user.com',
      password: '12345678'
    });

    newUser.save((err, user) => {
      if (err) return done(err);

      user.comparePassword('1234567890', (err, isMatch) => {
        if (err) return done(err);

        isMatch.should.be.false;
        done();
      });
    });
  });
});

