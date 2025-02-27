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

        // Send request to our backend (`server.js`)
        let response = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
        let data = await response.json();

        if (data.error) {
            alert("Error: " + data.error);
        } else {
            // Show format options only if API returns valid links
            document.getElementById("formatOptions").classList.remove("d-none");

            // Set download links dynamically
            document.getElementById("downloadMp3").setAttribute("data-url", data.mp3);
            document.getElementById("downloadMp4").setAttribute("data-url", data.mp4);

            // Update button text to indicate available formats
            document.getElementById("downloadMp3").textContent = "Download MP3";
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