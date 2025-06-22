'use client'

import { redirect } from "next/navigation"
import { FaSpotify } from "react-icons/fa"

type PlayerProps = {
    isLoggedIn: boolean,
}

export default function Player({ isLoggedIn }: PlayerProps) {
    return (
        <>
            {!isLoggedIn ? (
                <button
                    onClick={() => redirect("/login")}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition-colors duration-200 font-semibold text-lg w-auto flex flex-row items-center gap-2"
                >
                    <FaSpotify /> Login
                </button>
            ) : null}
        </>
    );
}