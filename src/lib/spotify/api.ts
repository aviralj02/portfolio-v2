import "server-only";

import { getNowPlaying } from "./spotify";

export const fetchSpotifyData = async (): Promise<SpotifyData> => {
  try {
    const { res: spotifyResponse, data } = await getNowPlaying();

    if (
      spotifyResponse.status === 204 ||
      spotifyResponse.status > 400 ||
      data.currently_playing_type !== "track"
    ) {
      return { isPlaying: false };
    }

    const spotifyData: SpotifyData = {
      isPlaying: data.is_playing,
      title: data.item.name,
      album: data.item.album.name,
      artist: data.item.album.artists
        .map((artist: Artist) => artist.name)
        .join(", "),
      albumImageUrl: data.item.album.images[0].url,
      songUrl: data.item.external_urls.spotify,
    };

    return spotifyData;
  } catch (error) {
    console.log(error);
    return { isPlaying: false };
  }
};
