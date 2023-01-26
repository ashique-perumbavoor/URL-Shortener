const express = require('express');
const { createURL, redirectToURL } = require('../helpers/shortenURLHelper');
const router = express.Router();

router.get('/', function(req, res) { res.render('index'); });
router.post('/',createURL);
router.get('/:id', redirectToURL)

module.exports = router;