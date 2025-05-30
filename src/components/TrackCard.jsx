import { useDispatch, useSelector } from "react-redux";
import { toggleLike } from "../store/likeSlice";

const TrackCard = ({ track, onClick }) => {
  const dispatch = useDispatch();
  const liked = useSelector((state) => state.likes.likedSongs[track.id]);

  const handleToggleLike = (e) => {
    e.stopPropagation();
    dispatch(toggleLike(track));
  };

  const cover = track?.album?.cover_medium || "https://via.placeholder.com/250x250?text=No+Cover";
  const artist = track?.artist?.name || "Unknown Artist";
  const title = track?.title || "Untitled";

  return (
    <div className="text-center text-white position-relative" style={{ cursor: "pointer" }} onClick={onClick}>
      <img className="img-fluid" src={cover} alt={title} style={{ display: "block", width: "100%", height: "auto" }} />
      <p className="mt-2 mb-0">
        <strong>{title}</strong>
        <br />
        {artist}
      </p>
      <button
        className="btn btn-sm position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          color: liked ? "red" : "white",
          fontSize: "1rem",
          lineHeight: "1",
          border: "none",
          outline: "none",
          cursor: "pointer",
          zIndex: 10,
        }}
        onClick={handleToggleLike}
        aria-label={liked ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
      >
        {liked ? "❤️" : "🤍"}
      </button>
    </div>
  );
};

export default TrackCard;
