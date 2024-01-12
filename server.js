// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Enable CORS for all routes
app.use(cors());

// Mock data with random images
const items = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `Item ${index + 1}`,
  imageUrl: `https://picsum.photos/200/300?random=${index}`, // Using Lorem Picsum for random images
}));

// Paginated endpoint
app.get('/api/items', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  const paginatedItems = items.slice(offset, offset + limit);

  res.json({
    items: paginatedItems,
    totalItems: items.length,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
