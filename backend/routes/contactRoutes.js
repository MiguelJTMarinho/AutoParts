const express = require("express");
const router = express.Router();
const contactService = require("../service/contactService");

router.post("/", contactService.createMessage);

module.exports = router;
