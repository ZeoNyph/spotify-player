import React, { useCallback, useEffect, useRef, useState } from "react"
import { getAlbum, getAlbumTracks, playPause } from "../../app/spotify";
import { Album, AlbumRequest, Track } from "../../app/types";
import { FaArrowLeft, FaArrowRight, FaPlay } from "react-icons/fa6";
import { ScaleLoader } from "react-spinners";

type AlbumModalProps = {
    onClose: () => void,
    uri?: string | null
};

export default function AlbumModal({ onClose, uri = "" }: AlbumModalProps) {

    const [albumInfo, setAlbumInfo] = useState<AlbumRequest | null>(null);
    const albumRef = useRef<Album | null>(null);
    const func = useCallback(getAlbumInfo, [uri])

    async function getAlbumInfo() {
        const data = await getAlbumTracks(uri ?? "", 50, 0);
        const album = await getAlbum(uri ?? "");
        setAlbumInfo(data);
        albumRef.current = album
    }

    useEffect(() => {
        func();
    }, [func])

    return (
        <div className="fixed inset-0 flex flex-col gap-2 items-center justify-center bg-opacity-20 z-50 font-sans">
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] max-h-[80dvh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-lg text-gray-900 font-semibold">Songs</p>
                    <div>
                        <button
                            className="px-4 py-2 mr-2 bg-green-700 hover: text-white rounded-full disabled:bg-gray-700 disabled:opacity-50"
                            disabled={!albumInfo || albumInfo.offset === 0}
                            onClick={async () => {
                                if (!albumInfo) return;
                                setAlbumInfo(await getAlbumTracks(uri ?? "", 50, Math.max(0, albumInfo.offset - 50)));
                            }}
                        >
                            <FaArrowLeft />
                        </button>
                        <button
                            className="px-4 py-2 bg-green-700 text-white rounded-full disabled:bg-gray-700 disabled:opacity-50"
                            disabled={
                                !albumInfo ||
                                albumInfo.offset + albumInfo.limit >= albumInfo.total
                            }
                            onClick={async () => {
                                if (!albumInfo) return;
                                setAlbumInfo(await getAlbumTracks(uri ?? "", 50, albumInfo.offset + 50));
                            }}
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                <div className="flex flex-col">
                    {albumInfo && albumInfo?.items.length > 0 ? (
                        albumInfo?.items?.map((item: Track) => (
                            <div key={item.id} className="py-2 flex flex-row items-center justify-between border-b last:border-b-0">
                                <div className="flex flex-col">
                                    <p className="text-gray-800">{item.name}</p>
                                    <p className="text-xs text-gray-500 flex flex-row items-center gap-1">{item.artists.map((artist) => artist.name).join(", ")}</p>
                                </div>
                                <button onClick={async () => {
                                    if (!albumInfo) return;
                                    await playPause({ isPlay: true, collectionURI: albumRef.current?.uri ?? "", songURI: item.uri });
                                    onClose();
                                }} id={item.id} className="justify-self-end disabled:bg-gray-700 rounded-full bg-green-700 hover:bg-green-400 p-3 flex flex-row items-center gap-2 group transition-colors duration-200 text-white hover:text-gray-900"> <FaPlay className="text-white text-2xl group-hover:text-gray-800 transition-colors duration-200" />Play</button>
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