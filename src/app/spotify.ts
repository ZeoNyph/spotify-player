const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

export async function refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token') || "";
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: client_id || ""
        })
    });
    if (response.ok) {
        await response.json().then((data) => {
            localStorage.setItem("access_token", data.access_token)
            localStorage.setItem("refresh_token", data.refresh_token || refreshToken)
        }
        );
    }

}

interface playPauseProps {
    isPlay: boolean,
    collectionURI?: string | "",
    songURI?: string | ""
}

export async function playPause({ isPlay, collectionURI, songURI }: playPauseProps) {
    const body = collectionURI
        ? songURI
            ? JSON.stringify({
                context_uri: collectionURI,
                offset: { uri: songURI }
            })
            : JSON.stringify({
                context_uri: collectionURI
            })
        : null;

    const response = await fetch("https://api.spotify.com/v1/me/player" + (isPlay ? "/play" : "/pause"), {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        method: "PUT",
        body: body
    });
    return response.ok

}

export async function skip(isForward: boolean) {
    const response = await fetch("https://api.spotify.com/v1/me/player" + (isForward ? "/next" : "/previous"), {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token"),
        },
        method: "POST"
    });
    return response.ok
}

export async function isPremiumUser() {
    const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token"),
        }
    });
    const data = await response.json();
    return data.product === "premium";
}

export async function getDevices() {
    const response = await fetch(" https://api.spotify.com/v1/me/player/devices", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token"),
        }
    });
    const data = await response.json();
    return data
}

export async function switchDevice(device: string) {
    const response = await fetch(" https://api.spotify.com/v1/me/player/", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token"),
        },
        method: "PUT",
        body: JSON.stringify({
            device_ids: [device]
        })
    });
    return response.status;
}

export async function getPlaylists(limit: number, offset: number) {
    const response = await fetch(" https://api.spotify.com/v1/me/playlists?" + new URLSearchParams({
        limit: limit.toString() || "10",
        offset: offset.toString() || "0",
    }).toString(), {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token"),
        },
    });
    return await response.json();
}

export async function getAlbums(limit: number, offset: number) {
    const response = await fetch(" https://api.spotify.com/v1/me/albums?" + new URLSearchParams({
        limit: limit.toString() || "10",
        offset: offset.toString() || "0",
    }).toString(), {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token"),
        },
    });
    return await response.json();
}

export async function getPlaylist(uri: string) {
    const url = new URL("https://api.spotify.com/v1/playlists/" + uri + "?")
    const response = await fetch(url + new URLSearchParams({
        fields: "uri,tracks.items(track(id, name, uri, artists, album(name, href))"
    }).toString(), {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token"),
        },
    });
    return await response.json();
}

export async function getAlbum(uri: string) {
    const url = new URL("https://api.spotify.com/v1/albums/" + uri + "?")
    const response = await fetch(url + new URLSearchParams({
        fields: "uri,tracks.items(track(id, name, uri, artists, album(name, href))"
    }).toString(), {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token"),
        },
    });
    return await response.json();
}

export async function getAlbumTracks(uri: string, limit: number, offset: number) {
    const url = new URL("https://api.spotify.com/v1/albums/" + uri + "/tracks/?" + new URLSearchParams({
        limit: limit.toString() || "10",
        offset: offset.toString() || "0",
    }).toString())
    const response = await fetch(url, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token"),
        },
    });
    return await response.json();
}

export async function getLikedSongs(limit: number, offset: number) {
    const response = await fetch(" https://api.spotify.com/v1/me/tracks?" + new URLSearchParams({
        limit: limit.toString() || "5",
        offset: offset.toString() || "0",
    }).toString(), {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token"),
        },
    });
    return await response.json();
}

export async function setRepeatType(repeat: number) {
    let repeatType;
    switch (repeat) {
        case 0:
            repeatType = "off";
            break;
        case 1:
            repeatType = "context";
            break;
        case 2:
            repeatType = "track";
            break;
    }
    const response = await fetch(" https://api.spotify.com/v1/me/player/repeat?state=" + repeatType, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token"),
        },
        method: "PUT"
    });
    return response.status;

}

export async function toggleShuffle(toggled: boolean) {
    const response = await fetch(" https://api.spotify.com/v1/me/player/shuffle?state=" + toggled, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token"),
        },
        method: "PUT"
    });
    return response.status;
}