import { getPlaylists, playPause } from "@/app/spotify";
import { Playlist, PlaylistsRequest } from "@/app/types";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaArrowLeft, FaArrowRight, FaPlay } from "react-icons/fa6";
import { ScaleLoader } from "react-spinners";
import PlaylistModal from "./modals/playlist";

type PlaylistProps = {
    showPlaylist: boolean,
    setShowPlaylist: Dispatch<SetStateAction<boolean>>,
    isModalOpen: boolean,
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

export default function Playlists({ showPlaylist, setShowPlaylist, isModalOpen, setIsModalOpen }: PlaylistProps) {
    const [playlistInfo, setPlaylistInfo] = useState<PlaylistsRequest | null>(null);
    const [activePlaylist, setActivePlaylist] = useState("");

    useEffect(() => {
        (async () => {
            setPlaylistInfo(await getPlaylists(10, 0));
        })();
    }, []);

    async function startPlaylist(e: React.MouseEvent<HTMLButtonElement>) {
        await playPause({ isPlay: true, collectionURI: e.currentTarget.value })
    }
    return (
        <div className={"mt-10 mb-5 flex flex-col justify-baseline gap-2 px-6" + (isModalOpen ? " blur-xl" : "")}>
            <div className="flex flex-col md:flex-row justify-between gap-2">
                <h1 className="text-2xl font-bold text-center md:text-left">Playlists</h1>
                <div>
                    <button
                        className="px-4 py-2 mr-2 bg-green-700 hover: text-white rounded-full disabled:bg-gray-700 disabled:opacity-50"
                        disabled={!playlistInfo || playlistInfo.offset === 0}
                        onClick={async () => {
                            if (!playlistInfo) return;
                            setPlaylistInfo(await getPlaylists(10, Math.max(0, playlistInfo.offset - 10)));
                        }}
                    >
                        <FaArrowLeft />
                    </button>
                    <button
                        className="px-4 py-2 bg-green-700 text-white rounded-full disabled:bg-gray-700 disabled:opacity-50"
                        disabled={
                            !playlistInfo ||
                            playlistInfo.offset + playlistInfo.limit >= playlistInfo.total
                        }
                        onClick={async () => {
                            if (!playlistInfo) return;
                            setPlaylistInfo(await getPlaylists(10, playlistInfo.offset + 10));
                        }}
                    >
                        <FaArrowRight />
                    </button>
                </div>
            </div>
            {playlistInfo === null && <div className={"flex flex-col items-center gap-3"}>
                <ScaleLoader color="#ffffff" />
                <p>Loading...</p>
            </div>}
            {playlistInfo !== null ? playlistInfo?.items?.map((item: Playlist) => (
                <div key={item.id} className="py-2 border-gray-800 border-b pb-2 last:border-0">
                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-baseline text-center md:text-left gap-8">
                        <Image id={item.id} src={item.images[0].url} alt={item.name} height={640} width={640} className="size-24 md:size-32 cursor-pointer rounded-xl hover:opacity-65 hover:border-2 hover:border-white hover:p-1 transition-all duration-200" priority={true} onClick={() => { setActivePlaylist(item.id); setIsModalOpen(true); setShowPlaylist(true) }} />
                        <div className="flex flex-col">
                            <p className="text-l font-bold">{item.name}</p>
                            <p className="text-m font-light text-gray-400">{item.owner.display_name}</p>
                        </div>
                        <button value={item.uri} onClick={startPlaylist} className="rounded-full bg-green-700 hover:bg-green-400 hover:text-gray-800 p-3 flex flex-row items-center gap-2 group transition-colors duration-200 cursor-pointer md:ml-auto"> <FaPlay className="text-white text-2xl group-hover:text-gray-800 transition-colors duration-200" />Play</button>
                    </div>
                </div>
            )) : null}
            {showPlaylist && createPortal(<PlaylistModal onClose={() => { setIsModalOpen(false); setShowPlaylist(false) }} uri={activePlaylist} />, document.body)}
            <div className="mt-2 mb-5">
                <button
                    className="px-4 py-2 mr-2 bg-green-700 hover: text-white rounded-full disabled:bg-gray-700 disabled:opacity-50"
                    disabled={!playlistInfo || playlistInfo.offset === 0}
                    onClick={async () => {
                        if (!playlistInfo) return;
                        setPlaylistInfo(await getPlaylists(10, Math.max(0, playlistInfo.offset - 10)));
                    }}
                >
                    <FaArrowLeft />
                </button>
                <button
                    className="px-4 py-2 bg-green-700 text-white rounded-full disabled:bg-gray-700 disabled:opacity-50"
                    disabled={
                        !playlistInfo ||
                        playlistInfo.offset + playlistInfo.limit >= playlistInfo.total
                    }
                    onClick={async () => {
                        if (!playlistInfo) return;
                        setPlaylistInfo(await getPlaylists(10, playlistInfo.offset + 10));
                    }}
                >
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
}