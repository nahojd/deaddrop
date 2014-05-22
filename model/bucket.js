function getRandomBucket(callback) {
	fs.readdir(path.resolve('./public/buckets'), function(err, buckets) {
		var bucket = generateBucketName();
		while(buckets.indexOf(bucket) >= 0) {
			bucket = generateBucketName();
		}
		callback(bucket);
	});
}

function generateBucketName()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function fileSizeIEC(a,b,c,d,e){
 return (b=Math,c=b.log,d=1024,e=c(a)/c(d)|0,a/b.pow(d,e)).toFixed(2)
 +' '+(e?'KMGTPEZY'[--e]+'iB':'Bytes')
}
//KiB,MiB,GiB,TiB,PiB,EiB,ZiB,YiB

module.exports = {
	getRandomBucket: getRandomBucket,
	formatFileSize: fileSizeIEC
};