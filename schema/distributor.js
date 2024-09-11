const mongoose = require('mongoose');

// Define distributor schema
const distributorSchema = new mongoose.Schema({
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
const Distributor = mongoose.model('Distributor', distributorSchema);

module.exports = Distributor;
