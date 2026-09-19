// forgegrabber.js — Backend API routes for ForgeGrabber
const express = require("express");
const router = express.Router();

// Import your engine registry
const engines = require("../engines"); 
// engines['dalle5'] should already be registered in your engine loader

/* -----------------------------------------------------------
   1. PING — Check if ForgeGrabber is online
----------------------------------------------------------- */
router.get("/ping", (req, res) => {
    res.json({
        ok: true,
        message: "ForgeGrabber is online."
    });
});

/* -----------------------------------------------------------
   2. RUN GRAB TASK — Placeholder task
----------------------------------------------------------- */
router.post("/run-grab", (req, res) => {
    res.json({
        ok: true,
        status: "Grab task executed."
    });
});

/* -----------------------------------------------------------
   3. STATUS — Engine status
----------------------------------------------------------- */
router.get("/status", (req, res) => {
    res.json({
        ok: true,
        state: "Engine idle."
    });
});

/* -----------------------------------------------------------
   4. RESULTS — Placeholder results
----------------------------------------------------------- */
router.get("/results", (req, res) => {
    res.json({
        ok: true,
        results: []
    });
});

/* -----------------------------------------------------------
   5. IMAGE GENERATION — DalleEngine5_0 direct call
----------------------------------------------------------- */
router.post("/generate-image", async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                ok: false,
                error: "Missing prompt."
            });
        }

        // Call your DalleEngine5_0.generate()
        const result = await engines["dalle5"].generate(prompt);

        res.json({
            ok: true,
            url: result.url,
            meta: result.meta
        });

    } catch (err) {
        console.error("ForgeGrabber generate-image error:", err);
        res.status(500).json({
            ok: false,
            error: "Engine failure."
        });
    }
});

module.exports = router;