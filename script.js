// Function to convert the video (fetch download links from backend)
async function convertVideo() {
    const url = document.getElementById("videoUrl").value;
    
    if (!url) {
        alert("Please enter a YouTube URL.");
        return;
    }

    try {
        // Show loading message
        document.getElementById("formatOptions").classList.add("d-none");

        // Use VidDownloader API for fetching download links
        let response = await fetch("https://viddownloader.net/process", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ "url": url })
        });

        let data = await response.json();

        if (!data || !data.links || data.links.length === 0) {
            alert("Error: Could not fetch download links. Try again later.");
            return;
        }

        // Extract MP3 and MP4 links
        let mp3Link = null;
        let mp4Link = null;

        data.links.forEach(link => {
            if (link.type === "audio") mp3Link = link.url;
            if (link.type === "video") mp4Link = link.url;
        });

        if (!mp3Link && !mp4Link) {
            alert("No valid download links found.");
            return;
        }

        // Show format options only if API returns valid links
        document.getElementById("formatOptions").classList.remove("d-none");

        // Set download links dynamically
        if (mp3Link) {
            document.getElementById("downloadMp3").setAttribute("data-url", mp3Link);
            document.getElementById("downloadMp3").textContent = "Download MP3";
        }
        if (mp4Link) {
            document.getElementById("downloadMp4").setAttribute("data-url", mp4Link);
            document.getElementById("downloadMp4").textContent = "Download MP4";
        }
    } catch (error) {
        alert("Failed to fetch video. Try again later.");
    }
}

// Function to handle downloads when a format is selected
function downloadFormat(format) {
    const btn = format === "mp3" ? document.getElementById("downloadMp3") : document.getElementById("downloadMp4");
    const downloadUrl = btn.getAttribute("data-url");

    if (!downloadUrl) {
        alert("Please convert the video first.");
        return;
    }

    window.location.href = downloadUrl; // Redirect to the download link
}

// Function to prevent users from inspecting the site (basic security)
document.addEventListener("contextmenu", (event) => event.preventDefault());
document.onkeydown = function (e) {
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S' || e.key === 'i' || e.key === 'I')) {
        return false;
    }
};

// Additional JavaScript for interactivity
document.addEventListener("DOMContentLoaded", function() {
    console.log("Website loaded and ready!");

    // Event listeners for download buttons
    document.getElementById("downloadMp3").addEventListener("click", () => downloadFormat('mp3'));
    document.getElementById("downloadMp4").addEventListener("click", () => downloadFormat('mp4'));

    // Sidebar toggle (if your website has a sidebar)
    const sidebarToggle = document.getElementById("sidebarToggle");
    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", function() {
            document.getElementById("sidebar").classList.toggle("active");
        });
    }
});