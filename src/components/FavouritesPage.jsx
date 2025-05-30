import React from "react";
import { useSelector, useDispatch } from "react-redux";
import TrackCard from "../components/TrackCard";
import { setCurrentSong } from "../store/playerSlice";
const FavouritesPage = () => {
  const dispatch = useDispatch();
  const { likedSongs } = useSelector((state) => state.likes);
  const favourites = Object.values(likedSongs || {});

  const handleSelectSong = (track) => {
    dispatch(setCurrentSong(track));
  };

  return (
    <div className="container">
      <h2 className="mt-4 mb-3 text-white">Favourite Songs</h2>
      <div className="row">
        {favourites.length === 0 ? (
          <div className="text-center w-100">
            <p className="text-white">No favourite songs yet.</p>
          </div>
        ) : (
          favourites.map((track) => (
            <div key={track.id || `${track.title}-${track.artist?.name || "unknown"}`} className="col-6 col-md-4 col-lg-3 mb-3">
              <TrackCard track={track} onClick={() => handleSelectSong(track)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FavouritesPage;
