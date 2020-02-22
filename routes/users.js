'use strict'
require('dotenv').config(); //.ENV
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const controller = require('../controllers/user.controller');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('User index');
});

router.post('/auth', function(req, res, next) {
  const user = {email: req.body.email, pass: req.body.pass}
  const access_token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
  controller.auth(user)
    .then(() => {
      res.json({access_token: access_token});
    }
    )
    .catch((err) => {
      console.error(err);
    }
    ) 
});

router.post('/register', function (req,res,next) {
  const user = req.body;
  const retorno = controller.create(user);
  console.table(req.body);
  res.send(retorno);
})

module.exports = router;
