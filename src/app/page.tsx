'use server'

import React from 'react';
import { cookies } from 'next/headers'
import Player from './player';
export default async function Home() {
  const cookieStore = await cookies();


  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans">
      <h1 className="text-4xl font-bold mb-4">Spotify Player</h1>
      <Player isLoggedIn={cookieStore.has("access_token")}/>
    </div>
  );
}
