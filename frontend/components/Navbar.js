"use client"
import { useEffect, useState } from "react"
export default function Navbar() {
    const [username, setUsername] =
        useState("")
    useEffect(() => {

        const storedUser =
            localStorage.getItem("username")

        if (storedUser) {

            setUsername(storedUser)

        }

    }, [])
    const logout = () => {

        localStorage.removeItem("token")

        localStorage.removeItem(
            "username"
        )

        window.location.href =
            "/login"
    }


    return (

        <nav className="
flex
justify-between
items-center
px-8
py-5
border-b
border-white/10
bg-black/30
backdrop-blur-md
sticky
top-0
z-50
">

            <h1 className="
      text-2xl
      font-bold
      ">
                AI Resume Screener
            </h1>

            {/* <p className="text-gray-300">

                Welcome,
                {" "}
                {username}

            </p> */}
            <div className="flex items-center gap-8">

                <a
                    href="/dashboard"
                    className="
        text-gray-300
        hover:text-white
        transition
        "
                >
                    Dashboard
                </a>

                <a
                    href="/history"
                    className="
        text-gray-300
        hover:text-white
        transition
        "
                >
                    History
                </a>

                <a
                    href="/recruiter-dashboard"
                    className="
        text-gray-300
        hover:text-white
        transition
        "
                >
                    Recruiters
                </a>

                <div className="
    px-4
    py-2
    rounded-full
    bg-white/10
    text-gray-200
    ">
                    👤 {username}
                </div>

                <button
                    onClick={logout}
                    className="
        bg-red-500
        hover:bg-red-600
        px-5
        py-2
        rounded-xl
        font-semibold
        transition
        "
                >
                    Logout
                </button>

            </div>

        </nav>
    )
}