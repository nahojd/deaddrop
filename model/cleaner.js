var fs = require('fs-extra');
var path = require('path');
var bucketeer = require('./bucket');


function start(maxAge, checkInterval) {
	setInterval(checkAge, checkInterval, maxAge)	
}

function checkAge(maxAge) {
	var ageLimit = new Date(Date.now() - maxAge);

	console.log('Removing buckets created before ' + ageLimit);

	var bucketDir = bucketeer.getBucketDir('/');

	fs.readdir(bucketDir, function(err, files) {
		if (!files)
			return;

		var filesRemoved = 0;
		for(var i=0; i<files.length; i++) {
			var bucketPath = path.join(bucketDir, files[i]);
			var stats = fs.statSync(bucketPath);

			if (stats.ctime < ageLimit) {
				fs.removeSync(bucketPath);
				filesRemoved++;
			}
		}	

		console.log('Removed ' + filesRemoved + ' buckets.')
	});
};

module.exports = {
	start: start
}