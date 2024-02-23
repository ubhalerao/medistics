// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '12345',
    port: '5432'
});

app.post('/api/users', async (req, res) => {
  const { firstname, lastname, email, phoneNumber, password } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (firstname, lastname, email, phoneNumber, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [firstname, lastname, email, phoneNumber, password]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting into database:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use(express.json());

app.get('/fetch-data', async (req, res) => {
  try {
    const result = await pool.query( 'SELECT * FROM users'); // Replace with your table name
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: './uploads',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint for file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Debugging: Log file details
    console.log('File details:', req.file);

    // Read the uploaded JSON file
    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    console.log('File path:', filePath);

    const jsonData = require(filePath);
    console.log('JSON data:', jsonData);

    // Insert JSON data into PostgreSQL
    await pool.query('INSERT INTO users ("RowData") VALUES ($1)', [jsonData]);

    res.send('File uploaded and data inserted into PostgreSQL successfully!');
  } catch (error) {
    console.error('Error handling file upload:', error.message);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
