const express = require("express");
const router = express.Router();

/**
 * @openapi
 * /:
 *   get:
 *     summary: Check that server works
 *     responses:
 *       200: { description: Server is running }
 */
router.get("/", (req, res) => res.send("<h1>Server is running</h1>"));

/**
 * @openapi
 * /hello:
 *   get:
 *     summary: Hello message
 *     responses:
 *       200: { description: Hello from server }
 */
router.get("/hello", (req, res) => res.json({ message: "Hello from LMS server!" }));

/**
 * @openapi
 * /time:
 *   get:
 *     summary: Current server time
 *     responses:
 *       200: { description: ISO time }
 */
router.get("/time", (req, res) => res.json({ time: new Date().toISOString() }));

/**
 * @openapi
 * /status:
 *   get:
 *     summary: Status endpoint
 *     responses:
 *       200: { description: OK }
 */
router.get("/status", (req, res) => res.json({ status: "OK" }));

module.exports = router;
