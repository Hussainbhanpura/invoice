const express = require('express');
const router = express.Router();
const distributor = require("../schema/distributor");
const logistic = require('../schema/logistics');

// Create a new distributor
router.post('/distributors', async (req, res) => {
    try {
        const newDistributor = new distributor(req.body);
        await newDistributor.save();
        res.status(201).json(newDistributor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all distributors
router.get('/distributors', async (req, res) => {
    try {
        const distributors = await distributor.find({});
        res.json(distributors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/distributor/:id', async (req, res) =>{
    try {
        const distributors = await distributor.findById(req.params.id);
        res.json(distributors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// Create a new logistics
router.post('/logistics', async (req, res) => {
    try {
        const newLogistics = new logistic(req.body);
        await newLogistics.save();
        res.status(201).json(newLogistics);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all logistics
router.get('/logistics', async (req, res) => {
    try {
        const logistics = await logistic.find();
        res.json(logistics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/logistic/:id', async (req, res) => {
    try {
        const logistics = await logistic.findById(req.params.id);
        res.json(logistics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
