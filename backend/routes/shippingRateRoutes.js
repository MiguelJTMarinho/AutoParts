const express = require("express");
const router = express.Router();
const shippingRateService = require("../service/shippingRateService");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// @route POST /api/shipping_rates
// @desc Create a new shipping rate tier
// @access Private/Admin
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const data = await shippingRateService.createShippingRate(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route GET /api/shipping_rates
// @desc Get all shipping rates
// @access Public (Frontend might need this to show an info page to users)
router.get("/", async (req, res) => {
  try {
    const data = await shippingRateService.getAllShippingRates();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route GET /api/shipping_rates/:id/max
// @desc Get max price shipping price
// @access Public
router.get("/max", protect, isAdmin, async (req, res) => {
  try {
    const data = await shippingRateService.getMaxPrice();
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route GET /api/shipping_rates/:id
// @desc Get a specific shipping rate
// @access Private/Admin
router.get("/:id", protect, isAdmin, async (req, res) => {
  try {
    const data = await shippingRateService.getShippingRateById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route PUT /api/shipping_rates/:id
// @desc Update a shipping rate
// @access Private/Admin
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const data = await shippingRateService.updateShippingRate(
      req.params.id,
      req.body,
    );
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route DELETE /api/shipping_rates/:id
// @desc Delete a shipping rate
// @access Private/Admin
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const data = await shippingRateService.deleteShippingRate(req.params.id);
    res.json({ message: "Shipping rate deleted successfully", data });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

module.exports = router;
