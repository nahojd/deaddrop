var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();

router.get('/', function(req, res) {
	var p = path.resolve('./public/buckets');

	res.send(200, "Bucketpath: " + p);
});

module.exports = router;