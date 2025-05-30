import { useDispatch, useSelector } from "react-redux";
import { setCurrentSong } from "../store/playerSlice";
import { toggleLike } from "../store/likeSlice";
import { useEffect, useState } from "react";

const artistsByGenre = {
  rock: ["queen", "led zeppelin", "nirvana", "pink floyd", "acdc", "guns n roses"],
  pop: ["katyperry", "taylor swift", "ariana grande", "dua lipa", "madonna", "lady gaga"],
  hiphop: ["eminem", "kendrick lamar", "drake", "snoop dogg", "jay z", "50 cent"],
};

const MusicSection = ({ genre, title, id }) => {
  const [songs, setSongs] = useState([]);
  const dispatch = useDispatch();
  const likedSongs = useSelector((state) => state.likes?.likedSongs || {});

  useEffect(() => {
    const fetchSongsFromArtists = async (artistList) => {
      const selectedSongs = [];

      for (const artist of artistList) {
        try {
          const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${artist}`);
          if (response.ok) {
            const { data } = await response.json();
            if (data.length > 0) {
              selectedSongs.push(data[0]);
            }
          }
        } catch (error) {
          console.error(`Errore nel fetch per ${artist}:`, error);
        }
        if (selectedSongs.length === 4) break;
      }

      setSongs(selectedSongs);
    };

    const artistList = artistsByGenre[genre.toLowerCase()] || [];
    const shuffled = artistList.sort(() => 0.5 - Math.random());
    fetchSongsFromArtists(shuffled);
  }, [genre]);

  return (
    <section className="my-4" id={id}>
      <h2 className="text-white mb-3">{title}</h2>
      <div className="row row-cols-2 row-cols-md-4 g-3">
        {songs.map((song) => (
          <div
            key={song.id}
            className="col text-center text-white position-relative"
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(setCurrentSong(song))}
          >
            <img className="img-fluid" src={song.album.cover_medium} alt="track" style={{ display: "block", width: "100%", height: "auto" }} />
            <p className="mt-2">
              {song.title}
              <br />
              {song.artist.name}
            </p>
            <button
              className="btn btn-sm position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                color: "white",
                fontSize: "1rem",
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
    </section>
  );
};

export default MusicSection;
