async function fetchVideoInfo() {
    const url = document.getElementById("videoUrl").value.trim();
    if (!url || !url.includes("youtube.com") && !url.includes("youtu.be")) {
        alert("Please enter a valid YouTube URL.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/video_info?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.error) {
            alert("Error fetching video details.");
            return;
        }

        document.getElementById("videoTitle").innerText = data.title;
        document.getElementById("videoThumbnail").src = data.thumbnail;

        const formatOptions = document.getElementById("formatOptions");
        formatOptions.innerHTML = ""; // Clear previous buttons
        formatOptions.classList.remove("d-none");

        data.formats.video.forEach(format => {
            let btn = document.createElement("button");
            btn.className = "btn btn-success mx-2";
            btn.innerText = `Download MP4 (${format.quality})`;
            btn.onclick = () => downloadVideo(url, "mp4");
            formatOptions.appendChild(btn);
        });

        let mp3Button = document.createElement("button");
        mp3Button.className = "btn btn-primary mx-2";
        mp3Button.innerText = "Download MP3";
        mp3Button.onclick = () => downloadVideo(url, "mp3");
        formatOptions.appendChild(mp3Button);

    } catch (error) {
        alert("Failed to fetch video details.");
    }
}

async function downloadVideo(url, format) {
    window.open(`http://localhost:3000/download?url=${encodeURIComponent(url)}&format=${format}`, "_blank");
}