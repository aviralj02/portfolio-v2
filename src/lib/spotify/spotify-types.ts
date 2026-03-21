export interface SpotifyData {
  isPlaying: boolean;
  title?: string;
  album?: string;
  artist?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

export type Artist = Partial<{
  name: string;
  [key: string]: string;
}>;
