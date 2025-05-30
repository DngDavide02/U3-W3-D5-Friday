import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MainSection from "./components/MainSection";
import Player from "./components/Player";
import FavouritesPage from "./components/FavouritesPage";

function App() {
  return (
    <Router>
      <div className="container-fluid">
        <div className="row">
          <aside className=" p-0">
            <Sidebar />
          </aside>

          <main className=" p-3 mainPage">
            <Routes>
              <Route path="/" element={<MainSection />} />
              <Route path="/favourites" element={<FavouritesPage />} />
            </Routes>
          </main>
        </div>

        <Player />
      </div>
    </Router>
  );
}

export default App;
