const mongoose = require('mongoose');

// Define the Number schema
const numberSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }
});

// Create the Number model
const numberModel = mongoose.model('Number', numberSchema);

module.exports = numberModel;