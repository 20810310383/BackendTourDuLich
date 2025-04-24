const express = require("express");
const { getTour, createTour, updateTour, deleteTour, deleteNhieuProduct, getDetailSP } = require("../controllers/Tour/tour.controller");
const { createOrder, getOrder } = require("../controllers/Order/dattour.controller");

const router = express.Router();


// find all tourdulich
router.get("/get-tourdulich", getTour );
router.get("/get-tourdulich-datlich", getOrder );
router.get("/get-detail-tourdulich", getDetailSP );
// tao moi tourdulich
router.post("/create-tourdulich", createTour );
router.post("/datlich-tourdulich", createOrder );

// update tourdulich
router.put("/update-tourdulich", updateTour );

// delete tourdulich
router.delete("/delete-tourdulich/:id", deleteTour );

router.delete("/delete-nhieu-tourdulich", deleteNhieuProduct );

module.exports = router;