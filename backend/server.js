import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());

// Sample playlists
const playlists = {
  chill: [
    { title: "Sorry I Like You - Burbank", src: "https://www.youtube.com/embed/GgVcgbtHY9k" },
    { title: "Lofi Chill Beats", src: "https://www.youtube.com/embed/5qap5aO4i9A" },
  ],
  jazz: [
    { title: "Jazz Coffee Vibes", src: "https://www.youtube.com/embed/Dx5qFachd3A" },
    { title: "Smooth Jazz Relax", src: "https://www.youtube.com/embed/DSGyEsJ17cI" },
  ],
  study: [
    { title: "Deep Focus Music", src: "https://www.youtube.com/embed/5yx6BWlEVcY" },
    { title: "Relaxing Study Beats", src: "https://www.youtube.com/embed/lTRiuFIWV54" },
  ],
};

// Get all available playlists
app.get("/api/playlists", (req, res) => {
  res.json(Object.keys(playlists)); // Returns ["chill", "jazz", "study"]
});

// Get songs from a specific playlist
app.get("/api/songs/:playlist", (req, res) => {
  const playlistName = req.params.playlist;
  const songs = playlists[playlistName];

  if (!songs) {
    return res.status(404).json({ error: "Playlist not found" });
  }
  
  res.json(songs);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
