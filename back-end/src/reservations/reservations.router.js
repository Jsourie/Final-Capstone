/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

// reservations.router.js


const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./reservations.controller");


router.route("/").get(controller.listByDateOrMobileNumber).post(controller.create).all(methodNotAllowed);

router
  .route("/:reservationId/status")
  .get(controller.read)
  .put(controller.updateReservation)
  .all(methodNotAllowed);


module.exports = router;


