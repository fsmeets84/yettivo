"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export interface WatchlistItem {
  tmdbId: number;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  type: 'movie' | 'tv';
  addedAt: string;
  isWatched?: boolean;
  watchedEpisodes?: string[];
  inWatchlist?: boolean;
}

interface ToggleData extends Partial<WatchlistItem> {
  forceUnwatch?: boolean;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: Omit<WatchlistItem, 'addedAt'>) => Promise<void>;
  removeFromWatchlist: (id: number | string, type: 'movie' | 'tv') => Promise<void>;
  isInWatchlist: (id: number | string) => boolean;
  toggleWatched: (id: number | string, movieData?: Partial<WatchlistItem>) => Promise<void>;
  isMovieWatched: (id: number | string) => boolean;
  toggleEpisodeWatched: (tvId: number, seasonNumber: number, episodeNumber: number) => Promise<void>;
  toggleAllEpisodesWatched: (tvId: number, movieData?: ToggleData) => Promise<void>;
  // Nieuwe bulk functie toegevoegd aan de interface
  toggleSeasonWatched: (tvId: number, seasonNumber: number, seasonEpisodes: any[], markAsWatched: boolean) => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const { status } = useSession();
  const router = useRouter();
  const isLoggedIn = status === "authenticated";

  const isInWatchlist = useCallback((id: number | string) => {
    return watchlist.some(i => String(i.tmdbId) === String(id) && i.inWatchlist !== false);
  }, [watchlist]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (isLoggedIn) {
        try {
          const res = await fetch('/api/watchlist');
          if (res.ok) {
            const data = await res.json();
            const formattedData = data.map((item: any) => ({
              ...item,
              tmdbId: Number(item.tmdbId)
            }));
            setWatchlist(formattedData);
          }
        } catch (error) {
          console.error('Failed to fetch watchlist:', error);
        }
      } else if (status === "unauthenticated") {
        setWatchlist([]);
      }
    };
    fetchWatchlist();
  }, [isLoggedIn, status]);

  const addToWatchlist = async (item: Omit<WatchlistItem, 'addedAt'>) => {
    if (!isLoggedIn) {
      router.push("/auth/signin");
      return;
    }

    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, tmdbId: String(item.tmdbId), inWatchlist: true }),
      });

      if (res.ok) {
        const newItem = await res.json();
        setWatchlist(prev => {
          const filtered = prev.filter(i => String(i.tmdbId) !== String(item.tmdbId));
          return [...filtered, { ...newItem, tmdbId: Number(newItem.tmdbId) }];
        });
      }
    } catch (error) {
      console.error('Error adding to database:', error);
    }
  };

  const removeFromWatchlist = async (id: number | string, type: 'movie' | 'tv') => {
    if (!isLoggedIn) return;
    try {
      const res = await fetch(`/api/watchlist?tmdbId=${String(id)}&type=${type}`, { method: 'DELETE' });
      if (res.ok) {
        setWatchlist(prev => prev.filter(i => String(i.tmdbId) !== String(id)));
      }
    } catch (error) { 
      console.error('Error removing from database:', error); 
    }
  };

  const toggleWatched = async (id: number | string, movieData?: Partial<WatchlistItem>) => {
    if (!isLoggedIn) {
      router.push("/auth/signin");
      return;
    }

    const item = watchlist.find(i => String(i.tmdbId) === String(id));
    const newWatchedState = item ? !item.isWatched : true;

    try {
      const res = await fetch('/api/watchlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: String(id),
          type: 'movie',
          isWatched: newWatchedState,
          ...movieData 
        }),
      });

      if (res.ok) {
        const updatedItem = await res.json();
        setWatchlist(prev => {
          const exists = prev.some(i => String(i.tmdbId) === String(id));
          if (exists) {
            return prev.map(i => String(i.tmdbId) === String(id) ? { ...i, isWatched: newWatchedState } : i);
          }
          return [...prev, { ...updatedItem, tmdbId: Number(updatedItem.tmdbId) }];
        });
      }
    } catch (error) {
      console.error('Error updating watched status:', error);
    }
  };

  const isMovieWatched = (id: number | string) => {
    const item = watchlist.find(i => String(i.tmdbId) === String(id));
    if (!item) return false;
    return !!item.isWatched;
  };

  const toggleEpisodeWatched = async (tvId: number, seasonNumber: number, episodeNumber: number) => {
    if (!isLoggedIn) return;
    const item = watchlist.find(i => String(i.tmdbId) === String(tvId));
    if (!item) return;

    const epKey = `${seasonNumber}-${episodeNumber}`;
    const currentEpisodes = item.watchedEpisodes || [];
    const newEpisodes = currentEpisodes.includes(epKey)
      ? currentEpisodes.filter(e => e !== epKey)
      : [...currentEpisodes, epKey];

    try {
      const res = await fetch('/api/watchlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: String(tvId),
          type: 'tv',
          watchedEpisodes: newEpisodes
        }),
      });

      if (res.ok) {
        setWatchlist(prev => prev.map(i => 
          String(i.tmdbId) === String(tvId) ? { ...i, watchedEpisodes: newEpisodes } : i
        ));
      }
    } catch (error) { 
      console.error('Error updating episodes:', error); 
    }
  };

  // --- NIEUWE FUNCTIE: Bulk update voor een heel seizoen ---
  const toggleSeasonWatched = async (tvId: number, seasonNumber: number, seasonEpisodes: any[], markAsWatched: boolean) => {
    if (!isLoggedIn) return;
    const item = watchlist.find(i => String(i.tmdbId) === String(tvId));
    if (!item) return;

    const currentEpisodes = item.watchedEpisodes || [];
    const seasonKeys = seasonEpisodes.map(ep => `${seasonNumber}-${ep.episode_number}`);
    
    let newEpisodes: string[];
    if (markAsWatched) {
      // Voeg alle afleveringen van dit seizoen toe, voorkom dubbelen
      newEpisodes = Array.from(new Set([...currentEpisodes, ...seasonKeys]));
    } else {
      // Verwijder alle afleveringen van dit seizoen uit de lijst
      newEpisodes = currentEpisodes.filter(epKey => !seasonKeys.includes(epKey));
    }

    try {
      const res = await fetch('/api/watchlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: String(tvId),
          type: 'tv',
          watchedEpisodes: newEpisodes
        }),
      });

      if (res.ok) {
        setWatchlist(prev => prev.map(i => 
          String(i.tmdbId) === String(tvId) ? { ...i, watchedEpisodes: newEpisodes } : i
        ));
      }
    } catch (error) {
      console.error('Error updating season status:', error);
    }
  };

  const toggleAllEpisodesWatched = async (tvId: number, movieData?: ToggleData) => {
    if (!isLoggedIn) {
      router.push("/auth/signin");
      return;
    }

    const { forceUnwatch, ...cleanMovieData } = movieData || {};
    const newWatchedState = !forceUnwatch;

    try {
      let allEpisodeKeys: string[] = [];
      if (!forceUnwatch) {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const res = await fetch(`https://api.themoviedb.org/3/tv/${tvId}?api_key=${apiKey}`);
        const tvData = await res.json();

        if (tvData.seasons) {
          tvData.seasons.forEach((season: any) => {
            if (season.season_number > 0) {
              for (let i = 1; i <= season.episode_count; i++) {
                allEpisodeKeys.push(`${season.season_number}-${i}`);
              }
            }
          });
        }
      }

      const patchRes = await fetch('/api/watchlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: String(tvId),
          type: 'tv',
          watchedEpisodes: allEpisodeKeys,
          isWatched: newWatchedState,
          ...cleanMovieData
        }),
      });

      if (patchRes.ok) {
        const updatedItem = await patchRes.json();
        setWatchlist(prev => {
          const exists = prev.some(i => String(i.tmdbId) === String(tvId));
          if (exists) {
            return prev.map(i => 
              String(i.tmdbId) === String(tvId) 
                ? { ...i, watchedEpisodes: allEpisodeKeys, isWatched: newWatchedState } 
                : i
            );
          }
          return [...prev, { ...updatedItem, tmdbId: Number(updatedItem.tmdbId) }];
        });
      }
    } catch (error) {
      console.error('Error toggling all episodes:', error);
    }
  };

  return (
    <WatchlistContext.Provider value={{ 
      watchlist, 
      addToWatchlist, 
      removeFromWatchlist, 
      isInWatchlist, 
      toggleWatched, 
      isMovieWatched, 
      toggleEpisodeWatched,
      toggleAllEpisodesWatched,
      toggleSeasonWatched // Nieuwe functie beschikbaar maken
    }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) throw new Error('useWatchlist must be used within a WatchlistProvider');
  return context;
}