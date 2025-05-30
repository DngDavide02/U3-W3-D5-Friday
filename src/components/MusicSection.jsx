import { useDispatch, useSelector } from "react-redux";
import { setCurrentSong } from "../store/playerSlice";
import { toggleLike } from "../store/likeSlice";
import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";

const artistsByGenre = {
  rock: ["queen", "led zeppelin", "nirvana", "pink floyd", "acdc", "guns n roses"],
  pop: ["katyperry", "taylor swift", "ariana grande", "dua lipa", "madonna", "lady gaga"],
  hiphop: ["eminem", "kendrick lamar", "drake", "snoop dogg", "jay z", "50 cent"],
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const MusicSection = ({ genre, title, id }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const likedSongs = useSelector((state) => state.likes?.likedSongs || {});

  useEffect(() => {
    const fetchSongsFromArtists = async (artistList) => {
      const selectedSongs = [];
      setLoading(true);

      for (const artist of artistList) {
        try {
          const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${artist}`);
          if (response.ok) {
            const { data } = await response.json();
            if (data.length > 0) {
              const topSongs = data.slice(0, 5);
              selectedSongs.push(...topSongs);
            }
          }
        } catch (error) {
          console.error(`Errore nel fetch per ${artist}:`, error);
        }
      }

      shuffleArray(selectedSongs);
      setSongs(selectedSongs.slice(0, 12));
      setLoading(false);
    };

    const artistList = artistsByGenre[genre.toLowerCase()] || [];
    const shuffledArtists = artistList.sort(() => 0.5 - Math.random());
    fetchSongsFromArtists(shuffledArtists);
  }, [genre]);

  return (
    <section className="my-4 px-3" id={id}>
      <h2 className="text-white mb-3">{title}</h2>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: "150px" }}>
          <Spinner animation="border" variant="light" role="status" />
        </div>
      ) : (
        <div className="row row-cols-2 row-cols-md-6 g-3">
          {songs.map((song) => (
            <div
              key={song.id}
              className="col text-center text-white position-relative"
              style={{ cursor: "pointer" }}
              onClick={() => dispatch(setCurrentSong(song))}
            >
              <img
                className="img-fluid"
                src={song.album.cover_medium}
                alt="track"
                style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
              />
              <p className="mt-2 text-truncate" title={`${song.title} - ${song.artist.name}`}>
                {song.title}
                <br />
                {song.artist.name}
              </p>
              <button
                className="btn btn-sm position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  borderRadius: "50%",
                  width: "2rem",
                  height: "2rem",
                  color: "white",
                  fontSize: "1.2rem",
                  zIndex: 10,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(toggleLike(song));
                }}
                aria-label="Toggle like"
              >
                {likedSongs[song.id] ? "❤️" : "🤍"}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MusicSection;
