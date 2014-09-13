var express = require('express');
var fs = require('fs-extra');
var path = require('path');
var markdown = require('markdown').markdown;
var router = express.Router();

router.get('/', function(req, res) {

	var filename = path.resolve('./content/faq.md');
	console.log('Filename: ' + filename);
	fs.readFile(filename, { encoding: 'utf-8' }, function(err, data) {
		console.log('Err: ' + err);
		if (err) throw err;
 		
 		res.render('content', {
			content: markdown.toHTML(data)
		});
	})
});

module.exports = router;