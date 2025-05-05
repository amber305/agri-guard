const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, sortBy, categories } = req.query;
    let query = {};

    // Handle search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Handle category filter
    if (categories && categories.length > 0) {
      query.category = { $in: categories.split(',') };
    }

    // Handle sorting
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case 'name-asc':
          sort = { name: 1 };
          break;
        case 'name-desc':
          sort = { name: -1 };
          break;
        case 'price-asc':
          sort = { price: 1 };
          break;
        case 'price-desc':
          sort = { price: -1 };
          break;
        default:
          sort = { name: 1 }; // Default sort by name ascending
      }
    }

    const products = await Product.find(query).sort(sort);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.post("/", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

module.exports = router;
