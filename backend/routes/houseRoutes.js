const express = require("express");
const router = express.Router();
const houseController = require("../controllers/houseController");

// GET all houses
router.get("/", houseController.getAllHouses);

// GET house by ID
router.get("/:id", houseController.getHouseById);

// CREATE house
router.post("/", houseController.createHouse);

// UPDATE house
router.put("/:id", houseController.updateHouse);

// DELETE house
router.delete("/:id", houseController.deleteHouse);

// DELETE multiple houses
router.post("/delete-multiple", houseController.deleteMultipleHouses);

// BULK UPLOAD houses
router.post("/bulk-upload", houseController.bulkUploadHouses);

module.exports = router;