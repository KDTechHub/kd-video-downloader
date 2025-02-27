require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const API_BASE = "https://viddownloader.net/process"; // Updated API URL

// API Route to fetch video details
app.get("/api/download", async (req, res) => {
    const videoUrl = req.query.url;
    
    if (!videoUrl) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        // Fetch data from VidDownloader API
        const response = await axios.post(API_BASE, new URLSearchParams({ url: videoUrl }), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        const data = response.data;

        if (!data || !data.links || data.links.length === 0) {
            return res.status(500).json({ error: "Failed to fetch video details" });
        }

        // Extract MP3 & MP4 download links
        let mp3Link = null;
        let mp4Link = null;

        data.links.forEach(link => {
            if (link.type === "audio") mp3Link = link.url;
            if (link.type === "video") mp4Link = link.url;
        });

        res.json({
            title: data.title || "Unknown Title",
            thumbnail: data.thumbnail || "",
            duration: data.duration || "Unknown",
            mp3: mp3Link,
            mp4: mp4Link
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch video details" });
    }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));