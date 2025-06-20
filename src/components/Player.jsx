import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FaPause, FaPlay, FaStepForward, FaStepBackward, FaRandom, FaRedo } from "react-icons/fa";

const Player = () => {
  const currentSong = useSelector((state) => state.player.currentSong);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    setProgress(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [currentSong]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 1;
    setProgress((current / duration) * 100);
  };

  if (!currentSong) {
    return null;
  }

  return (
    <div className="container-fluid fixed-bottom bg-container pt-1">
      <audio ref={audioRef} src={currentSong.preview} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} />
      <div className="row h-100">
        <div className="col-lg-10 offset-lg-2">
          <div className="row h-100 flex-column justify-content-center align-items-center">
            <div className="col-12 text-white mb-2 text-center">
              <strong>{currentSong.title}</strong> - {currentSong.artist.name}
            </div>

            <div className="col-6 col-md-4 playerControls">
              <div className="d-flex justify-content-around align-items-center">
                <a href="#" onClick={(e) => e.preventDefault()} aria-label="shuffle">
                  <FaRandom color="white" size={18} />
                </a>
                <a href="#" onClick={(e) => e.preventDefault()} aria-label="previous">
                  <FaStepBackward color="white" size={18} />
                </a>

                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsPlaying((prev) => !prev);
                  }}
                  aria-label="play/pause"
                >
                  {isPlaying ? <FaPause color="white" size={20} /> : <FaPlay color="white" size={20} />}
                </a>

                <a href="#" onClick={(e) => e.preventDefault()} aria-label="next">
                  <FaStepForward color="white" size={18} />
                </a>
                <a href="#" onClick={(e) => e.preventDefault()} aria-label="repeat">
                  <FaRedo color="white" size={18} />
                </a>
              </div>

              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${progress}%` }}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
