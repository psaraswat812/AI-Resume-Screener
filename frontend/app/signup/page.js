"use client"

import { useState } from "react"

export default function Signup() {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const signupUser = async () => {

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/signup`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            }
        )

        const data = await response.json()

        alert(data.message || data.error)

    }

    return (

        <div className="
    min-h-screen
    flex
    justify-center
    items-center
    ">

            <div className="
      bg-white/5
      p-8
      rounded-3xl
      w-[400px]
      ">

                <h1 className="
        text-3xl
        font-bold
        mb-6
        ">
                    Signup
                </h1>

                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 mb-4 rounded-xl"
                />

                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 rounded-xl"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 rounded-xl"
                />

                <button
                    onClick={signupUser}
                    className="
          bg-green-600
          px-6
          py-3
          rounded-xl
          "
                >
                    Signup
                </button>

                <p className="mt-4">

                    Already have an account?

                    <a
                        href="/login"
                        className="
    text-blue-400
    ml-2
    "
                    >
                        Login
                    </a>

                </p>

            </div>

        </div>
    )
}