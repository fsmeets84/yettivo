"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface CollectionItem {
  tmdbId: number;
  title: string;
  posterPath: string;
  type: "movie" | "tv";
  voteAverage: number;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  items: CollectionItem[];
}

interface CollectionContextType {
  collections: Collection[];
  // Gewijzigd van void naar Collection om de nieuwe ID terug te kunnen geven
  createCollection: (name: string, description: string) => Collection; 
  deleteCollection: (id: string) => void;
  addItemToCollection: (collectionId: string, item: CollectionItem) => void;
  removeItemFromCollection: (collectionId: string, tmdbId: number) => void;
  getCollectionById: (id: string) => Collection | undefined;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [collections, setCollections] = useState<Collection[]>([]);

  // Laad collecties uit localStorage
  useEffect(() => {
    if (session?.user) {
      const savedCollections = localStorage.getItem(`collections_${session.user.email}`);
      if (savedCollections) {
        setCollections(JSON.parse(savedCollections));
      }
    }
  }, [session]);

  // Sla wijzigingen op
  useEffect(() => {
    if (session?.user) {
      localStorage.setItem(`collections_${session.user.email}`, JSON.stringify(collections));
    }
  }, [collections, session]);

  const createCollection = (name: string, description: string): Collection => {
    const newCollection: Collection = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      createdAt: Date.now(),
      items: [],
    };
    
    setCollections((prev) => [...prev, newCollection]);
    
    // Return de collectie zodat de UI (modal) direct de ID heeft
    return newCollection; 
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  };

  const addItemToCollection = (collectionId: string, item: CollectionItem) => {
    setCollections((prev) =>
      prev.map((col) => {
        if (col.id === collectionId) {
          if (col.items.some((i) => i.tmdbId === item.tmdbId)) return col;
          return { ...col, items: [...col.items, item] };
        }
        return col;
      })
    );
  };

  const removeItemFromCollection = (collectionId: string, tmdbId: number) => {
    setCollections((prev) =>
      prev.map((col) => {
        if (col.id === collectionId) {
          return { ...col, items: col.items.filter((i) => i.tmdbId !== tmdbId) };
        }
        return col;
      })
    );
  };

  const getCollectionById = (id: string) => {
    return collections.find((c) => c.id === id);
  };

  return (
    <CollectionContext.Provider
      value={{
        collections,
        createCollection,
        deleteCollection,
        addItemToCollection,
        removeItemFromCollection,
        getCollectionById,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollections() {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error("useCollections must be used within a CollectionProvider");
  }
  return context;
}