require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const API_BASE = "https://api.savetube.io/download?url=";

// ✅ Correct API Route
app.get("/api/download", async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const response = await axios.get(`${API_BASE}${encodeURIComponent(videoUrl)}`);
        const data = response.data;

        if (!data || data.error) {
            return res.status(500).json({ error: "Failed to fetch video details" });
        }

        res.json({
            title: data.title || "Unknown Title",
            mp3: data.mp3 || null,
            mp4: data.mp4 || null
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch video details" });
    }
});

// ✅ Default route to prevent 404 errors
app.get("/", (req, res) => {
    res.send("API is running...");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
