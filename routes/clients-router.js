const express = require("express");
const clientsController = require("../controller/clients-controller");

const router = express.Router();

router.get("/", clientsController.getClients); // Ruta para obtener todos los clientes
router.post("/register", clientsController.registerClient); // Ruta para registrar un nuevo cliente
router.put("/update", clientsController.updateClient); // Ruta para actualizar un cliente existente
router.delete("/delete/:client_id", clientsController.deleteClient); // Ruta para eliminar un cliente por ID
router.get("/visit-count/:clientId", clientsController.getClientVisitCount); // Ruta para obtener el número de visitas de un cliente
router.get("/services/:clientId", clientsController.getClientServices); // Ruta para obtener los servicios de un cliente
router.post("/add-visit", clientsController.addVisit); // Ruta para agregar una visita a un cliente
router.delete("/delete-visit/:visitId", clientsController.deleteVisit); // Ruta para eliminar una visita por ID
router.get("/visits/:clientId", clientsController.getClientVisits); // Ruta para obtener las visitas de un cliente

module.exports = router;
