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
    uri?: string | ""
}

export async function playPause({ isPlay, uri }: playPauseProps) {
    const response = await fetch("https://api.spotify.com/v1/me/player" + (isPlay ? "/play" : "/pause"), {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        method: "PUT",
        body: uri ? JSON.stringify({
            context_uri: uri || "",
        }) : null
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

export async function getPlaylist(uri: string) {
    const response = await fetch(uri, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token"),
        },
        body: new URLSearchParams({
            fields: "tracks.items(track(name, href, artists, album(name, href))"
        })
    });
    return await response.json();
}