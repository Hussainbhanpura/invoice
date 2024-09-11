const mongoose = require('mongoose');

// Define logistics schema
const logisticsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    gstin: {
        type: String,
        required: true
    },
    stateName: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
});

// Create a model based on the schema
const Logistics = mongoose.model('Logistics', logisticsSchema);

module.exports = Logistics;
