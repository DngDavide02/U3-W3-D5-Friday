import { useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchResults } from "../store/searchSlice";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${query}`);
      if (response.ok) {
        const data = await response.json();
        dispatch(setSearchResults(data.data));
      } else {
        console.error("Errore nella fetch");
      }
    } catch (error) {
      console.error("Errore di rete", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <nav className="navbar navbar-expand-md fixed-left justify-content-between" id="sidebar">
      <div className="container flex-column align-items-start">
        <Link className="navbar-brand" to="/">
          <img src="../assets/logo/logo.png" alt="Spotify Logo" width="131" height="40" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <ul>
              <li>
                <Link className="nav-item nav-link d-flex align-items-center" to="/">
                  <i className="bi bi-house-door-fill"></i>&nbsp; Home
                </Link>
              </li>
              <li>
                <Link className="nav-item nav-link d-flex align-items-center" to="/favourites">
                  <i className="bi bi-heart-fill"></i>&nbsp; Favourites
                </Link>
              </li>
              <li>
                <div className="input-group mt-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="input-group-append">
                    <button className="btn btn-outline-secondary btn-sm h-100" onClick={handleSearch}>
                      GO
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="nav-btn">
        <button className="btn signup-btn" type="button">
          Sign Up
        </button>
        <button className="btn login-btn" type="button">
          Login
        </button>
        <div>
          <a href="#">Cookie Policy</a> | <a href="#">Privacy</a>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
