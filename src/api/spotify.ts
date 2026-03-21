import axios from "axios";

import { TOP_BLOGGERS } from "@/constants/blogger-ids";
import type { SpotifyArtist } from "@/types/artist";

const SPOTIFY_CLIENT_ID =
  import.meta.env.VITE_SPOTIFY_CLIENT_ID || "c6ef5ee4eb6749839c8ed71e02011c0b";
const SPOTIFY_CLIENT_SECRET =
  import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || "f8679e09813c42f7b94807c026f40d31";
const SPOTIFY_ACCESS_TOKEN = import.meta.env.VITE_SPOTIFY_ACCESS_TOKEN || "";

type TokenCache = {
  accessToken: string;
  expiresAt: number;
};

const tokenEndpoint = "https://accounts.spotify.com/api/token";
const apiBaseUrl = "https://api.spotify.com/v1";
const premiumRequiredMessage =
  "active premium subscription required for the owner of the app";

let tokenCache: TokenCache | null = null;

const buildFallbackArtist = (id: string, name: string): SpotifyArtist => {
  const encodedName = encodeURIComponent(name);
  return {
    id,
    name,
    images: [
      {
        url: `https://placehold.co/1024x1024/111827/ffffff?text=${encodedName}`,
        width: 1024,
        height: 1024,
      },
    ],
    genres: [],
    followers: { total: 0 },
    popularity: 0,
    external_urls: { spotify: `https://open.spotify.com/artist/${id}` },
    uri: `spotify:artist:${id}`,
  };
};

const fallbackArtistsMap = new Map(
  TOP_BLOGGERS.map(({ id, name }) => [id, buildFallbackArtist(id, name)]),
);

const getFallbackArtistById = (id: string): SpotifyArtist =>
  fallbackArtistsMap.get(id) ?? buildFallbackArtist(id, "Artist");

const isPremiumRequiredError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false;
  const data = error.response?.data as
    | { message?: string; error?: { message?: string } }
    | undefined;
  const message = `${data?.message ?? ""} ${data?.error?.message ?? ""}`
    .toLowerCase()
    .trim();
  return message.includes(premiumRequiredMessage);
};

const logSpotifyFallback = (scope: "artist" | "artists", error: unknown) => {
  if (!import.meta.env.DEV) return;
  const reason = isPremiumRequiredError(error)
    ? "premium-required"
    : "spotify-request-failed";
  console.warn(`[Spotify][fallback:${scope}]`, {
    reason,
    error,
  });
};

async function getSpotifyToken(): Promise<string> {
  if (SPOTIFY_ACCESS_TOKEN) return SPOTIFY_ACCESS_TOKEN;
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt - now > 10_000) {
    return tokenCache.accessToken;
  }

  const token = await fetchClientCredentialsToken();
  tokenCache = token;
  return token.accessToken;
}

async function fetchClientCredentialsToken(): Promise<TokenCache> {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error("Missing Spotify client id/secret env variables.");
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
  });

  const basicAuth = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);

  const res = await axios.post<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }>(tokenEndpoint, body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
  });

  const expiresAt = Date.now() + res.data.expires_in * 1000;
  return { accessToken: res.data.access_token, expiresAt };
}

export const spotifyApi = {
  getArtist: async (id: string) => {
    try {
      const token = await getSpotifyToken();
      const res = await axios.get<SpotifyArtist>(`${apiBaseUrl}/artists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      logSpotifyFallback("artist", error);
      return getFallbackArtistById(id);
    }
  },

  getArtists: async (ids: string[]) => {
    if (!ids.length) return [];
    try {
      const token = await getSpotifyToken();
      const res = await axios.get<{ artists: SpotifyArtist[] }>(
        `${apiBaseUrl}/artists`,
        {
          params: { ids: ids.join(",") },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.artists;
    } catch (error) {
      logSpotifyFallback("artists", error);
      return ids.map((id) => getFallbackArtistById(id));
    }
  },
};
