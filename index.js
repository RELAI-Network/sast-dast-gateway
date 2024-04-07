const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


// MobSF API configurations
const MOBSF_BASE_URL = process.env.MOBSF_BASE_URL;
const MOBSF_API_KEY = process.env.MOBSF_API_KEY;

const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// New endpoint to receive file and call /api/v1/upload
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);

    try {
        const response = await axios.post(MOBSF_BASE_URL+'/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': MOBSF_API_KEY, 
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error forwarding file upload:', error);
        res.status(500).json({ error: 'Error forwarding file upload' });
    }
});


// New endpoint to forward scan request
app.post('/scan', async (req, res) => {
    const { hash, re_scan } = req.body;

    if (!hash) {
        return res.status(400).json({ error: 'Missing required parameter: hash' });
    }

    try {

        const formData = new FormData();
        formData.append('hash', hash);
        formData.append('re_scan', 0);

        const response = await axios.post(MOBSF_BASE_URL + '/scan',  formData, {
            headers: {
                'Authorization': MOBSF_API_KEY,
            },
        });

        res.json(response.data);


    } catch (error) {
        console.error('Error forwarding scan request:', error);
        res.status(500).json({ error: 'Error forwarding scan request'});
    }
});

// New endpoint to forward scan request
app.get('/recent-scans', async (req, res) => {

    try {
        const response = await axios.get(MOBSF_BASE_URL+'/scans', {
            headers: {
                'Authorization': MOBSF_API_KEY,
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error forwarding scan request:', error);
        res.status(500).json({ error: 'Error forwarding scan request' });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
