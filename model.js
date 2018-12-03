var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    userName: { type: String, required: true },
    emailId: { type: String, required: true, index: true, unique: true },
    DOB: { type: Date, default: new Date() },
    role: { type: String, enum: ['King', 'Queen', 'Boys', 'Girls'], required: true },
    status: { type: String, enum: ['Active', 'InActive'], default: 'Active' },
    password: { type: String, required: true },
    editedBy: { type: mongoose.Schema.Types.ObjectId, ref: "KQ" }
})

module.exports = mongoose.model('KQ', schema)
