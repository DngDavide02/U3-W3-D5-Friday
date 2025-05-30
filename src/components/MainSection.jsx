import { useDispatch, useSelector } from "react-redux";
import MusicSection from "./MusicSection";
import TrackCard from "./TrackCard";
import { setCurrentSong } from "../store/playerSlice";

const MainSection = () => {
  const dispatch = useDispatch();
  const searchResults = useSelector((state) => state.search.results);

  const sections = [
    { genre: "rock", title: "Rock Classics" },
    { genre: "pop", title: "Pop Culture" },
    { genre: "hiphop", title: "HipHop" },
  ];

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-12 d-none d-md-flex justify-content-center gap-5 mainLinks">
          <a href="#">TRENDING</a>
          <a href="#">PODCAST</a>
          <a href="#">MOODS AND GENRES</a>
          <a href="#">NEW RELEASES</a>
          <a href="#">DISCOVER</a>
        </div>
      </div>

      {searchResults && searchResults.length > 0 && (
        <section className="my-4" id="searchResultsSection">
          <h2 className="text-white mb-3">Search Results</h2>
          <div className="row row-cols-2 row-cols-md-4 g-3">
            {searchResults.map((song) => (
              <div key={song.id} className="col">
                <TrackCard track={song} onClick={() => dispatch(setCurrentSong(song))} />
              </div>
            ))}
          </div>
        </section>
      )}

      {sections.map(({ genre, title }) => (
        <div className="row justify-content-center" key={genre}>
          <div className="col-12 col-xl-10">
            <MusicSection genre={genre} title={title} id={`${genre}Section`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainSection;
