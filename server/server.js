const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
var multer = require('multer');

// protect from cross origin error
app.use(cors());
dotenv.config();
// * using json
app.use(express.json());
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log('connected to db'))
  .catch(err => console.log(err));

// uploaded images
app.use('/images', express.static(path.join(__dirname, '/images')));
// file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name + path.extname(file.originalname));
  },
});

const upload = multer({storage: storage});
app.post('/upload', upload.single('fileData'), (req, res) => {
  res.status(200).json('File has been uploaded');
});

// * routes
const meterRoute = require('./routes/meters');
const measureRoute = require('./routes/measures');
const coastRoute = require('./routes/coasts');
const tokenRoute = require('./routes/tokens');
const notifRoute = require('./routes/sendNotif');

// * using routes
app.use('/meters', meterRoute);
app.use('/measures', measureRoute);
app.use('/coasts', coastRoute);
app.use('/tokens', tokenRoute);

// * starting server
app.listen(process.env.PORT, () => console.log('server running'));
