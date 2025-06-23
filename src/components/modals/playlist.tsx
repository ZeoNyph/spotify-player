import React, { useCallback, useEffect, useRef } from "react"
import { getPlaylist, playPause } from "../../app/spotify";
import { Item, PlaylistRequest } from "../../app/types";
import { FaPlay } from "react-icons/fa6";
import { ScaleLoader } from "react-spinners";

type PlaylistModalProps = {
    onClose: () => void,
    uri?: string | null
};

export default function PlaylistModal({ onClose, uri = "" }: PlaylistModalProps) {

    const playlistInfo = useRef<PlaylistRequest | null>(null);
    const func = useCallback(getPlaylistInfo, [uri])

    async function getPlaylistInfo() {
        const data = await getPlaylist(uri ?? "");
        playlistInfo.current = data;
    }

    useEffect(() => {
        func();
    }, [func])

    return (
        <div className="fixed inset-0 flex flex-col gap-2 items-center justify-center bg-opacity-20 z-50 font-sans">
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] max-h-[80dvh] overflow-y-scroll">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-lg text-gray-900 font-semibold">Songs</p>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                <div className="flex flex-col">
                    {playlistInfo.current && playlistInfo?.current.tracks?.items.length > 0 ? (
                        playlistInfo?.current.tracks?.items.map((item: Item) => (
                            <div key={item.track.id} className="py-2 flex flex-row items-center justify-between border-b last:border-b-0">
                                <div className="flex flex-col">
                                    <p className="text-gray-800">{item.track.name}</p>
                                    <p className="text-xs text-gray-500 flex flex-row items-center gap-1">{item.track.artists.map((artist) => artist.name).join(", ")}</p>
                                </div>
                                <button onClick={async () => {
                                    if (!playlistInfo.current) return;
                                    await playPause({ isPlay: true, collectionURI: playlistInfo.current.uri, songURI: item.track.uri });
                                    onClose();
                                }} id={item.track.id} className="justify-self-end disabled:bg-gray-700 rounded-full bg-green-700 hover:bg-green-400 p-3 flex flex-row items-center gap-2 group transition-colors duration-200 text-white hover:text-gray-900"> <FaPlay className="text-white text-2xl group-hover:text-gray-800 transition-colors duration-200" />Play</button>
                            </div>
                        ))
                    ) : (
                        <ScaleLoader color="#000000" className="mx-auto" />
                    )}
                </div>
                <div className="flex justify-end my-2">
                    <button
                        onClick={onClose}
                        className="rounded-full bg-green-700 hover:bg-green-400 p-3 flex flex-row items-center gap-2 group transition-colors duration-200 text-white hover:text-gray-900"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}