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

export async function playPause(isPlay: boolean) {
    const response = await fetch("https://api.spotify.com/v1/me/player" + (isPlay ? "/play" : "/pause"), {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token"),
        },
        method: "PUT"
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