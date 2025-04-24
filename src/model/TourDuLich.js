// models/TourDuLich.js

const mongoose = require('mongoose');

const TourDuLichSchema = new mongoose.Schema({
    tenTour: {
        type: String,
        required: true,
    },
    giaTour: {
        type: Number,
        required: true,
    },
    khoiHanh: {
        type: String,
        required: true,
    },
    phuongTien: {
        type: String,
        required: true,
    },
    xuatPhat: {
        type: String,
        required: true,
    },
    lichTrinh: {
        type: String,
        required: true,
    },
    chinhSach: {
        type: String,
        required: true,
    },
    dieuKhoan: {
        type: String,
        required: true,
    },
    imageSlider: [{ type: String }],    
    image: { type: String, required: false },  
}, {
  timestamps: true // tự động tạo createdAt và updatedAt
});

module.exports = mongoose.model('TourDuLich', TourDuLichSchema);
