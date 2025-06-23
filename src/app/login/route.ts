import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";
const redirect_url = process.env.NEXT_PUBLIC_SPOTIFY_REDIR_URL || "";

function generateRandomString(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

const code_verifier = generateRandomString(64);
const hashed = await sha256(code_verifier)
const code_challenge = base64encode(hashed);


export async function GET() {
  (await cookies()).set("code_verifier", code_verifier)
  const auth_url = new URL('https://accounts.spotify.com/authorize?');
  const params = new URLSearchParams();

  params.set("client_id", client_id);
  params.set("response_type", "code");
  params.set("redirect_uri", redirect_url);
  params.set("state", generateRandomString(16));
  params.set("scope", "user-read-playback-state user-read-currently-playing user-modify-playback-state user-read-private user-library-read");
  params.set("code_challenge_method", "S256");
  params.set("code_challenge", code_challenge);


  auth_url.search = params.toString();

  redirect(auth_url.toString());
}
