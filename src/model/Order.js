// models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    people: {
        type: Number,
        required: true,
        min: 1,
    },
    date: {
        type: String,
        required: true,
    },
    pickup: {
        type: String,
        required: true,
        trim: true,
    },
    note: {
        type: String,
        default: '',
        trim: true,
    },
    tenTour: {
        type: String,
        required: true,
        trim: true,
    },
    giaTour: {
        type: String,
        required: true,
        trim: true,
    },
}, {
  timestamps: true, // createdAt, updatedAt
});

module.exports = mongoose.model('Order', orderSchema);
