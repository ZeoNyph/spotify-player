import { getPlaylists } from "@/app/spotify";
import { Playlist, PlaylistRequest } from "@/app/types";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";

export default function Playlists() {
    const playlistInfo = useRef<PlaylistRequest | null>(null);

    useEffect(() => {
        (async () => {
            playlistInfo.current = await getPlaylists(5, 0);
        })();
    }, []);

    return (
        <div className="flex flex-col justify-baseline gap-2 px-6">
            <h1 className="text-2xl font-bold">Playlists</h1>
            {playlistInfo.current === null && <div className={"flex flex-col items-center gap-3"}>
                <ScaleLoader color="#ffffff" />
                <p>Loading...</p>
            </div>}
            {playlistInfo.current !== null ? playlistInfo.current?.items?.map((item: Playlist) => (
                <div key={item.id}>
                    <div className="flex flex-row items-center text-left gap-4">
                        <Image src={item.images[0].url} alt={item.name} height={640} width={640} className="size-24 md:size-32" priority={true} />
                        <div className="flex flex-col">
                            <p className="text-l font-bold">{item.name}</p>
                            <p className="text-m font-light text-gray-400">{item.owner.display_name}</p>
                        </div>
                    </div>
                </div>
            )) : null}
        </div>
    );
}