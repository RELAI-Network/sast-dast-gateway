const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


// MobSF API configurations
const MOBSF_API_KEY = process.env.MOBSF_API_KEY;

const upload = multer({ storage: multer.memoryStorage() });


// New endpoint to receive file and call /api/v1/upload
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);

    try {
        const response = await axios.post('http://localhost:3000/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'YOUR_API_KEY', // Replace with your actual API key
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
        const response = await axios.post('http://localhost:3000/scan', { hash, re_scan }, {
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


/*
// Mock MobSF API
app.post('/scan-sim', async (req, res) => {
    const apiKey = req.headers.authorization || req.headers['x-mobsf-api-key'];
    const { hash, re_scan = 0 } = req.body;

    if (!apiKey) {
        return res.status(401).json({ error: 'Unauthorized: API key is required' });
    }

    if (!hash) {
        return res.status(400).json({ error: 'Missing required parameter: hash' });
    }

    // Here, you can simulate any additional processing or validation
    // based on the provided hash and re_scan parameters

    res.json({
        success: true,
        message: 'Scan initiated successfully',
        scanInfo: {
            hash,
            re_scan,
        },
    });
});

// Mock MobSF API
app.post('/mobsf-sim', upload.single('file'), (req, res) => {
    const apiKey = req.headers.authorization || req.headers['x-mobsf-api-key'];

    if (!apiKey) {
        return res.status(401).json({ error: 'Unauthorized: API key is required' });
    }

    if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
    }

    const fileInfo = {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
    };

    // Here, you can simulate any additional processing or validation
    // based on the uploaded file and API key

    res.json({
        success: true,
        message: 'File uploaded successfully',
        fileInfo,
    });
});

*/

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});