var AWS = require('aws-sdk');
var CreateThumbnail = require('./index.js');

var context = {
  done: function (err, result) {
  	if (err) { console.log(err) }
  	else { 
  		downloadThumbnail(result, 
  			function() { console.log('success')	});		
  	}
	}
}

function downloadThumbnail(request, callback) {
	var s3 = new AWS.S3();
	s3.getObject(request, function(err, data) {
		if (err) console.log(err.message);
		else {
			var fileName = request.Key.substring(request.Key.lastIndexOf('/')+1);
			console.log('Writing thumbnail to ' + fileName);
			var homeDir = 
				(process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE);
			var localFile = homeDir + "/Downloads/thumbnails/" + fileName;
			require('fs').writeFile(localFile, data.Body,
				function(err) {
					if (err) console.log(err.message)
					else s3.deleteObject(request, callback);
				}
			);
		}
	});	
}

var event = {
	destPrefix: 	'scratch/thumbnails/',
	scratch: 			'scratch/',
	bucket: 			'almadtest',
	key: 					'01TEST/storage/Pittsburgh-Black-and-White.jpg'
};

// Call the Lambda function
CreateThumbnail.handler(event, context);

// '01TEST/storage/Alma UX 2.0-Overview.pptx'
// '01TEST/storage/Ingesting Digital Content at Scale.docx'
// '01TEST/storage/Getting Started.pdf'
// '01TEST/storage/bunny.mp4'
// '01TEST/storage/Pittsburgh-Black-and-White.jpg'
// '01TEST/storage/Small-mario.png'
