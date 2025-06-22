import { redirect } from 'next/navigation';

const client_id = process.env.SPOTIFY_CLIENT_ID || "";

function generateRandomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


export async function GET() {
  const auth_url = new URL('https://accounts.spotify.com/authorize?');
  const params = new URLSearchParams();

  params.set("client_id", client_id);
  params.set("response_type", "code");
  params.set("redirect_uri", "http://127.0.0.1:3000/callback");
  params.set("state", generateRandomString(16));
  params.set("scope", "user-read-private user-read-email");
  params.set("show_dialog", "true")

  auth_url.search = params.toString();

  redirect(auth_url.toString());
}
