const express = require('express');
const router  = express.Router();
const users   = require('../controllers/users');

router.post('/users/register', users.register);
router.get('/users', users.index);
router.get('/users/:id', users.show);
router.put('/users/:id', users.update);

module.exports = router;
