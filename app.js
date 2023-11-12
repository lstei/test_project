const express = require('express');
const multer = require('multer');
const app = express();
const port = 7000;


const storageConfig = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now())
	}
})

//filtering uploaded files
const fileFilter = (req, file, cb) => {

	if(file.mimetype === "image.png" ||
		file.mimetype === "image.jpg" ||
		file.mimetype === "image.jpeg"
		) {
		cb(null, true);
	}
	else {
		cb(null, false);
	}
}

app.use(express.static(__dirname));
app.use(multer({dest:'uploads'}).single('filedata'));
app.use(multer({storage:storageConfig, fileFilter: fileFilter}).single('filedata'));
app.use(express.json({limir: '10mb'}));
app.use(express.urlencoded({limit: '10mb'}));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

app.post('/upload', function (req, res) {
	let filedata = req.file;
	if(!filedata) {
		res.send('Loading error')
	}
	res.send('File uploaded');
});
