import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MyNavBar from "./components/MyNavBar";
import MainSection from "./components/MainSection";
import Player from "./components/Player";
import FavouritesPage from "./components/FavouritesPage";

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-black overflow-hidden">
        {/* Mobile Navigation */}
        <aside className="block xl:hidden fixed top-0 left-0 right-0 z-50">
          <MyNavBar />
        </aside>

        {/* Desktop Sidebar */}
        <aside className="hidden xl:block w-64 bg-spotify-darker">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-24 xl:pb-20 pt-16 xl:pt-0">
          <Routes>
            <Route path="/" element={<MainSection />} />
            <Route path="/search" element={<MainSection />} />
            <Route path="/favorites" element={<FavouritesPage />} />
          </Routes>
        </main>
      </div>

      {/* Player - Fixed at bottom */}
      <Player />
    </Router>
  );
}

export default App;
