"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export interface WatchlistItem {
  tmdbId: number;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  type: 'movie' | 'tv';
  addedAt: string;
  updatedAt?: string;
  isWatched?: boolean;
  watchedEpisodes?: string[];
  inWatchlist?: boolean;
  inProgress?: boolean; 
}

interface ToggleData extends Partial<WatchlistItem> {
  forceUnwatch?: boolean;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  inProgressItems: WatchlistItem[]; // Nieuw: Voor snelle toegang op de Home-pagina
  addToWatchlist: (item: Omit<WatchlistItem, 'addedAt'>) => Promise<void>;
  removeFromWatchlist: (id: number | string, type: 'movie' | 'tv') => Promise<void>;
  isInWatchlist: (id: number | string) => boolean;
  toggleWatched: (id: number | string, movieData?: Partial<WatchlistItem>) => Promise<void>;
  isMovieWatched: (id: number | string) => boolean;
  toggleEpisodeWatched: (tvId: number, seasonNumber: number, episodeNumber: number) => Promise<void>;
  toggleAllEpisodesWatched: (tvId: number, movieData?: ToggleData) => Promise<void>;
  toggleSeasonWatched: (tvId: number, seasonNumber: number, seasonEpisodes: any[], markAsWatched: boolean) => Promise<void>;
  setMovieInProgress: (id: number | string, status: boolean, title?: string, posterPath?: string, type?: 'movie' | 'tv', voteAverage?: number) => Promise<void>;
  getWatchedEpisodesCount: (id: number | string) => number;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const { status } = useSession();
  const router = useRouter();
  const isLoggedIn = status === "authenticated";

  // Cache: Memoized lijst van items die 'in progress' zijn en nog niet volledig bekeken
  const inProgressItems = useMemo(() => {
    return watchlist
      .filter(item => (item.inProgress || (item.watchedEpisodes?.length ?? 0) > 0) && !item.isWatched)
      .sort((a, b) => new Date(b.updatedAt || b.addedAt).getTime() - new Date(a.updatedAt || a.addedAt).getTime());
  }, [watchlist]);

  const updateLocalItem = useCallback((updatedItem: any) => {
    setWatchlist(prev => {
      const index = prev.findIndex(i => String(i.tmdbId) === String(updatedItem.tmdbId) && i.type === updatedItem.type);
      if (index > -1) {
        const newWatchlist = [...prev];
        newWatchlist[index] = { ...updatedItem, tmdbId: Number(updatedItem.tmdbId) };
        return newWatchlist;
      } else {
        return [...prev, { ...updatedItem, tmdbId: Number(updatedItem.tmdbId) }];
      }
    });
  }, []);

  const isInWatchlist = useCallback((id: number | string) => {
    return watchlist.some(i => String(i.tmdbId) === String(id) && i.inWatchlist === true);
  }, [watchlist]);

  const isMovieWatched = useCallback((id: number | string) => {
    return watchlist.some(i => String(i.tmdbId) === String(id) && i.isWatched === true);
  }, [watchlist]);

  const getWatchedEpisodesCount = useCallback((id: number | string) => {
    const item = watchlist.find(i => String(i.tmdbId) === String(id) && i.type === 'tv');
    return item?.watchedEpisodes?.length || 0;
  }, [watchlist]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (isLoggedIn) {
        try {
          const res = await fetch('/api/watchlist', { cache: 'no-store' });
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
        updateLocalItem(newItem);
      }
    } catch (error) { console.error('Error adding to database:', error); }
  };

  const removeFromWatchlist = async (id: number | string, type: 'movie' | 'tv') => {
    if (!isLoggedIn) return;
    try {
      const res = await fetch('/api/watchlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tmdbId: String(id), type, inWatchlist: false }),
      });
      if (res.ok) {
        const updatedItem = await res.json();
        updateLocalItem(updatedItem);
      }
    } catch (error) { console.error('Error removing from database:', error); }
  };

  const toggleWatched = async (id: number | string, movieData?: Partial<WatchlistItem>) => {
    if (!isLoggedIn) return;
    const item = watchlist.find(i => String(i.tmdbId) === String(id) && i.type === 'movie');
    const newWatchedState = item ? !item.isWatched : true;

    try {
      const res = await fetch('/api/watchlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: String(id),
          type: 'movie',
          isWatched: newWatchedState,
          inProgress: false, // Altijd false als het afgekeken is
          ...movieData 
        }),
      });
      if (res.ok) {
        const updatedItem = await res.json();
        updateLocalItem(updatedItem);
      }
    } catch (error) { console.error('Error updating watched status:', error); }
  };

  const toggleEpisodeWatched = async (tvId: number, seasonNumber: number, episodeNumber: number) => {
    if (!isLoggedIn) return;
    const item = watchlist.find(i => String(i.tmdbId) === String(tvId) && i.type === 'tv');
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
          watchedEpisodes: newEpisodes,
          inProgress: newEpisodes.length > 0, // Automatisch in progress zetten
        }),
      });
      if (res.ok) {
        const updatedItem = await res.json();
        updateLocalItem(updatedItem);
      }
    } catch (error) { console.error('Error updating episodes:', error); }
  };

  const toggleAllEpisodesWatched = async (tvId: number, movieData?: ToggleData) => {
    if (!isLoggedIn) return;
    const { forceUnwatch, ...cleanMovieData } = movieData || {};
    const newWatchedState = forceUnwatch !== undefined ? !forceUnwatch : true;

    try {
      let allEpisodeKeys: string[] = [];
      if (newWatchedState) {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const res = await fetch(`https://api.themoviedb.org/3/tv/${tvId}?api_key=${apiKey}`);
        const tvData = await res.json();
        tvData.seasons?.forEach((season: any) => {
          if (season.season_number > 0) {
            for (let i = 1; i <= season.episode_count; i++) {
              allEpisodeKeys.push(`${season.season_number}-${i}`);
            }
          }
        });
      }

      const patchRes = await fetch('/api/watchlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: String(tvId),
          type: 'tv',
          watchedEpisodes: allEpisodeKeys,
          isWatched: newWatchedState,
          inProgress: false,
          ...cleanMovieData
        }),
      });
      if (patchRes.ok) {
        const updatedItem = await patchRes.json();
        updateLocalItem(updatedItem);
      }
    } catch (error) { console.error('Error toggling all episodes:', error); }
  };

  const toggleSeasonWatched = async (tvId: number, seasonNumber: number, seasonEpisodes: any[], markAsWatched: boolean) => {
    if (!isLoggedIn) return;
    const item = watchlist.find(i => String(i.tmdbId) === String(tvId) && i.type === 'tv');
    if (!item) return;

    const currentEpisodes = item.watchedEpisodes || [];
    const seasonKeys = seasonEpisodes.map(ep => `${seasonNumber}-${ep.episode_number}`);
    const newEpisodes = markAsWatched 
      ? Array.from(new Set([...currentEpisodes, ...seasonKeys]))
      : currentEpisodes.filter(epKey => !seasonKeys.includes(epKey));

    try {
      const res = await fetch('/api/watchlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tmdbId: String(tvId), type: 'tv', watchedEpisodes: newEpisodes, inProgress: newEpisodes.length > 0 }),
      });
      if (res.ok) {
        const updatedItem = await res.json();
        updateLocalItem(updatedItem);
      }
    } catch (error) { console.error('Error updating season status:', error); }
  };

  const setMovieInProgress = async (id: number | string, inProgressStatus: boolean, title?: string, posterPath?: string, type: 'movie' | 'tv' = 'tv', voteAverage?: number) => {
    if (!isLoggedIn) return;
    try {
      const res = await fetch('/api/watchlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tmdbId: String(id), type, inProgress: inProgressStatus, title, posterPath, voteAverage }),
      });
      if (res.ok) {
        const updatedItem = await res.json();
        updateLocalItem(updatedItem);
      }
    } catch (error) { console.error('Error in setMovieInProgress:', error); }
  };

  return (
    <WatchlistContext.Provider value={{ 
      watchlist, inProgressItems, addToWatchlist, removeFromWatchlist, isInWatchlist, 
      toggleWatched, isMovieWatched, toggleEpisodeWatched,
      toggleAllEpisodesWatched, toggleSeasonWatched, setMovieInProgress,
      getWatchedEpisodesCount
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