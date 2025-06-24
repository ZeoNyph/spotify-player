'use client'

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { PlayerInfoRequest } from "../app/types";
import { ScaleLoader } from "react-spinners";
import { isPremiumUser, playPause, refreshToken, setRepeatType, skip, toggleShuffle } from "../app/spotify";
import { FaBackwardStep, FaForwardStep, FaPlay, FaShuffle } from "react-icons/fa6";
import { FaPause } from "react-icons/fa";
import { useRouter } from "next/navigation";
import DeviceModal from "./modals/devices";
import { createPortal } from "react-dom";
import Playlists from "./playlists";
import LikedSongs from "./liked";
import { TbRepeat, TbRepeatOff, TbRepeatOnce } from "react-icons/tb";
import { BiSpeaker } from "react-icons/bi";

export default function Player() {

    const router = useRouter();
    const [playerInfo, setPlayerInfo] = useState<PlayerInfoRequest | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefetching, setIsRefetching] = useState(false);
    const [isPremium, setIsPremium] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showDevices, setShowDevices] = useState(false);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const [repeatState, setRepeatState] = useState(0);
    const [shuffleState, setShuffleState] = useState(false);

    const info = useCallback(getPlayerInfo, [router])

    async function getPlayerInfo() {
        if (localStorage.getItem("refresh_token")) {
            const response = await fetch("https://api.spotify.com/v1/me/player", {
                headers: {
                    "authorization": "Bearer " + localStorage.getItem("access_token")
                },
                method: "GET"
            });
            if (response.status === 204) { //no playback
                setPlayerInfo(null);
                setIsLoading(true);
            }
            else if (response.status === 401) {
                setPlayerInfo(null);
                setIsRefetching(true);
                refreshToken();
            }
            else {
                const data = await response.json();
                setPlayerInfo(data);
                setIsLoading(false);
                setIsRefetching(false);
            }
        }
        else {
            localStorage.removeItem("access_token");
            router.refresh();
        }
    }

    async function handlePlayPause() {
        await playPause({ isPlay: !isPlaying, collectionURI: "" });
    }

    async function handleSkipNext() {
        await skip(true);
    }

    async function handleSkipPrev() {
        await skip(false);
    }

    async function handleRepeat() {
        await setRepeatType((repeatState + 1) % 3);
        setRepeatState((repeatState + 1) % 3);
    }

    async function handleShuffle() {
        await toggleShuffle(!shuffleState);
        setShuffleState(!shuffleState);
    }

    function getRepeatIcon() {
        switch (repeatState) {
            case 0:
                return <TbRepeatOff className="text-white text-lg md:text-2xl group-hover:text-gray-800 transition-colors duration-200" />
            case 1:
                return <TbRepeat className="text-white text-lg md:text-2xl group-hover:text-gray-800 transition-colors duration-200" />
            case 2:
                return <TbRepeatOnce className="text-white text-lg md:text-2xl group-hover:text-gray-800 transition-colors duration-200" />;
            default:
                return <TbRepeatOff className="text-white text-lg md:text-2xl group-hover:text-gray-800 transition-colors duration-200" />
        }
    }


    useEffect(() => {
        async function getPremiumStatus() {
            const status = await isPremiumUser();
            setIsPremium(status);
        }
        getPremiumStatus();
    }, []);

    useEffect(() => {
        if (playerInfo?.is_playing !== undefined) {
            setIsPlaying(playerInfo.is_playing);
        }
        if (playerInfo?.repeat_state !== undefined) {
            switch (playerInfo.repeat_state) {
                case "off":
                    setRepeatState(0);
                    break;
                case "context":
                    setRepeatState(1);
                    break;
                case "track":
                    setRepeatState(2);
                    break;
            }
        }
        if (playerInfo?.shuffle_state !== undefined) {
            setShuffleState(playerInfo.shuffle_state)
        }
    }, [playerInfo])

    useEffect(() => {
        const interval = setInterval(info, 500);
        return () => { clearInterval(interval) }
    }, [info]);

    return (
        <>
            {playerInfo === null && (isLoading || isRefetching) ?
                <div className={"flex flex-col items-center gap-3"}>
                    <ScaleLoader color="#ffffff" />
                    <p>{!isRefetching ? "Loading..." : "Token expired, refetching..."}</p>
                    {!isRefetching ? <p className="font-light text-center text-l text-gray-700">Make sure at least one device has Spotify open and playing.</p> : null}
                </div>
                :
                <div className={"flex flex-col gap-6 transition-all items-center text-center" + (showDevices || showPlaylist ? " blur-xl" : "")}>
                    <div className="items-center justify-center mt-[15dvh] mb-[5dvh] md:mt-[30dvh] mx-auto">
                        <div className="flex flex-col items-center gap-6 font-sans">
                            {playerInfo?.item?.album?.images && playerInfo.item.album.images.length > 1 && (
                                <Image
                                    src={playerInfo.item.album.images[1].url}
                                    alt="Album cover"
                                    width={playerInfo.item.album.images[1].width}
                                    height={playerInfo.item.album.images[1].height}
                                    className="size-64 rounded-xl lg:rounded-3xl border-2 border-white p-2"
                                    priority={true}
                                />
                            )}
                            <div className="flex flex-col items-center gap-4">
                                {playerInfo?.item?.name && (
                                    <h1 className="text-xl font-bold">{playerInfo.item.name}</h1>
                                )}
                                {playerInfo?.item?.artists && playerInfo.item.artists.length > 0 && (
                                    <h2 className="text-l">
                                        {playerInfo.item.artists.map((artist) => artist.name).join(", ")}
                                    </h2>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            {playerInfo?.progress_ms !== undefined && playerInfo?.item?.duration_ms !== undefined && (
                                <p>
                                    {Math.floor((playerInfo.progress_ms / 1000) / 60)
                                        .toString()
                                        .padStart(2, '0')
                                        +
                                        ":" +
                                        Math.floor((playerInfo.progress_ms / 1000) % 60)
                                            .toString()
                                            .padStart(2, '0') +
                                        " / " +
                                        Math.floor((playerInfo.item.duration_ms / 1000) / 60)
                                            .toString()
                                            .padStart(2, '0') +
                                        ":" +
                                        Math.floor((playerInfo.item.duration_ms / 1000) % 60)
                                            .toString()
                                            .padStart(2, '0')}
                                </p>
                            )}
                            {playerInfo?.progress_ms && playerInfo?.item?.duration_ms && (
                                <div className="w-[80lvw] md:w-[60lvw] lg:w-[40lvw] justify-self-center mx-auto bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
                                    <div
                                        className="bg-green-500 h-2.5"
                                        style={{
                                            width: `${(playerInfo.progress_ms / playerInfo.item.duration_ms) * 100}%`,
                                            transition: "width 0.2s linear"
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        {!isLoading && playerInfo !== null && isPremium && (
                            <div className="flex flex-row justify-center gap-6 items-center mt-6">
                                <>
                                    <button onClick={() => { setShowDevices(true); }} className=" cursor-pointer rounded-full bg-green-700 hover:bg-green-400 hover:text-gray-800 p-2 md:p-3 flex flex-row items-center gap-2 group transition-colors duration-200"><BiSpeaker className="text-white text-l md:text-2xl group-hover:text-gray-800 transition-colors duration-200" /></button>
                                    {showDevices && createPortal(<DeviceModal onClose={() => setShowDevices(false)} />, document.body)}
                                    <div className="flex flex-row items-center justify-center gap-3">
                                        <button
                                            onClick={handleSkipPrev}
                                            id="player_skipb"
                                            className="rounded-full cursor-pointer bg-green-700 hover:bg-green-400 p-2 md:p-3 flex flex-row items-center gap-2 group transition-colors duration-200"
                                        >
                                            <FaBackwardStep className="text-white text-lg md:text-2xl group-hover:text-gray-800 transition-colors duration-200" />
                                        </button>
                                        <button
                                            onClick={handlePlayPause}
                                            id="player_playpause"
                                            className="rounded-full cursor-pointer bg-green-700 hover:bg-green-400 p-2 md:p-3 flex flex-row items-center gap-2 group transition-colors duration-200"
                                        >
                                            {isPlaying ? (
                                                <FaPause className="text-white text-lg md:text-2xl group-hover:text-gray-800 transition-colors duration-200" />
                                            ) : (
                                                <FaPlay className="text-white text-lg md:text-2xl group-hover:text-gray-800 transition-colors duration-200" />
                                            )}
                                        </button>
                                        <button
                                            onClick={handleSkipNext}
                                            id="player_skipf"
                                            className="rounded-full cursor-pointer bg-green-700 hover:bg-green-400 p-2 md:p-3 flex flex-row items-center gap-2 group transition-colors duration-200"
                                        >
                                            <FaForwardStep className="text-white text-lg md:text-2xl group-hover:text-gray-800 transition-colors duration-200" />
                                        </button>
                                    </div>
                                    <div className="flex flex-row items-center justify-center gap-3">
                                        <button
                                            onClick={handleRepeat}
                                            id="player_repeat"
                                            className="rounded-full cursor-pointer bg-green-700 hover:bg-green-400 p-2 md:p-3 flex flex-row items-center gap-2 group transition-colors duration-200"
                                        >
                                            {getRepeatIcon()}
                                        </button>
                                        <button
                                            onClick={handleShuffle}
                                            id="player_shuffle"
                                            className="rounded-full cursor-pointer bg-green-700 hover:bg-green-400 p-2 md:p-3 flex flex-row items-center gap-2 group transition-colors duration-200"
                                        >
                                            <FaShuffle className={"text-white text-lg md:text-2xl group-hover:text-gray-800 transition-colors duration-200" + (!shuffleState ? " opacity-50" : "")} />
                                        </button>
                                    </div>
                                </>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col w-[50dvw] mx-auto">
                        <LikedSongs />
                        <Playlists showPlaylist={showPlaylist} setShowPlaylist={setShowPlaylist} />
                    </div>
                </div>}
        </>
    );
}