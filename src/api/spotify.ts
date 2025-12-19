import axios from "axios";

import type { SpotifyArtist } from "@/types/artist";

const SPOTIFY_CLIENT_ID = "c6ef5ee4eb6749839c8ed71e02011c0b";
const SPOTIFY_CLIENT_SECRET = "f8679e09813c42f7b94807c026f40d31";

type TokenCache = {
  accessToken: string;
  expiresAt: number;
};

const tokenEndpoint = "https://accounts.spotify.com/api/token";
const apiBaseUrl = "https://api.spotify.com/v1";

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
    const token = await fetchClientCredentialsToken();

    const res = await axios.get<SpotifyArtist>(`${apiBaseUrl}/artists/${id}`, {
      headers: { Authorization: `Bearer ${token.accessToken}` },
    });
    return res.data;
  },

  getArtists: async (ids: string[]) => {
    if (!ids.length) return [];
    const token = await fetchClientCredentialsToken();

    const res = await axios.get<{ artists: SpotifyArtist[] }>(
      `${apiBaseUrl}/artists`,
      {
        params: { ids: ids.join(",") },
        headers: { Authorization: `Bearer ${token.accessToken}` },
      }
    );
    return res.data.artists;
  },
};
