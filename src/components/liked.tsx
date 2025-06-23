import { getLikedSongs, playPause } from "@/app/spotify";
import { Item, LikedSongsRequest } from "@/app/types";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight, FaPlay } from "react-icons/fa6";
import { ScaleLoader } from "react-spinners";

export default function LikedSongs() {
    const songsInfo = useRef<LikedSongsRequest | null>(null);


    useEffect(() => {
        (async () => {
            songsInfo.current = await getLikedSongs(5, 0);
        })();
    }, []);

    async function startSong(songURI: string) {
        await playPause({ isPlay: true, collectionURI: "spotify:collection:tracks", songURI: songURI })
    }
    return (
        <div className="mt-10 mb-5 flex flex-col justify-baseline gap-2 px-6">
            <div className="flex flex-col md:flex-row justify-between gap-2">
                <h1 className="text-2xl font-bold text-center md:text-left pl-2">Liked Songs</h1>
                <div>
                    <button
                        className="px-4 py-2 mr-2 bg-green-700 hover: text-white rounded-full disabled:bg-gray-700 disabled:opacity-50"
                        disabled={!songsInfo.current || songsInfo.current.offset === 0}
                        onClick={async () => {
                            if (!songsInfo.current) return;
                            songsInfo.current = await getLikedSongs(5, Math.max(0, songsInfo.current.offset - 5));
                        }}
                    >
                        <FaArrowLeft />
                    </button>
                    <button
                        className="px-4 py-2 bg-green-700 text-white rounded-full disabled:bg-gray-700 disabled:opacity-50"
                        disabled={
                            !songsInfo.current ||
                            songsInfo.current.offset + songsInfo.current.limit >= songsInfo.current.total
                        }
                        onClick={async () => {
                            if (!songsInfo.current) return;
                            songsInfo.current = await getLikedSongs(5, songsInfo.current.offset + 5);
                        }}
                    >
                        <FaArrowRight />
                    </button>
                </div>
            </div>
            {songsInfo.current === null && <div className={"flex flex-col items-center gap-3"}>
                <ScaleLoader color="#ffffff" />
                <p>Loading...</p>
            </div>}
            {songsInfo.current !== null ? songsInfo.current?.items?.map((item: Item) => (
                <div key={item.track.uri} className="py-2 border-gray-800 border-b pb-2 last:border-0">
                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-baseline text-center md:text-left gap-8">
                        <Image src={item.track.album.images[1].url} alt={item.track.name} height={640} width={640} className="size-24 md:size-32 rounded-xl hover:opacity-65 hover:border-2 hover:border-white hover:p-1 transition-all duration-200" priority={true} />
                        <div className="flex flex-col">
                            <p className="text-l font-bold">{item.track.name}</p>
                            <p className="text-m font-light text-gray-400">{item.track.artists.map((artist) => artist.name).join(", ")}</p>
                        </div>
                        <button value={item.track.album.uri} onClick={() => { startSong(item.track.uri) }} className="rounded-full bg-green-700 hover:bg-green-400 hover:text-gray-800 p-3 flex flex-row items-center gap-2 group transition-colors duration-200 cursor-pointer md:ml-auto"> <FaPlay className="text-white text-2xl group-hover:text-gray-800 transition-colors duration-200" />Play</button>
                    </div>
                </div>
            )) : null}
        </div>
    );
}