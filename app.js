const express = require('express');
const multer = require('multer');
const urllib = require('urllib');
const fs = require('fs');
const { XMLParser } = require("fast-xml-parser");
const jwt = require('jsonwebtoken');
const secret = 'mJI8cO6yClKDyrSc8dFJbz4TP7qql3E5';
const app = express();
const port = 7000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname));
const upload = multer({ dest: 'uploads' });

app.get('/', (_, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.post('/upload', upload.single('filedata'), async function (req, res) {
	console.log(req.file);

	//if (!req || !req.file) return

	const postData = {
		async: 'false',
		title: req.file.originalname,
		url: `http://localhost:7000/${req.file.path}`,
		outputtype: 'pdf',
		filetype: 'docx',
		codePage: '65001',
		key: makeId(14),
	};

	const token = jwt.sign(postData, secret, { algorithm: 'HS256', expiresIn: '5m' });

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
		},
		data: postData
	};

	const { status, data } = await urllib.request('http://localhost:80/ConvertService.ashx', options);

	//if (status != 200) return

	const xmlParser = new XMLParser();
	const responseObj = xmlParser.parse(data.toString());
	const responseFileUrl = responseObj.FileResult.FileUrl;

	fs.unlink(req.file.path, _ => {});

	res.redirect(responseFileUrl);
});

function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});