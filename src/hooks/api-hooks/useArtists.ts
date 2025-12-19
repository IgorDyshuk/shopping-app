import { useQuery } from "@tanstack/react-query";

import { spotifyApi } from "@/api/spotify";
import type { SpotifyArtist } from "@/types/artist";

export const ARTISTS_QUERY_KEYS = {
  list: (ids: string[]) => ["spotify", "artists", "list", ...ids] as const,
  info: (id: string) => ["spotify", "artists", "info", id] as const,
};

export function useTopArtists(ids: string[]) {
  return useQuery<SpotifyArtist[]>({
    queryKey: ARTISTS_QUERY_KEYS.list(ids),
    queryFn: () => spotifyApi.getArtists(ids),
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 55,
    gcTime: 1000 * 60 * 120,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: (prev) => prev ?? [],
  });
}

export function useArtistInfo(id?: string) {
  return useQuery<SpotifyArtist>({
    queryKey: id ? ARTISTS_QUERY_KEYS.info(id) : ["spotify", "artists", "info"],
    queryFn: () => spotifyApi.getArtist(id as string),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 55,
    gcTime: 1000 * 60 * 120,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
