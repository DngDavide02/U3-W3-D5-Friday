import { useSelector, useDispatch } from "react-redux";
import TrackCard from "./TrackCard";
import { setCurrentSong, setQueue } from "../store/playerSlice";
import { RootState } from "../store";
import { Track } from "../types";
import { Heart, Music, Play } from "lucide-react";

const FavouritesPage = () => {
  const dispatch = useDispatch();
  const likedSongs = useSelector((state: RootState) => state.likes.likedSongs);
  const favourites = Object.values(likedSongs || {});

  // Debug: log favourites when component mounts or updates
  console.log("FavouritesPage - likedSongs:", likedSongs);
  console.log("FavouritesPage - favourites:", favourites);

  const handleSelectSong = (track: Track) => {
    dispatch(setCurrentSong(track));
  };

  const handlePlayAll = () => {
    console.log("handlePlayAll called, favourites length:", favourites.length);
    console.log("favourites:", favourites);
    if (favourites.length > 0) {
      dispatch(setQueue(favourites));
      dispatch(setCurrentSong(favourites[0]));
      console.log("Set queue and current song");
    } else {
      console.log("No favourites to play");
    }
  };

  return (
    <div className="px-4 lg:px-6 py-6">
      {/* Header */}
      <div className="flex items-center space-x-6 mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-2xl">
          <Heart size={48} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Favorite Songs</h1>
          <p className="text-spotify-lighterGray text-lg">
            {favourites.length} {favourites.length === 1 ? "song" : "songs"} in your collection
          </p>
        </div>
      </div>

      {/* Content */}
      {favourites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 bg-spotify-darker rounded-full flex items-center justify-center mb-6">
            <Heart size={40} className="text-spotify-lighterGray" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No favorite songs yet</h2>
          <p className="text-spotify-lighterGray text-center max-w-md mb-8">
            Songs you like will appear here. Start exploring and add songs to your favorites to build your personal collection.
          </p>
          <button onClick={() => window.history.back()} className="btn-primary">
            Explore Music
          </button>
        </div>
      ) : (
        <div>
          {/* Play All Button */}
          <div className="mb-6">
            <button onClick={handlePlayAll} className="btn-primary flex items-center space-x-2">
              <Play size={20} />
              <span>Play All</span>
            </button>
          </div>

          {/* Songs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favourites.map((track) => (
              <TrackCard
                key={track.id || `${track.title}-${track.artist?.name || "unknown"}`}
                track={track}
                onClick={() => handleSelectSong(track)}
                size="medium"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavouritesPage;
