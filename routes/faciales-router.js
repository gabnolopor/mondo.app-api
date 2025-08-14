const express = require("express");
const facialesController = require("../controller/faciales-controller");

const router = express.Router();

router.get("/", facialesController.getFaciales); // Route to get all faciales
router.get("/latest", facialesController.getLatestFaciales); // Route to get the latest faciales
router.post("/form", facialesController.facialFormSubmit); // Route to submit facial form data
router.put("/:id", facialesController.updateFacial); // Route to update a facial
router.delete("/:id", facialesController.deleteFacial); // Route to delete a facial
router.patch("/:id/toggle", facialesController.toggleActive); // Route to toggle the active status of a facial

module.exports = router; 