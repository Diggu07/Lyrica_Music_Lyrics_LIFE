import { useState, useEffect } from 'react';

// Interfaces mapping backend models to UI representations
export interface ArtistSearchResult {
  artistId: string;
  name: string;
  genres: string[];
  cover: string;
  banner: string;
  bio: string;
  popularity: number;
  country?: string;
  nationality?: string;
  activeYears?: string;
}

export function useArtistSearch(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [results, setResults] = useState<ArtistSearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [queued, setQueued] = useState(false);

  // Debounce the input query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Fetch from /search and /suggest endpoints
  useEffect(() => {
    let isMounted = true;
    const trimmed = debouncedQuery.trim();

    if (!trimmed) {
      setResults([]);
      setSuggestions([]);
      setQueued(false);
      return;
    }

    setLoading(true);

    const promises: Promise<any>[] = [];

    // 1. Fetch Search results
    const searchPromise = fetch(`/api/artists/search?q=${encodeURIComponent(trimmed)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Search failed');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setResults(data.results || []);
          setQueued(data.queued || false);
        }
      })
      .catch((err) => console.error('[useArtistSearch] Search error:', err));
    promises.push(searchPromise);

    // 2. Fetch autocomplete suggestions (requires 2+ characters)
    if (trimmed.length >= 2) {
      const suggestPromise = fetch(`/api/artists/search/suggest?q=${encodeURIComponent(trimmed)}`)
        .then((res) => {
          if (!res.ok) throw new Error('Suggest failed');
          return res.json();
        })
        .then((data) => {
          if (isMounted) {
            setSuggestions(data.suggestions || []);
          }
        })
        .catch((err) => console.error('[useArtistSearch] Suggest error:', err));
      promises.push(suggestPromise);
    } else {
      setSuggestions([]);
    }

    Promise.all(promises).finally(() => {
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  return { results, suggestions, loading, queued };
}

export function useArtistPulse() {
  const [pulseData, setPulseData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const fetchPulse = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/artists/pulse');
      if (res.ok) {
        const data = await res.json();
        setPulseData(data);
      }
    } catch (err) {
      console.error('[useArtistPulse] Pulse error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPulse();
    let id = setInterval(fetchPulse, 60_000);

    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(id);
      } else {
        fetchPulse();
        id = setInterval(fetchPulse, 60_000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return { pulseData, loading, refetch: fetchPulse };
}

export interface DiscoveryData {
  trending: any[];
  popular_in_india: any[];
  mood_categories: Record<string, any[]>;
  quotes_wall: any[];
}

export function useDiscovery() {
  const [discoveryData, setDiscoveryData] = useState<DiscoveryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscovery = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/artists/discovery');
      if (!res.ok) throw new Error('Failed to fetch discovery data');
      const data = await res.json();
      setDiscoveryData(data);
    } catch (err: any) {
      console.error('[useDiscovery] Discovery fetch error:', err);
      setError(err.message || 'Fetch error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscovery();
  }, []);

  return { discoveryData, loading, error, refetch: fetchDiscovery };
}
