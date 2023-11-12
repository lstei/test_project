const express = require('express');
const multer = require('multer');
const app = express();
const port = 7000;

app.use(express.static(__dirname));
app.use(multer({dest:'uploads'}).single('filedata'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now())
	}
})

const upload = multer({storage: storage})

app.post('/upload', function (req, res) {

	let filedata = req.file;
	if(!filedata) {
		res.send('Loading error')
	}
	res.send('File uploaded');
});
