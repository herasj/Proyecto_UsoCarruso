'use strict';
require('dotenv').config(); //.ENV
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const controller = require('../controllers/user.controller');
const authjwt = require('../middleware/jwt');
const errhelp = require ('../helpers/error-handler');
/* GET users listing. */
router.get(
	'/',
	(req, res, next) => {
		//Middleware
		authjwt.verify(req, res, next); //Verify token
	},
	function(req, res) {
		res.send('User index');
	}
);
router.post('/token', (req, res) => {
	const rToken = req.body.token;
	if (rToken == null) return res.sendStatus(401); //Verify refresh token
	controller
		.token({ email: req.body.email, token: rToken })
		.then(() => {
			authjwt.verifytoken(rToken, res)
		})
		.catch((err) => {
			errhelp.render(err,res);
		});
});
router.post('/auth', function(req, res) {
	const user = { email: req.body.email, pass: req.body.pass }; //Get info from body
	const access_token = authjwt.accesstokenexp(user); //Generate a token with exp
	const refresh_token = authjwt.refreshtoken(user); //Generate a refresh token
	controller
		.auth(user)
		.then(() => {
			res.json({ access_token: access_token, refresh_token: refresh_token }) //After the user is verified the token is sent
		})
		.catch((err) => {
			console.error(err)
			res.send(err)
		});
});

router.post('/register', function(req, res, next) {
	const access_token = authjwt.accesstokenexp(req.body.email); //Generate a token with exp
	const refresh_token = authjwt.refreshtoken(req.body.email); //Generate a refresh token

	const veruser = {
		name: req.body.name,
		last: req.body.last,
		phone: req.body.phone,
		birth: req.body.birth,
		email: req.body.email,
		token: refresh_token,
		pass: req.body.pass
	};
	controller
		.create(veruser)
		.then(() => {
			res.json({ access_token: access_token, refresh_token: refresh_token }); //After the user is verified the token is sent
		})
		.catch((err) => {
			res.json(err);
		});

	console.table(req.body);
});

module.exports = router;
