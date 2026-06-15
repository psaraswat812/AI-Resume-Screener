"use client"

import { useState } from "react"

export default function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const loginUser = async () => {

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        )

        const data = await response.json()

        console.log(data)

        if (data.access_token) {

            localStorage.setItem(
                "token",
                data.access_token
            )
            localStorage.setItem(
                "username",
                data.username
            )

            window.location.href = "/dashboard"
        }
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
                    Login
                </h1>

                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    className="
          w-full
          p-3
          mb-4
          rounded-xl
          "
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    className="
          w-full
          p-3
          mb-4
          rounded-xl
          "
                />

                <button
                    onClick={loginUser}
                    className="
          bg-blue-600
          px-6
          py-3
          rounded-xl
          "
                >
                    Login
                </button>

                <p className="mt-4">

                    Don't have an account?

                    <a
                        href="/signup"
                        className="
    text-blue-400
    ml-2
    "
                    >
                        Signup
                    </a>

                </p>

            </div>

        </div>
    )
}