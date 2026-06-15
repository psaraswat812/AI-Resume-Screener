"use client"

import {
  Brain,
  FileText,
  BarChart3,
  Bot,
  Briefcase,
  Target
} from "lucide-react"

export default function LandingPage() {

  return (

    <div className="
    min-h-screen
    bg-gradient-to-br
    from-gray-950
    via-black
    to-gray-900
    text-white
    ">

      {/* Hero Section */}

      <section className="
      flex
      flex-col
      items-center
      justify-center
      text-center
      px-6
      py-24
      ">

        <h1 className="
        text-7xl
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

        <p className="
        mt-6
        text-2xl
        text-gray-300
        max-w-3xl
        ">
          Analyze your resume with AI,
          improve ATS scores,
          identify missing skills,
          get job recommendations,
          and land better opportunities.
        </p>

        <div className="
        flex
        gap-4
        mt-10
        ">

          <a
            href="/signup"
            className="
            bg-green-600
            hover:bg-green-700
            px-8
            py-4
            rounded-xl
            font-bold
            "
          >
            Get Started
          </a>

          <a
            href="/login"
            className="
            bg-blue-600
            hover:bg-blue-700
            px-8
            py-4
            rounded-xl
            font-bold
            "
          >
            Login
          </a>

        </div>

      </section>

      {/* Features */}

      <section className="
      max-w-7xl
      mx-auto
      px-6
      pb-24
      ">

        <h2 className="
        text-4xl
        font-bold
        text-center
        mb-12
        ">
          Powerful Features
        </h2>

        <div className="
        grid
        md:grid-cols-3
        gap-8
        ">

          <div className="
          bg-white/10
          p-6
          rounded-2xl
          backdrop-blur-lg
          ">
            <Target size={40} />
            <h3 className="text-2xl font-bold mt-4">
              ATS Analysis
            </h3>
            <p className="text-gray-300 mt-2">
              Calculate ATS score and
              identify missing keywords.
            </p>
          </div>

          <div className="
          bg-white/10
          p-6
          rounded-2xl
          ">
            <Brain size={40} />
            <h3 className="text-2xl font-bold mt-4">
              AI Resume Rewrite
            </h3>
            <p className="text-gray-300 mt-2">
              Improve resume content
              using Gemini AI.
            </p>
          </div>

          <div className="
          bg-white/10
          p-6
          rounded-2xl
          ">
            <Bot size={40} />
            <h3 className="text-2xl font-bold mt-4">
              Resume Chatbot
            </h3>
            <p className="text-gray-300 mt-2">
              Ask why your ATS score is low
              and get personalized guidance.
            </p>
          </div>

          <div className="
          bg-white/10
          p-6
          rounded-2xl
          ">
            <FileText size={40} />
            <h3 className="text-2xl font-bold mt-4">
              Resume Comparison
            </h3>
            <p className="text-gray-300 mt-2">
              Compare resume versions
              and track improvements.
            </p>
          </div>

          <div className="
          bg-white/10
          p-6
          rounded-2xl
          ">
            <Briefcase size={40} />
            <h3 className="text-2xl font-bold mt-4">
              Job Recommendations
            </h3>
            <p className="text-gray-300 mt-2">
              Get AI-powered job suggestions
              based on your skills.
            </p>
          </div>

          <div className="
          bg-white/10
          p-6
          rounded-2xl
          ">
            <BarChart3 size={40} />
            <h3 className="text-2xl font-bold mt-4">
              Recruiter Dashboard
            </h3>
            <p className="text-gray-300 mt-2">
              Analyze candidates and
              recruitment metrics.
            </p>
          </div>

        </div>

      </section>

      {/* Footer */}

      <footer className="
      text-center
      text-gray-500
      pb-8
      ">
        Built with ❤️ using
        FastAPI, PostgreSQL,
        Next.js and Gemini AI
      </footer>

    </div>
  )
}