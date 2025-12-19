export type SpotifyImage = {
  url: string;
  width: number;
  height: number;
};

export type SpotifyArtist = {
  id: string;
  name: string;
  genres?: string[];
  images?: SpotifyImage[];
  popularity?: number;
  followers?: { total: number };
  external_urls?: { spotify?: string };
  uri?: string;
};
