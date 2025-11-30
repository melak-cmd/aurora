const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

async function listObjects() {
  const response = await axios.get('https://api.restful-api.dev/objects');
  return response.data;
}

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api/objects', async (req, res) => {
  try {
    const objects = await listObjects();
    res.json(objects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/objects/:id', async (req, res) => {
  try {
    const response = await axios.get(`https://api.restful-api.dev/objects/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Only start server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = { app, listObjects };