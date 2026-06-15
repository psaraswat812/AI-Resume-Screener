"use client"

import {
  useEffect,
  useState
} from "react"

import Navbar from "@/components/Navbar"

export default function RecruiterDashboard() {

  const [
    dashboard,
    setDashboard
  ] = useState(null)

  useEffect(() => {

    const token =
      localStorage.getItem("token")

    if (!token) {

      window.location.href =
        "/login"

      return
    }

    fetchDashboard()

  }, [])

  const fetchDashboard = async () => {

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/recruiter-dashboard`
    )

    const data =
      await response.json()

    setDashboard(data)

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
          Recruiter Dashboard
        </h1>

        {
          dashboard && (

            <>

              <p>
                Total Resumes:
                {" "}
                {dashboard.total_resumes}
              </p>

              <p>
                Average ATS:
                {" "}
                {dashboard.average_ats}
              </p>

            </>

          )
        }

      </div>

    </>
  )
}