const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileName: String,
    pageCount: Number,
    printCost: Number,
});

module.exports = mongoose.model('File', fileSchema);
