(function() {

	var bucketName = document.querySelector('#files').dataset.bucketName;

	Dropzone.options.uploadForm = {
		maxFileSize: 10, //MB
		previewsContainer: '#files',
		createImageThumbnails: false,
		init: function() {
			this.on('addedfile', function(file) {
				var details = file.previewElement.querySelector('.dz-details');

				var link = document.createElement('a');
				link.href = '/buckets/' + bucketName + '/' + file.name;

				file.previewElement.replaceChild(link, details);

				link.appendChild(details);
			});
		}
	};
})();