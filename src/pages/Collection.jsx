import { useRef, useState } from "react";
import AlbumCard from "../components/AlbumCard.jsx";
import { STATUSES } from "../components/StatusSelect.jsx";
import { useCollection } from "../context/CollectionContext.jsx";
export default function Collection({ openAlbum }) {
  const { albums, replaceCollection } = useCollection();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("name");
  const [transferMessage, setTransferMessage] = useState("");
  const fileInputRef = useRef(null);
  const albumCount = Object.keys(albums).length;
  const list = Object.values(albums)
    .filter((a) => filter === "all" || a.status === filter)
    .filter((a) => `${a.name} ${a.artist}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) =>
      sort === "rating" ? b.rating - a.rating
      : sort === "artist" ? a.artist.localeCompare(b.artist)
      : a.name.localeCompare(b.name)
    );
  const exportCollection = () => {
    const backup = new Blob([JSON.stringify(albums, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(backup);
    const link = document.createElement("a");
    link.href = url;
    link.download = `album-tracker-collection-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setTransferMessage(`${albumCount} album${albumCount === 1 ? "" : "s"} exported as a JSON backup.`);
  };
  const importCollection = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const incoming = JSON.parse(await file.text());
      if (albumCount > 0 && !window.confirm("Importing will replace your current collection. Continue?")) return;
      const count = replaceCollection(incoming);
      setTransferMessage(`${count} album${count === 1 ? "" : "s"} imported successfully.`);
    } catch (error) {
      setTransferMessage(error instanceof Error ? error.message : "Could not import that file.");
    } finally {
      event.target.value = "";
    }
  };
  return (
    <section className="page">
      <h2 className="page-title">My collection</h2>
      <div className="collection-transfer">
        <div>
          <h3>Collection backup</h3>
          <p>Export your saved albums as JSON, or import a backup on this browser.</p>
        </div>
        <div className="transfer-actions">
          <button className="secondary" onClick={exportCollection} disabled={albumCount === 0}>Export JSON</button>
          <input ref={fileInputRef} type="file" accept="application/json,.json" hidden onChange={importCollection} />
          <button className="secondary" onClick={() => fileInputRef.current?.click()}>Import JSON</button>
        </div>
      </div>
      {transferMessage && <p className="notice" role="status">{transferMessage}</p>}
      {albumCount === 0 ? (
        <p className="notice">Nothing saved yet. Open an album in Discover and choose Save to collection, or import a JSON backup.</p>
      ) : (
        <>
          <div className="filters">
            <div className="chips">
              {[{ id: "all", label: "All" }, ...STATUSES].map((s) => (
                <button key={s.id} className={`chip ${filter === s.id ? "on" : ""}`} onClick={() => setFilter(s.id)}>
                  {s.label}
                </button>
              ))}
            </div>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter by title or artist" aria-label="Filter collection" />
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by">
              <option value="name">Sort: title</option>
              <option value="artist">Sort: artist</option>
              <option value="rating">Sort: rating</option>
            </select>
          </div>
          {list.length === 0 && <p className="notice">No albums match those filters.</p>}
          <div className="grid">
            {list.map((a) => (
              <AlbumCard
                key={a.collectionId}
                title={a.name}
                artist={a.artist}
                art={a.artwork}
                meta={`${STATUSES.find((s) => s.id === a.status)?.label}${a.rating ? " · " + "★".repeat(a.rating) : ""}`}
                onOpen={() => openAlbum(a.collectionId)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

