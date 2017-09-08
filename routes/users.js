const express = require('express');
const router  = express.Router();
const users   = require('../controllers/users');

router.get('/users', users.index);

module.exports = router;
