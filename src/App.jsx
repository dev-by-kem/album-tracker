import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Player from "./components/Player.jsx";
import Discover from "./pages/Discover.jsx";
import AlbumDetail from "./pages/AlbumDetail.jsx";
import Collection from "./pages/Collection.jsx";
import AiPicks from "./pages/AiPicks.jsx";
import useLocalStorage from "./hooks/useLocalStorage.js";
export default function App() {
  const [page, setPage] = useState("discover");
  const [albumId, setAlbumId] = useState(null);
  const [theme, setTheme] = useLocalStorage("album-tracker:theme", "dark");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const openAlbum = (id) => {
    setAlbumId(id);
    setPage("album");
  };
  return (
    <>
      <Navbar
        page={page}
        setPage={setPage}
        theme={theme}
        toggleTheme={() => setTheme((current) => current === "dark" ? "light" : "dark")}
      />
      <main>
        {/* Discover stays mounted so your search results survive navigation */}
        <div hidden={page !== "discover"}>
          <Discover openAlbum={openAlbum} />
        </div>
        {page === "album" && (
          <AlbumDetail albumId={albumId} back={() => setPage("discover")} />
        )}
        {page === "collection" && <Collection openAlbum={openAlbum} />}
        {page === "ai" && <AiPicks openAlbum={openAlbum} />}
      </main>
      <Player />
    </>
  );
}
