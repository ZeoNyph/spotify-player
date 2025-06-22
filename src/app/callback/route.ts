import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function GET(request: Request){
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const url = new URL(request.url);
    const params = url.searchParams;
    if (params.has("code") && params.get("state") !== null){
        const body = new URLSearchParams({
            code: params.get("code") || "",
            redirect_uri: "http://127.0.0.1:3000/",
            grant_type: "authorization_code"
        }).toString();

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64")
            },
            body: body
        });
        const data = await response.json();
        const cookieStore = await cookies();
        cookieStore.set("access_token", data.access_token, {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "lax",
            maxAge: data.expires_in
        });
        redirect("/")
    }
}