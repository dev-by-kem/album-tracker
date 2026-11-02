import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";
const CollectionContext = createContext();
const VALID_STATUSES = new Set(["wishlist", "listening", "listened"]);
export const useCollection = () => useContext(CollectionContext);

function normalizeImportedCollection(candidate) {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    throw new Error("Choose a valid Album Tracker JSON backup.");
  }
  const imported = {};
  Object.entries(candidate).forEach(([key, album]) => {
    if (!album || typeof album !== "object" || Array.isArray(album)) return;
    const collectionId = String(album.collectionId ?? key).trim();
    const name = String(album.name ?? "").trim();
    const artist = String(album.artist ?? "").trim();
    if (!collectionId || !name || !artist) return;
    imported[collectionId] = {
      collectionId,
      name,
      artist,
      artwork: String(album.artwork ?? ""),
      year: String(album.year ?? "").slice(0, 4),
      status: VALID_STATUSES.has(album.status) ? album.status : "wishlist",
      rating: Math.min(5, Math.max(0, Math.round(Number(album.rating) || 0))),
      notes: String(album.notes ?? "").slice(0, 2000),
    };
  });
  if (Object.keys(imported).length === 0) {
    throw new Error("This file does not contain any valid saved albums.");
  }
  return imported;
}

export function CollectionProvider({ children }) {
  const [albums, setAlbums] = useLocalStorage("album-tracker:collection", {});
  const save = (album, status = "wishlist") =>
    setAlbums((prev) => ({
      ...prev,
      [album.collectionId]: {
        collectionId: album.collectionId,
        name: album.collectionName,
        artist: album.artistName,
        artwork: album.artworkUrl100,
        year: album.releaseDate?.slice(0, 4),
        status,
        rating: 0,
        notes: "",
      },
    }));
  const update = (id, patch) =>
    setAlbums((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  const remove = (id) =>
    setAlbums((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  const replaceCollection = (candidate) => {
    const imported = normalizeImportedCollection(candidate);
    setAlbums(imported);
    return Object.keys(imported).length;
  };
  return (
    <CollectionContext.Provider value={{ albums, save, update, remove, replaceCollection }}>
      {children}
    </CollectionContext.Provider>
  );
}
