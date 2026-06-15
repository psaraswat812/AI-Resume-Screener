"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import {
    Upload,
    Brain,
    Target,
    AlertTriangle
} from "lucide-react"

import {
    PieChart,
    Pie,
    Cell,
    Tooltip
} from "recharts"


export default function Home() {
    useEffect(() => {

        const token =
            localStorage.getItem("token")

        if (!token) {

            window.location.href =
                "/login"

            return
        }

        fetchUserDashboard()

    }, [])

    const [file, setFile] = useState(null)

    const [jobDescription, setJobDescription] = useState("")

    const [result, setResult] = useState(null)

    const [loading, setLoading] = useState(false)
    const [history, setHistory] = useState([])
    const [resume1Id, setResume1Id] = useState("")
    const [resume2Id, setResume2Id] = useState("")
    const [comparison, setComparison] = useState(null)
    const [dashboard, setDashboard] = useState(null)
    const [question, setQuestion] = useState("")
    const [chatAnswer, setChatAnswer] = useState("")
    const [chatLoading, setChatLoading] = useState(false)
    const [userDashboard, setUserDashboard] =
        useState(null)


    // Handle form submit
    const handleSubmit = async (e) => {

        e.preventDefault()


        setLoading(true)

        const formData = new FormData()

        formData.append("file", file)
        formData.append("job_description", jobDescription)


        try {

            const token =
                localStorage.getItem("token")

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/upload-resume/`,
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    },

                    body: formData
                }
            )

            const data = await response.json()
            console.log("FULL API RESPONSE:", data)

            console.log(data)
            console.log("LOGIN RESPONSE:", data)
            console.log("FULL API RESPONSE:", data)
            setResult(data)
            setLoading(false)

        } catch (error) {

            console.log(error)

        } finally {

            setLoading(false)
        }
    }

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

        const data = await response.json()

        console.log("History:", data)

        setHistory(data)

    }
    const fetchUserDashboard = async () => {

        const token =
            localStorage.getItem("token")

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user-dashboard/`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        )

        const data =
            await response.json()

        console.log(
            "USER DASHBOARD:",
            data
        )

        setUserDashboard(data)

    }


    const compareResumes = async () => {

        console.log("Resume1:", resume1Id)
        console.log("Resume2:", resume2Id)

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/compare-resumes/${resume1Id}/${resume2Id}`
        )

        const data = await response.json()

        console.log("Comparison:", data)

        console.log("COMPARE DATA:", data)

        setComparison(data)

    }

    const downloadResume = async () => {

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/download-improved-resume/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    rewritten_resume:
                        result?.rewritten_resume
                })
            }
        )

        const blob = await response.blob()

        const url =
            window.URL.createObjectURL(blob)

        const a =
            document.createElement("a")

        a.href = url

        a.download =
            "improved_resume.txt"

        a.click()
    }

    const downloadATSReport = async () => {

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/download-ats-report/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    predicted_role: result?.predicted_role,
                    ATS_score: result?.ATS_score,
                    skill_match: result?.skill_match,
                    resume_strength: result?.resume_strength,
                    missing_skills: result?.missing_skills,
                    ai_feedback: result?.ai_feedback
                })
            }
        )

        const blob = await response.blob()

        const url = window.URL.createObjectURL(blob)

        const a = document.createElement("a")

        a.href = url

        a.download = "ATS_Report.pdf"

        a.click()
    }


    // Chart data
    const chartData = result
        ? [
            {
                name: "ATS Score",
                value: parseFloat(result.ats_score)
            },
            {
                name: "Remaining",
                value: 100 - parseFloat(result.ats_score)
            }
        ]
        : []

    const loadRecruiterDashboard = async () => {

        try {

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/recruiter-dashboard`
            )

            const data = await response.json()

            console.log("DASHBOARD:", data)

            setDashboard(data)

        } catch (error) {

            console.log(error)
        }
    }
    const askChatbot = async () => {

        if (!result) {
            alert("Analyze a resume first")
            return
        }

        setChatLoading(true)

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/chatbot`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    question: question,

                    ATS_score: result.ATS_score,

                    predicted_role: result.predicted_role,

                    skills: result.skills,

                    missing_skills: result.missing_skills,

                    ai_feedback: result.ai_feedback
                })
            }
        )

        const data = await response.json()

        setChatAnswer(data.answer)

        setChatLoading(false)
    }
    return (

        <>

            <Navbar />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6">

                {/* Header */}
                <div className="text-center mb-12">

                    <div className="text-center py-12">

                        <h1 className="
    text-6xl
    font-extrabold
    bg-gradient-to-r
    from-blue-400
    via-purple-500
    to-pink-500
    text-transparent
    bg-clip-text
  ">
                            AI Resume Screener
                        </h1>
                        <div className="flex justify-end mt-4">

                            {/* <button
                                onClick={() => {

                                    localStorage.removeItem(
                                        "token"
                                    )

                                    window.location.href =
                                        "/login"

                                }}

                                className="
    bg-red-600
    hover:bg-red-700
    px-5
    py-2
    rounded-xl
    font-bold
    "
                            >
                                Logout
                            </button> */}

                        </div>

                        <p className="
    mt-4
    text-gray-300
    text-xl
  ">
                            Analyze • Optimize • Compare • Get Hired
                        </p>

                    </div>

                    <p className="text-gray-400 text-lg">
                        Intelligent Resume Analysis using NLP & Machine Learning
                    </p>

                    {
                        userDashboard && (

                            <div className="
    grid
    grid-cols-3
    gap-6
    mb-10
    ">

                                <div className="
      bg-white/10
      p-6
      rounded-2xl
      ">

                                    <h3>Total Resumes</h3>

                                    <p className="
        text-3xl
        font-bold
        ">
                                        {userDashboard.total_resumes}
                                    </p>

                                </div>

                                <div className="
      bg-white/10
      p-6
      rounded-2xl
      ">

                                    <h3>Average ATS</h3>

                                    <p className="
        text-3xl
        font-bold
        ">
                                        {userDashboard.average_ats}%
                                    </p>

                                </div>

                                <div className="
      bg-white/10
      p-6
      rounded-2xl
      ">

                                    <h3>Best ATS</h3>

                                    <p className="
        text-3xl
        font-bold
        ">
                                        {userDashboard.best_ats}%
                                    </p>

                                </div>

                            </div>

                        )
                    }

                    <div className="
grid
grid-cols-3
gap-6
max-w-4xl
mx-auto
mt-10
">

                        {/* <div className="bg-white/5 p-6 rounded-2xl">
                            <h3 className="text-gray-400">
                                ATS Optimization
                            </h3>
                            <p className="text-3xl font-bold text-green-400">
                                95%
                            </p>
                        </div>

                        <div className="bg-white/5 p-6 rounded-2xl">
                            <h3 className="text-gray-400">
                                Role Detection
                            </h3>
                            <p className="text-3xl font-bold text-blue-400">
                                ML
                            </p>
                        </div>

                        <div className="bg-white/5 p-6 rounded-2xl">
                            <h3 className="text-gray-400">
                                Resume Comparison
                            </h3>
                            <p className="text-3xl font-bold text-purple-400">
                                AI
                            </p>
                        </div> */}

                    </div>

                </div>


                {/* Upload Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white/5
backdrop-blur-xl
border
border-white/10
shadow-2xl backdrop-blur-lg border border-white/20 rounded-3xl p-8 max-w-3xl mx-auto shadow-2xl"
                >

                    {/* Resume Upload */}
                    <div className="mb-6">

                        <label className="flex items-center gap-2 text-lg font-semibold mb-3">

                            <Upload size={20} />

                            Upload Resume

                        </label>

                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="w-full border border-gray-600 bg-black/30 rounded-xl p-3"
                            required
                        />

                    </div>


                    {/* Job Description */}
                    <div className="mb-6">

                        <label className="flex items-center gap-2 text-lg font-semibold mb-3">

                            <Brain size={20} />

                            Job Description

                        </label>

                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste job description here..."
                            className="w-full h-40 border border-gray-600 bg-black/30 rounded-xl p-4"
                            required
                        />

                    </div>


                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition-all py-4 rounded-xl font-bold text-lg"
                    >

                        {loading ? "Analyzing Resume..." : "Analyze Resume"}

                    </button>

                    <div className="flex gap-4 mt-6">

                        <button
                            type="button"
                            onClick={fetchHistory}
                            className="
    bg-indigo-600
    hover:bg-indigo-700
    px-6
    py-3
    rounded-xl
    font-bold
    "
                        >
                            View History
                        </button>

                        <button
                            type="button"
                            onClick={loadRecruiterDashboard}
                            className="
    bg-purple-600
    hover:bg-purple-700
    px-6
    py-3
    rounded-xl
    font-bold
    "
                        >
                            Recruiter Dashboard
                        </button>

                    </div>

                </form>


                {/* Loading Animation */}
                {loading && (

                    <div className="flex justify-center mt-10">

                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>

                    </div>

                )}


                {/* Results Dashboard */}
                {result && !loading && (

                    <div className="mt-10 max-w-6xl mx-auto">

                        {/* Top Cards */}
                        <div className="grid md:grid-cols-4 gap-6 mb-10">

                            {/* Role Card */}
                            <div className="bg-white/5
backdrop-blur-xl
border
border-white/10
shadow-2xl backdrop-blur-lg border border-white/20 rounded-3xl p-6">

                                <div className="flex items-center gap-3 mb-4">

                                    <Brain className="text-blue-400" />

                                    <h2 className="text-xl font-bold">
                                        Predicted Role
                                    </h2>

                                </div>

                                <p className="text-2xl font-semibold text-blue-300">
                                    {result.predicted_role}
                                </p>

                            </div>


                            {/* ATS Card */}
                            <div className="bg-white/5
backdrop-blur-xl
border
border-white/10
shadow-2xl backdrop-blur-lg border border-white/20 rounded-3xl p-6">

                                <div className="flex items-center gap-3 mb-4">

                                    <Target className="text-green-400" />

                                    <h2 className="text-xl font-bold">
                                        ATS Score
                                    </h2>

                                </div>

                                <p
                                    className="text-3xl font-bold"
                                    style={{
                                        color:
                                            parseFloat(result?.ATS_score) < 40
                                                ? "#ff4d4d"
                                                : parseFloat(result?.ATS_score) < 70
                                                    ? "#ffaa00"
                                                    : "#00ff88"
                                    }}
                                >
                                    {result?.ATS_score}
                                </p>

                            </div>
                            <div
                                style={{
                                    width: "100%",
                                    height: "12px",
                                    background: "#333",
                                    borderRadius: "10px",
                                    marginTop: "10px"
                                }}
                            >
                                <div
                                    style={{
                                        width: result?.ATS_score,
                                        height: "100%",
                                        background: "#00ff88",
                                        borderRadius: "10px"
                                    }}
                                />
                            </div>


                            {/* Missing Skills Count */}
                            <div className="bg-white/5
backdrop-blur-xl
border
border-white/10
shadow-2xl backdrop-blur-lg border border-white/20 rounded-3xl p-6">

                                <div className="flex items-center gap-3 mb-4">

                                    <AlertTriangle className="text-red-400" />

                                    <h2 className="text-xl font-bold">
                                        Missing Skills
                                    </h2>

                                </div>

                                <div className="mt-4">

                                    <ul className="space-y-2">

                                        {result?.missing_skills?.map((skill, index) => (

                                            <li
                                                key={index}
                                                className="bg-red-500/20 text-red-300 px-4 py-2 rounded-full inline-block mr-2"
                                            >
                                                {skill}
                                            </li>

                                        ))}

                                    </ul>

                                </div>

                            </div>

                        </div>


                        {/* ATS Chart */}
                        <div className="bg-white/5
backdrop-blur-xl
border
border-white/10
shadow-2xl backdrop-blur-lg border border-white/20 rounded-3xl p-8 mb-10">

                            <h2 className="text-2xl font-bold mb-6">
                                ATS Score Analysis
                            </h2>

                            <div
                                className="analysis-box"
                                style={{
                                    maxHeight: "500px",
                                    overflowY: "auto",
                                    padding: "20px",
                                    backgroundColor: "#111",
                                    borderRadius: "10px"
                                }}
                            >
                                <pre
                                    style={{
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                        fontSize: "16px",
                                        lineHeight: "1.6"
                                    }}
                                >
                                    {result?.ai_feedback}
                                </pre>
                            </div>

                            <div className="flex justify-center">

                                <PieChart width={300} height={300}>

                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        outerRadius={100}
                                        label
                                    >

                                        <Cell fill="#3B82F6" />

                                        <Cell fill="#1F2937" />

                                    </Pie>

                                    <Tooltip />

                                </PieChart>

                            </div>

                        </div>

                        <div className="bg-white/5
backdrop-blur-xl
border
border-white/10
shadow-2xl backdrop-blur-lg border border-white/20 rounded-3xl p-6 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-green-400">
                                AI Rewritten Resume
                            </h2>

                            <div className="bg-black/30 p-4 rounded-xl max-h-[500px] overflow-y-auto">
                                <pre className="whitespace-pre-wrap text-sm">
                                    {result?.rewritten_resume}
                                </pre>
                            </div>
                        </div>


                        {/* Skills */}
                        <div className="grid md:grid-cols-2 gap-8">

                            {/* Detected Skills */}
                            <div className="bg-white/5
backdrop-blur-xl
border
border-white/10
shadow-2xl backdrop-blur-lg border border-white/20 rounded-3xl p-6">

                                <h2 className="text-2xl font-bold mb-5">
                                    Detected Skills
                                </h2>

                                <div className="flex flex-wrap gap-3">

                                    {result.skills?.map((skill, index) => (

                                        <span
                                            key={index}
                                            className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full"
                                        >
                                            {skill}
                                        </span>

                                    ))}

                                </div>

                            </div>
                            {/* Keyword Analysis */}
                            <div className="bg-white/5
backdrop-blur-xl
border
border-white/10
shadow-2xl backdrop-blur-lg border border-white/20 rounded-3xl p-6 mt-8">

                                <h2 className="text-2xl font-bold mb-6">
                                    Keyword Analysis
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">

                                    {/* Matched Keywords */}
                                    <div>

                                        <h3 className="text-green-400 text-xl font-semibold mb-4">
                                            ✓ Matched Keywords
                                        </h3>

                                        <div className="flex flex-wrap gap-2">

                                            {result?.matched_keywords?.map((skill, index) => (

                                                <span
                                                    key={index}
                                                    className="bg-green-500/20 text-green-300 px-3 py-2 rounded-full"
                                                >
                                                    {skill}
                                                </span>

                                            ))}

                                        </div>

                                    </div>

                                    {/* Missing Keywords */}
                                    <div>

                                        <h3 className="text-red-400 text-xl font-semibold mb-4">
                                            ✗ Missing Keywords
                                        </h3>

                                        <div className="flex flex-wrap gap-2">

                                            {result?.missing_skills?.map((skill, index) => (

                                                <span
                                                    key={index}
                                                    className="bg-red-500/20 text-red-300 px-3 py-2 rounded-full"
                                                >
                                                    {skill}
                                                </span>

                                            ))}

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* Missing Skills */}
                            <div className="bg-white/5
backdrop-blur-xl
border
border-white/10
shadow-2xl backdrop-blur-lg border border-white/20 rounded-3xl p-6">

                                <h2 className="text-2xl font-bold mb-5">
                                    Missing Skills

                                </h2>

                                <div className="flex flex-wrap gap-3">

                                    {result.missing_skills?.map((skill, index) => (

                                        <span
                                            key={index}
                                            className="bg-red-500/20 text-red-300 px-4 py-2 rounded-full"
                                        >
                                            {skill}
                                        </span>

                                    ))}

                                </div>

                            </div>
                            {/* Resume Strength */}
                            <div className="bg-white/5
backdrop-blur-xl
border
border-white/10
shadow-2xl backdrop-blur-lg border border-white/20 rounded-3xl p-6">

                                <h2 className="text-xl font-bold mb-4">
                                    Resume Strength
                                </h2>

                                <p
                                    className={`text-3xl font-bold ${result?.resume_strength === "Weak"
                                        ? "text-red-400"
                                        : result?.resume_strength === "Average"
                                            ? "text-yellow-400"
                                            : result?.resume_strength === "Strong"
                                                ? "text-green-400"
                                                : "text-emerald-300"
                                        }`}
                                >
                                    {result?.resume_strength}
                                </p>

                            </div>

                        </div>
                        <div className="bg-white/5
backdrop-blur-xl
border
border-white/10
shadow-2xl backdrop-blur-lg border border-white/20 rounded-3xl p-6">
                            <h2 className="text-xl font-bold mb-4">
                                Detected Skills
                            </h2>

                            <div className="flex flex-wrap gap-2">
                                {result?.skills?.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-500/20 rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5
backdrop-blur-xl
border
border-white/10
shadow-2xl backdrop-blur-lg border border-white/20 rounded-3xl p-6 mt-8">

                            <h2 className="text-xl font-bold mb-4">
                                ATS Score Visualization
                            </h2>

                            <div className="flex justify-center">

                                <PieChart width={300} height={300}>
                                    <Pie
                                        data={[
                                            {
                                                name: "ATS",
                                                value: parseFloat(result?.ATS_score)
                                            },
                                            {
                                                name: "Remaining",
                                                value: 100 - parseFloat(result?.ATS_score)
                                            }
                                        ]}
                                        dataKey="value"
                                        outerRadius={100}
                                        label
                                    >
                                        <Cell fill="#00ff88" />
                                        <Cell fill="#444444" />
                                    </Pie>
                                </PieChart>

                            </div>

                        </div>

                        {/* Suggestions */}
                        <div className="flex gap-4 mt-8">

                            <button
                                onClick={downloadResume}
                                className="
    bg-green-600
    hover:bg-green-700
    px-6
    py-3
    rounded-xl
    font-bold
    "
                            >
                                Download Improved Resume
                            </button>

                            <button
                                onClick={downloadATSReport}
                                className="
    bg-blue-600
    hover:bg-blue-700
    px-6
    py-3
    rounded-xl
    font-bold
    "
                            >
                                Download ATS Report
                            </button>

                        </div>

                    </div>

                )}
                {/* console.log("RESULT STATE:", result) */}


                {
                    history.length > 0 && (

                        <div className="mt-10">

                            <h2 className="text-3xl font-bold mb-6">
                                Resume History
                            </h2>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {
                                    history.map((item) => (

                                        <div
                                            key={item.id}
                                            className="bg-white/5
backdrop-blur-xl
border
border-white/10
shadow-2xl p-4 rounded-xl border border-white/20"
                                        >

                                            <p>
                                                <strong>File:</strong>
                                                {" "}
                                                {item.filename}
                                            </p>

                                            <p>
                                                <strong>Role:</strong>
                                                {" "}
                                                {item.predicted_role}
                                            </p>

                                            <p>
                                                <strong>ATS:</strong>
                                                {" "}
                                                {item.ats_score}
                                            </p>

                                            <p>
                                                <strong>Strength:</strong>
                                                {" "}
                                                {item.resume_strength}
                                            </p>

                                            <p>
                                                <strong>Date:</strong>
                                                {" "}
                                                {item.created_at}
                                            </p>

                                        </div>

                                    ))
                                }

                            </div>

                        </div>


                    )
                }

                {dashboard && (

                    <div className="mt-10 max-w-6xl mx-auto">

                        <h1 className="
text-5xl
font-extrabold
mb-8
bg-gradient-to-r
from-purple-400
to-pink-500
text-transparent
bg-clip-text
">
                            Recruiter Dashboard
                        </h1>

                        <div className="grid md:grid-cols-3 gap-6 mb-10">

                            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl">
                                <h3 className="text-gray-400">Total Resumes</h3>
                                <p className="text-4xl font-bold text-blue-400">
                                    {dashboard.total_resumes}
                                </p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl">
                                <h3 className="text-gray-400">Average ATS</h3>
                                <p className="text-4xl font-bold text-green-400">
                                    {dashboard.average_ats}%
                                </p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl">
                                <h3 className="text-gray-400">Top Role</h3>
                                <p className="text-3xl font-bold text-purple-400">
                                    {dashboard.top_roles?.[0]?.[0]}
                                </p>
                            </div>

                        </div>

                    </div>

                )}
                <div className="mt-10">

                    {/* <div className="flex gap-4 mt-6">

          <button
            type="button"
            onClick={fetchHistory}
            className="
    bg-indigo-600
    hover:bg-indigo-700
    px-6
    py-3
    rounded-xl
    font-bold
    "
          >
            View History
          </button>

          <button
            type="button"
            onClick={loadRecruiterDashboard}
            className="
    bg-purple-600
    hover:bg-purple-700
    px-6
    py-3
    rounded-xl
    font-bold
    "
          >
            Recruiter Dashboard
          </button>

        </div> */}

                    <div className="flex gap-4 mb-4">


                        <input
                            type="number"
                            placeholder="Resume 1 ID"
                            value={resume1Id}
                            onChange={(e) => setResume1Id(e.target.value)}
                            className="bg-white text-black border p-2 rounded"
                        />

                        <input
                            type="number"
                            placeholder="Resume 2 ID"
                            value={resume2Id}
                            onChange={(e) => setResume2Id(e.target.value)}
                            className="bg-white text-black border p-2 rounded"
                        />

                        <button
                            onClick={compareResumes}
                            className="bg-green-600 px-4 py-2 rounded"
                        >
                            Compare
                        </button>

                    </div>

                </div>

                {
                    comparison && (

                        <div className="bg-white/5
backdrop-blur-xl
border
border-white/10
shadow-2xl p-6 rounded-xl mt-4">

                            <h3 className="text-2xl font-bold mb-4">
                                Comparison Result
                            </h3>

                            <p>
                                ATS Before:
                                {" "}
                                {comparison.ats_before}%
                            </p>

                            <p>
                                ATS After:
                                {" "}
                                {comparison.ats_after}%
                            </p>

                            <p>
                                ATS Change:
                                {" "}
                                {comparison.ats_change > 0
                                    ? `+${comparison.ats_change}`
                                    : comparison.ats_change}
                                %
                            </p>

                            <br />

                            <p>
                                Old Role:
                                {" "}
                                {comparison.old_role}
                            </p>

                            <p>
                                New Role:
                                {" "}
                                {comparison.new_role}
                            </p>

                            <br />

                            <h4>
                                Skills Added
                            </h4>

                            <ul>
                                {
                                    comparison.added_skills?.map(
                                        (skill, index) => (
                                            <li key={index}>
                                                + {skill}
                                            </li>
                                        )
                                    )
                                }
                            </ul>

                            <h4 className="mt-4">
                                Skills Removed
                            </h4>

                            <ul>
                                {
                                    comparison.removed_skills?.map(
                                        (skill, index) => (
                                            <li key={index}>
                                                - {skill}
                                            </li>
                                        )
                                    )
                                }
                            </ul>

                        </div>

                    )
                }
                {result && (

                    <div
                        className="
max-w-5xl
mx-auto
mt-12
bg-white/5
backdrop-blur-xl
border
border-white/10
rounded-3xl
p-8
"
                    >

                        <h2 className="
text-3xl
font-bold
mb-6
text-center
"
                        >
                            AI Resume Assistant
                        </h2>

                        <input
                            type="text"
                            placeholder="Ask anything about your resume..."
                            value={question}
                            onChange={(e) =>
                                setQuestion(e.target.value)
                            }
                            className="
w-full
p-4
rounded-xl
bg-black/40
border
border-white/10
mb-4
"
                        />

                        <button
                            onClick={askChatbot}
                            className="
bg-purple-600
hover:bg-purple-700
px-6
py-3
rounded-xl
font-bold
"
                        >
                            Ask AI
                        </button>

                        {chatLoading && (
                            <p className="mt-4">
                                Thinking...
                            </p>
                        )}

                        {chatAnswer && (

                            <div className="
mt-6
bg-black/30
p-6
rounded-xl
">

                                <h3 className="
font-bold
mb-2
">
                                    AI Answer
                                </h3>

                                <pre className="
whitespace-pre-wrap
text-gray-200
">
                                    {chatAnswer}
                                </pre>

                            </div>

                        )}

                    </div>

                )}

            </div>

        </>)

}
