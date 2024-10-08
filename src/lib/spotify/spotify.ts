import "server-only";

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN!;

const token = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const authToken: {
  accessToken: string | null;
  tokenExpiry: number | null;
} = {
  accessToken: null,
  tokenExpiry: null,
};

const getAccessToken = async () => {
  if (
    authToken.accessToken &&
    authToken.tokenExpiry &&
    Date.now() < authToken.tokenExpiry
  ) {
    return { access_token: authToken.accessToken };
  }

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
    cache: "no-store",
  });

  const data = await res.json();

  authToken.accessToken = data.access_token;
  authToken.tokenExpiry = Date.now() + data.expires_in * 1000;

  return { access_token: authToken.accessToken };
};

export const getNowPlaying = async () => {
  const { access_token } = await getAccessToken();

  const res = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: {
      revalidate: 30,
    },
  });

  const data = await res.json();

  return { res, data };
};
