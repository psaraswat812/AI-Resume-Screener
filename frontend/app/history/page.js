"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"

export default function HistoryPage() {

  const [history, setHistory] = useState([])

  useEffect(() => {

    const token =
      localStorage.getItem("token")

    if (!token) {

      window.location.href =
        "/login"

      return
    }

    fetchHistory()

  }, [])

  const fetchHistory = async () => {

    const token =
      localStorage.getItem("token")

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/resume-history/`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    )

    const data =
      await response.json()

    setHistory(data)
  }

  return (

    <>
      <Navbar />

      <div className="
      min-h-screen
      bg-black
      text-white
      p-10
      ">

        <h1 className="
        text-4xl
        font-bold
        mb-8
        ">
          Resume History
        </h1>

        {
          history.map((resume) => (

            <div
              key={resume.id}
              className="
              border
              border-white/10
              p-5
              rounded-xl
              mb-4
              "
            >

              <h2>
                {resume.filename}
              </h2>

              <p>
                ATS Score:
                {" "}
                {resume.ats_score}
              </p>

              <p>
                Role:
                {" "}
                {resume.predicted_role}
              </p>

            </div>

          ))
        }

      </div>

    </>

  )
}