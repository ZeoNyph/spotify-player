'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import { Root } from "./types";
import { ScaleLoader } from "react-spinners";

export default function Player() {

    const [playerInfo, setPlayerInfo] = useState<Root | null>(null);

    async function getPlayerInfo() {
            const response = await fetch("https://api.spotify.com/v1/me/player", {
                headers: {
                    "authorization": "Bearer " + localStorage.getItem("access_token")
                },
                method: "GET"
            });
            if (response.status === 204) {
                setPlayerInfo(null);
            } else {
                const data = await response.json();
                setPlayerInfo(data);
            }
        }

    useEffect(() => {
        setInterval(getPlayerInfo, 1000);
    }, []);

    return (
        <>
        {playerInfo === null ? <ScaleLoader /> : <div className="flex flex-col">
            <div className="flex flex-row items-center gap-6 font-sans">
                {playerInfo?.item?.album?.images && playerInfo.item.album.images.length > 1 && (
                    <Image
                        src={playerInfo.item.album.images[1].url}
                        alt="Album cover"
                        width={playerInfo.item.album.images[1].width}
                        height={playerInfo.item.album.images[1].height}
                        className="size-64 rounded-3xl border-2 border-white p-2"
                    />
                )}
                <div className="flex flex-col items-center gap-4">
                    {playerInfo?.item?.name && (
                        <h1 className="text-xl font-bold">{playerInfo.item.name}</h1>
                    )}
                    {playerInfo?.item?.album?.artists && playerInfo.item.album.artists.length > 0 && (
                        <h1>{playerInfo.item.album.artists[0].name}</h1>
                    )}
                </div>
            </div>
            <div>
                {playerInfo?.progress_ms && playerInfo?.item?.duration_ms && (
                    <progress value={playerInfo.progress_ms / playerInfo.item.duration_ms} max={1} />
                )}
            </div>
        </div>}
        </>
    );
}