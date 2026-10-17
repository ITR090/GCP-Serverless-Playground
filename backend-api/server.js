const express = require('express');
const multer = require('multer');
require('dotenv').config();
const cors = require('cors')
const path = require('path')
const axios = require('axios');
const { Storage } = require('@google-cloud/storage');

const app = express();
app.use(express.json())
app.use(cors())

// Creates a client storage
const storage = new Storage();
// cloud storage bucket
const BUCKET_NAME = process.env.BUCKET_NAME;

// to server react frotent
// this required so BE can know where are FE files .
app.use(express.static(path.join(__dirname, 'dist')));
//console.log("GOOGLE_APPLICATION_CREDENTIALS:", process.env.GOOGLE_APPLICATION_CREDENTIALS);


// 10 MB matches the limit shown in the UI
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_FILE_SIZE } });

// prefix with a timestamp so two uploads with the same name don't overwrite each other
const uniqueName = (originalname) => `${Date.now()}-${originalname.replace(/[^\w.-]/g, '_')}`;

async function generateSignedUrl(bucketName, fileName) {

  const options = {
    version: "v4",
    action: "read",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  const [url] = await storage
    .bucket(bucketName)
    .file(fileName)
    .getSignedUrl(options);

  return url;
}


app.post('/api/uploadLandmark', upload.single('file'), async (req, res) => {

  try {

    // if no file
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

     // if file type not image
    if (!['image/jpeg', 'image/png'].includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Invalid file type. Only JPEG, PNG allowed.' });
    }

    const objectName = `landmarks/${uniqueName(req.file.originalname)}`;
    const blob = storage.bucket(BUCKET_NAME).file(objectName);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    // if any error during streem 
    blobStream.on('error', err => {
      console.error('Upload error:', err);
      return res.status(500).json({ message: 'Upload failed' });
    });

    // if no errors 
    blobStream.on('finish', async () => {

      try {
        const cloudFunctionUrl = process.env.LANDMARK_DETECTION_FUNCTION_HTTP;
        const uploadedGcsUri = `gs://${BUCKET_NAME}/${objectName}`;
        const cfResponse = await fetch(cloudFunctionUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gcsUri: uploadedGcsUri }),
        });
        const data = await cfResponse.json();

        if (cfResponse.status == 200) {
          // signed url to access image
          const url = await generateSignedUrl(BUCKET_NAME, objectName);
          return res.status(200).json({ message: data, url: url });
        }

        if (cfResponse.status == 400) {
          return res.status(400).json({ message: data.message || 'Error processing image' });
        }

        // any other status from the function: always answer so the client doesn't hang
        return res.status(502).json({ message: 'Landmark detection is unavailable right now. Please try again later.' });


      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Upload failed' });
      }
    })

    blobStream.end(req.file.buffer);
    req.file.buffer = null;

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: `${error} Try again later` })
  }
})


app.post('/api/documentTranslator', upload.single('file'), async (req, res) => {
  try {

    // if no file
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // if file type not image
    if (!['image/jpeg', 'image/png'].includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Invalid file type. Only JPEG, PNG allowed.' });
    }

    const objectName = `documents/${uniqueName(req.file.originalname)}`;
    const blob = storage.bucket(BUCKET_NAME).file(objectName);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: req.file.mimetype,
      },
    });
    // if any error during streem 
    blobStream.on('error', err => {
      console.error('Upload error:', err);
      return res.status(500).json({ message: 'Upload failed' });
    });
    // if no errors

    // if no errors 
    blobStream.on('finish', async () => {

      const messageData = {
        filename: req.file.originalname,
        gcsUri: `gs://${BUCKET_NAME}/${objectName}`,
        contentType: req.file.mimetype,
        timestamp: Date.now()
      };

      try {

       const cloudFunctionUrl_1 = process.env.EXTRACT_TRANSLATE_TEXT_FUNCTION_HTTP;
       const gcsUri = `gs://${BUCKET_NAME}/${objectName}`;

       const response  = await  axios.post(cloudFunctionUrl_1 ,{
        gcsUri: gcsUri,
        targetLanguage: 'ar' // can be dynamic
       }) 

       res.status(200).json({ message: response.data });

      } catch (error) {
        console.error(error);
        res.status(502).json({ message: "We couldn't extract or translate the text in this image. Please try again." });
      }
    })

    blobStream.end(req.file.buffer);
    req.file.buffer = null;

  } catch (error) {
    console.log(error.err)
    res.status(500).json({ message: `${error} Try again later` })
  }

})

// friendly message when the upload is too large
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'That file is too large. Please choose an image under 10 MB.' });
  }
  next(err);
});

// let React Router handle client-side routes (e.g. refreshing /landmark-detection)
app.get('/{*splat}', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
