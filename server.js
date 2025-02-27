require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const API_BASE = "https://api.vidown.io/getLink?url="; // Using VidDownloader API

// API Route to fetch video details from VidDownloader
app.get("/api/download", async (req, res) => {
    const videoUrl = req.query.url;
    
    if (!videoUrl) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        // Fetch data from VidDownloader API
        const response = await axios.get(`${API_BASE}${encodeURIComponent(videoUrl)}`);
        const data = response.data;

        if (!data || !data.data) {
            return res.status(500).json({ error: "Failed to fetch video details" });
        }

        // Extract MP3 & MP4 download links
        const mp4Link = data.data.mp4.url || null;
        const mp3Link = data.data.mp3.url || null;

        res.json({
            title: data.data.title || "Unknown Title",
            thumbnail: data.data.thumbnail || "",
            duration: data.data.duration || "Unknown",
            mp3: mp3Link,
            mp4: mp4Link
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch video details" });
    }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
