import { getPlaylists, playPause } from "@/app/spotify";
import { Playlist, PlaylistRequest } from "@/app/types";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight, FaPlay } from "react-icons/fa6";
import { ScaleLoader } from "react-spinners";

export default function Playlists() {
    const playlistInfo = useRef<PlaylistRequest | null>(null);

    useEffect(() => {
        (async () => {
            playlistInfo.current = await getPlaylists(10, 0);
        })();
    }, []);

    async function startPlaylist(e: React.MouseEvent<HTMLButtonElement>) {
        await playPause({ isPlay: true, uri: e.currentTarget.value })
    }

    return (
        <div className="absolute inset-x-0 top-full mt-10 mb-5 flex flex-col justify-baseline gap-2 px-6">
            <div className="flex flex-row justify-between">
                <h1 className="text-2xl font-bold text-left pl-2">Playlists</h1>
                <div>
                    <button
                        className="px-4 py-2 mr-2 bg-green-700 hover: text-white rounded-full disabled:bg-gray-700 disabled:opacity-50"
                        disabled={!playlistInfo.current || playlistInfo.current.offset === 0}
                        onClick={async () => {
                            if (!playlistInfo.current) return;
                            playlistInfo.current = await getPlaylists(10, Math.max(0, playlistInfo.current.offset - 10));
                        }}
                    >
                        <FaArrowLeft />
                    </button>
                    <button
                        className="px-4 py-2 bg-green-700 text-white rounded-full disabled:bg-gray-700 disabled:opacity-50"
                        disabled={
                            !playlistInfo.current ||
                            playlistInfo.current.offset + playlistInfo.current.limit >= playlistInfo.current.total
                        }
                        onClick={async () => {
                            if (!playlistInfo.current) return;
                            playlistInfo.current = await getPlaylists(10, playlistInfo.current.offset + 10);
                        }}
                    >
                        <FaArrowRight />
                    </button>
                </div>
            </div>
            {playlistInfo.current === null && <div className={"flex flex-col items-center gap-3"}>
                <ScaleLoader color="#ffffff" />
                <p>Loading...</p>
            </div>}
            {playlistInfo.current !== null ? playlistInfo.current?.items?.map((item: Playlist) => (
                <div key={item.id} className="py-2 border-gray-800 border-b pb-2 last:border-0">
                    <div className="flex flex-row items-center justify-baseline text-left gap-8">
                        <Image src={item.images[0].url} alt={item.name} height={640} width={640} className="size-24 md:size-32 rounded-xl" priority={true} />
                        <div className="flex flex-col">
                            <p className="text-l font-bold">{item.name}</p>
                            <p className="text-m font-light text-gray-400">{item.owner.display_name}</p>
                        </div>
                        <button id={item.id} value={item.uri} onClick={startPlaylist} className="rounded-full bg-green-700 hover:bg-green-400 hover:text-gray-800 p-3 flex flex-row items-center gap-2 group transition-colors duration-200 cursor-pointer ml-auto"> <FaPlay className="text-white text-2xl group-hover:text-gray-800 transition-colors duration-200" />Play</button>
                    </div>
                </div>
            )) : null}
            <div className="mt-2 mb-5">
                <button
                    className="px-4 py-2 mr-2 bg-green-700 hover: text-white rounded-full disabled:bg-gray-700 disabled:opacity-50"
                    disabled={!playlistInfo.current || playlistInfo.current.offset === 0}
                    onClick={async () => {
                        if (!playlistInfo.current) return;
                        playlistInfo.current = await getPlaylists(10, Math.max(0, playlistInfo.current.offset - 10));
                    }}
                >
                    <FaArrowLeft />
                </button>
                <button
                    className="px-4 py-2 bg-green-700 text-white rounded-full disabled:bg-gray-700 disabled:opacity-50"
                    disabled={
                        !playlistInfo.current ||
                        playlistInfo.current.offset + playlistInfo.current.limit >= playlistInfo.current.total
                    }
                    onClick={async () => {
                        if (!playlistInfo.current) return;
                        playlistInfo.current = await getPlaylists(10, playlistInfo.current.offset + 10);
                    }}
                >
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
}