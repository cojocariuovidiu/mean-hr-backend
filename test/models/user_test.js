process.env.NODE_ENV = 'test';
require('dotenv').config();

const chai = require('chai');
// const should = chai.should();
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
});

