import { useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchResults } from "../store/searchSlice";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${query}`);
      if (response.ok) {
        const data = await response.json();
        dispatch(setSearchResults(data.data));
      }
    } catch {
      // null
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <nav className="navbar navbar-dark bg-dark fixed-top" style={{ padding: "1rem 2rem" }}>
      <div className="container-fluid d-flex flex-column flex-md-row align-items-center justify-content-between">
        <Link className="navbar-brand mb-3 mb-md-0" to="/">
          <img src="../assets/logo/logo.png" alt="Logo" width="131" height="40" />
        </Link>

        <ul className="navbar-nav flex-column flex-md-row align-items-center w-100 w-md-auto justify-content-center mb-3 mb-md-0">
          <li className="nav-item mx-md-3 mb-3 mb-md-0">
            <Link className="nav-link px-3" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item mx-md-3 mb-3 mb-md-0">
            <Link className="nav-link px-3" to="/favourites">
              Favourites
            </Link>
          </li>
          <li className="nav-item flex-grow-1 mx-md-3">
            <div className="input-group input-group-sm">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="btn btn-outline-light" onClick={handleSearch}>
                GO
              </button>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
