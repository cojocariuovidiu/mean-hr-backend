process.env.NODE_ENV = 'test';
require('dotenv').config();

const should  = require('chai').should();
const request = require('supertest');
const app     = require('../../app');
const User    = require('../../models/user');

describe('Controller: Users', () => {
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

    admin.save((err, user) => {
      if (err) return done(err);
      admin._id = user._id;
    });

    hr.save((err, user) => {
      if (err) return done(err);
      hr._id = user._id;
    });

    manager.save((err, user) => {
      if (err) return done(err);
      manager._id = user._id;
    });

    staff.save((err, user) => {
      if (err) return done(err);
      staff._id = user._id;
    });

    done();
  });

  after((done) => {
    User.remove({}, (err) => {
      if (err) return done(err);
      done();
    });
  });

  it('POST /api/users/register with valid credentials should create a new ' +
    'user', (done) => {
    request(app)
      .post('/api/users/register')
      .send({
        username: 'moeabdol',
        email: 'admin.r99@gmail.com',
        password: '12345678'
      })
      .expect('Content-Type', /application\/json/)
      .expect(201)
      .expect((res) => {
        res.body.message.should.contain('User registered successfully.');
        User.findOne({ username: 'moeabdol' }, (err, user) => {
          if (err) return done(err);
          should.exist(user);
          user.username.should.equal('moeabdol');
          user.email.should.equal('admin.r99@gmail.com');
          user.password.should.not.equal('12345678');
        });
      })
      .end(done);
  });

  it('POST /api/users/register should return error if username already exists',
    (done) => {
      request(app)
        .post('/api/users/register')
        .send({
          username: 'moeabdol',
          email: 'admin.r99@gmail.com',
          password: '12345678'
        })
        .expect('Content-Type', /application\/json/)
        .expect(400)
        .expect((res) => {
          res.body.message.should.contain('User already exists.');
        })
        .end(done);
    }
  );

  it('POST /api/users/register without username should return error',
    (done) => {
      request(app)
        .post('/api/users/register')
        .send({
          email: 'admin.r99@gmail.com',
          password: '12345678'
        })
        .expect('Content-Type', /application\/json/)
        .expect(400)
        .expect((res) => {
          res.body.message.should.contain('Username is required.');
        })
        .end(done);
    }
  );

  it('POST /api/users/register with username as white spaces should return ' +
    'error', (done) => {
    request(app)
      .post('/api/users/register')
      .send({
        username: '      ',
        email: 'admin.r99@gmail.com',
        password: '12345678'
      })
      .expect('Content-Type', /application\/json/)
      .expect(400)
      .expect((res) => {
        res.body.message.should.contain('Username is required.');
      })
      .end(done);
  });

  it('POST /api/users/register with username less than 2 characters should ' +
    'return error', (done) => {
    request(app)
      .post('/api/users/register')
      .send({
        username: 'a',
        email: 'admin.r99@gmail.com',
        password: '12345678'
      })
      .expect('Content-Type', /application\/json/)
      .expect(400)
      .expect((res) => {
        res.body.message.should.contain('Username must be at least (2) ' +
          'characters.');
      })
      .end(done);
  });

  it('POST /api/users/register with username more than 50 characters should ' +
    'return error', (done) => {
    request(app)
      .post('/api/users/register')
      .send({
        username: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        email: 'admin.r99@gmail.com',
        password: '12345678'
      })
      .expect('Content-Type', /application\/json/)
      .expect(400)
      .expect((res) => {
        res.body.message.should.contain('Username must be at most (50) ' +
          'characters.');
      })
      .end(done);
  });

  it('POST /api/users/register should return error if email already exists',
    (done) => {
      request(app)
        .post('/api/users/register')
        .send({
          username: 'another moeabdol',
          email: 'admin.r99@gmail.com',
          password: '12345678'
        })
        .expect('Content-Type', /application\/json/)
        .expect(400)
        .expect((res) => {
          res.body.message.should.contain('User already exists.');
        })
        .end(done);
    }
  );

  it('POST /api/users/register without email should return error', (done) => {
    request(app)
      .post('/api/users/register')
      .send({
        username: 'yet another moeabdol',
        password: '12345678'
      })
      .expect('Content-Type', /application\/json/)
      .expect(400)
      .expect((res) => {
        res.body.message.should.contain('Email is required.');
      })
      .end(done);
  });

  it('POST /api/users/register with email as white spaces should return error',
    (done) => {
      request(app)
        .post('/api/users/register')
        .send({
          username: 'yet another moeabdol',
          email: '           ',
          password: '12345678'
        })
        .expect('Content-Type', /application\/json/)
        .expect(400)
        .expect((res) => {
          res.body.message.should.contain('Email is required.');
        })
        .end(done);
    }
  );

  it('POST /api/users/register with invalid email address should return error',
    (done) =>{
      request(app)
        .post('/api/users/register')
        .send({
          username: 'yet another moeabdol',
          email: 'some invalid email',
          password: '12345678'
        })
        .expect('Content-Type', /application\/json/)
        .expect(400)
        .expect((res) => {
          res.body.message.should.contain('Email is not a valid email ' +
            'address.');
        })
        .end(done);
    }
  );

  it('POST /api/users/register without password should return error',
    (done) => {
      request(app)
        .post('/api/users/register')
        .send({
          username: 'yet another user',
          email: 'admin.r99@gmail.com',
        })
        .expect('Content-Type', /application\/json/)
        .expect(400)
        .expect((res) => {
          res.body.message.should.contain('Password is required.');
        })
        .end(done);
    }
  );

  it('POST /api/users/register with password less than 8 characters should ' +
    'return error', (done) => {
    request(app)
      .post('/api/users/register')
      .send({
        username: 'xoxo',
        email: 'admin.r99@gmail.com',
        password: '1234'
      })
      .expect('Content-Type', /application\/json/)
      .expect(400)
      .expect((res) => {
        res.body.message.should.contain('Password must be at least (8) ' +
          'characters.');
      })
      .end(done);
  });

  it('POST /api/users/authenticate with valid credentials should return ' +
    'JWT token', (done) => {
    request(app)
      .post('/api/users/authenticate')
      .send({
        username: 'admin',
        password: '12345678'
      })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .expect((res) => {
        res.body.token.should.contain('JWT ');
        res.body.message.should.contain('User authenticated successfully.');
      })
      .end(done);
  });

  it('POST /api/users/authenticate for non-existing user should return ' +
    'error', (done) => {
    request(app)
      .post('/api/users/authenticate')
      .send({
        username: 'someadmin',
        password: '12345678'
      })
      .expect('Content-Type', /application\/json/)
      .expect(400)
      .expect((res) => {
        res.body.message.should.contain('User does not exist');
      })
      .end(done);
  });

  it('POST /api/users/authenticate with invalid password should return ' +
    'error', (done) => {
    request(app)
      .post('/api/users/authenticate')
      .send({
        username: 'admin',
        password: '1234567890'
      })
      .expect('Content-Type', /application\/json/)
      .expect(401)
      .expect((res) => {
        res.body.message.should.contain('Invalid username and/or password.');
      })
      .end(done);
  });

  it('GET /api/users should return an array of users', (done) => {
    request(app)
      .get('/api/users')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .expect((res) => {
        res.body.length.should.equal(5);
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

  it('PUT /api/users/:id with valid credentials should update user',
    (done) => {
      request(app)
        .put(`/api/users/${staff._id}`)
        .send({
          username: 'staff to manager',
          email: 'promotedstaff@example.com',
          password: '1234567890',
          role: 'manager',
          avatar: 'avatar'
        })
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect((res) => {
          res.body.message.should.contain('User updated successfully.');
          User.findById(staff._id, (err, user) => {
            if (err) return done(err);
            should.exist(user);
            user.username.should.equal('staff to manager');
            user.email.should.equal('promotedstaff@example.com');
            user.password.should.not.equal('1234567890');
            user.role.should.equal('manager');
            user.avatar.should.equal('avatar');
          });
        })
        .end(done);
    }
  );

  it('PUT /api/users/:id with invalid id should return error', (done) => {
    request(app)
      .put('/api/users/12345')
      .expect('Content-Type', /application\/json/)
      .expect(400)
      .expect((res) => {
        res.body.message.should.contain('Invalid user ID.');
      })
      .end(done);
  });

  it('PUT /api/users/:id for non-existing user should return error',
    (done) => {
      request(app)
        .put('/api/users/59b28e08f3bd00a8ce1efe3c')
        .expect('Content-Type', /application\/json/)
        .expect(404)
        .expect((res) => {
          res.body.message.should.contain('User not found.');
        })
        .end(done);
    }
  );

  it('PUT /api/users/:id with username as white spaces should return error',
    (done) => {
      request(app)
        .put(`/api/users/${staff._id}`)
        .send({
          username: '      ',
        })
        .expect('Content-Type', /application\/json/)
        .expect(400)
        .expect((res) => {
          res.body.message.should.contain('Username is required.');
        })
        .end(done);
    }
  );

  it('PUT /api/users/:id with username less than 2 characters should return ' +
    'error', (done) => {
    request(app)
      .put(`/api/users/${staff._id}`)
      .send({
        username: 'a'
      })
      .expect('Content-Type', /application\/json/)
      .expect(400)
      .expect((res) => {
        res.body.message.should.contain('Username must be at least (2) ' +
          'characters.');
      })
      .end(done);
  });

  it('PUT /api/users/:id with username more than 50 characters should return' +
    ' error', (done) => {
    request(app)
      .put(`/api/users/${staff._id}`)
      .send({
        username: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      })
      .expect('Content-Type', /application\/json/)
      .expect(400)
      .expect((res) => {
        res.body.message.should.contain('Username must be at most (50) ' +
          'characters.');
      })
      .end(done);
  });

  it('PUT /api/users/:id with email as white spaces should return error',
    (done) => {
      request(app)
        .put(`/api/users/${staff._id}`)
        .send({
          email: '         ',
        })
        .expect('Content-Type', /application\/json/)
        .expect(400)
        .expect((res) => {
          res.body.message.should.contain('Email is required.');
        })
        .end(done);
    }
  );

  it('PUT /api/users/:id with invalid email address should return error',
    (done) => {
      request(app)
        .put(`/api/users/${staff._id}`)
        .send({
          email: 'abcdefghijklmnop',
        })
        .expect('Content-Type', /application\/json/)
        .expect(400)
        .expect((res) => {
          res.body.message.should.contain('Email is not a valid email ' +
            'address.');
        })
        .end(done);
    }
  );

  it('PUT /api/users/:id with password less than 8 characters shoulr return ' +
   'error', (done) => {
    request(app)
      .put(`/api/users/${staff._id}`)
      .send({
        password: '123',
      })
      .expect('Content-Type', /application\/json/)
      .expect(400)
      .expect((res) => {
        res.body.message.should.contain('Password must be at least (8) ' +
          'characters.');
      })
      .end(done);
  });
});
