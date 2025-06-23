Simple Spotify controller made using [Next.js](https://nextjs.org) and bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

NOTE: Due to limitations with how the Spotify API works, you will have to sign up at [Spotify for Developers](https://developer.spotify.com/) to get your own client ID.

## Features

- Play, pause, and skip music being played on any Spotify instance.
- View info on currently playing song
- Switch between available Spotify devices


![alt text](img/image.png)

## Getting Started

1. Log in to [Spotify for Developers](https://developer.spotify.com/) and in the (dashboard)[https://developer.spotify.com/dashboard], create a new app, making sure to set the Redirect URI as `http://127.0.0.1:3000/`.
2. Clone the repository, and in the root folder, create a .env file; this is where the client ID and redirect URL are stored for use within the application. Add them in the following manner:
  - NEXT_PUBLIC_SPOTIFY_CLIENT_ID={ID}
  - NEXT_PUBLIC_SPOTIFY_REDIR_URL=http://127.0.0.1:3000/
3. Install dependencies using your package manager of choice (`pnpm install` or `npm install`, for example).
4. Run app using:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
