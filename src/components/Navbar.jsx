import { useCollection } from "../context/CollectionContext.jsx";
export default function Navbar({ page, setPage, theme, toggleTheme }) {
  const { albums } = useCollection();
  const count = Object.keys(albums).length;
  const tab = (id, label) => (
    <button
      className={`nav-tab ${page === id ? "active" : ""}`}
      onClick={() => setPage(id)}
    >
      {label}
    </button>
  );
  return (
    <header className="navbar">
      <h1 className="logo">Album Tracker</h1>
      <div className="nav-actions">
        <nav aria-label="Main navigation">
          {tab("discover", "Discover")}
          {tab("collection", `My collection (${count})`)}
          {tab("ai", "Recommendations")}
        </nav>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? "☀ Light" : "☾ Dark"}
        </button>
      </div>
    </header>
  );
}

