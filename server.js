import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5000;

// Fix voor __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Functie om JSON-bestanden te lezen
const readJsonFile = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
      throw new Error('Not a valid file');
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading or parsing file: ${filePath}`, error);
    return null;
  }
};

// Endpoint voor events
app.get('/api/events', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'events.json'); // Correct pad voor lokale bestanden in de 'data' map
  const eventsData = readJsonFile(filePath);

  if (eventsData) {
    res.json(eventsData);
  } else {
    res.status(500).json({ error: 'Could not load events data.' });
  }
});

// Endpoint voor een specifiek event
app.get('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const filePath = path.join(__dirname, 'data', 'events.json');
  const eventsData = readJsonFile(filePath);

  if (eventsData) {
    const event = eventsData.find(event => event.id === id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } else {
    res.status(500).json({ error: 'Could not load events data.' });
  }
});

// Endpoint voor categorieën
app.get('/api/categories', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'categories.json');
  const categoriesData = readJsonFile(filePath);

  if (categoriesData) {
    res.json(categoriesData);
  } else {
    res.status(500).json({ error: 'Could not load categories data.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
