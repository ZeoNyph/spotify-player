"use client";

import React, { useEffect, useState } from 'react';
import Player from '../components/player';
import { useSearchParams } from 'next/navigation';
import { FaSpotify } from 'react-icons/fa';
import { useRouter } from 'next/navigation';;
import { getCookie } from 'cookies-next/client';
export default function Home() {

  const router = useRouter();

  const params = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getToken() {
      const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
      if (params.has("code") && params.get("state") !== null) {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: client_id || "",
            grant_type: "authorization_code",
            code: params.get("code") || "",
            redirect_uri: window.location.origin + "/",
            code_verifier: getCookie("code_verifier") || ""
          })
        });
        if (response.ok) {
          await response.json().then((data) => {
            localStorage.setItem("access_token", data.access_token)
            localStorage.setItem("refresh_token", data.refresh_token)
            router.replace('/');
          }
          );
        }
      }
    }
    if (!localStorage.getItem("access_token") && !localStorage.getItem("refresh_token")) {
      getToken();
    }
    setIsLoading(false);
  }, [isLoading, params, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans gap-8">
      {!localStorage.getItem("access_token") && !localStorage.getItem("refresh_token") && (
        <h1 className="text-4xl font-bold mb-4">Spotify Player</h1>
      )}
      {!localStorage.getItem("access_token") && !localStorage.getItem("refresh_token") && (
        <a
          href="/login"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition mb-4 flex flex-row items-center gap-2"
        >
          <FaSpotify></FaSpotify>Login with Spotify
        </a>
      )}
      {localStorage.getItem("refresh_token") ? <>
        <Player />
      </> : null}
    </div>
  );
}
