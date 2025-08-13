"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LayoutDashboard,
  FileSearch,
  Users,
  CreditCard,
  Upload,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  Briefcase,
  Target,
  Award,
} from "lucide-react"
import { cn } from "@/lib/utils"

type NavItem = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
  { id: "analyzer", label: "Resume Analyzer", icon: FileSearch, color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
  { id: "candidates", label: "Candidates", icon: Users, color: "bg-gradient-to-r from-green-500 to-emerald-500" },
  { id: "billing", label: "Billing", icon: CreditCard, color: "bg-gradient-to-r from-orange-500 to-red-500" },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const analyzeResumes = async () => {
    setIsAnalyzing(true)
    // Simulate analysis
    setTimeout(() => {
      const mockResults = uploadedFiles
        .map((file, index) => ({
          filename: file.name,
          matchScore: Math.floor(Math.random() * 40) + 60,
          keyTerms: ["React", "JavaScript", "Node.js", "TypeScript"].slice(0, Math.floor(Math.random() * 4) + 1),
        }))
        .sort((a, b) => b.matchScore - a.matchScore)

      setAnalysisResults(mockResults)
      setIsAnalyzing(false)
    }, 2000)
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome Back! 👋
          </h1>
          <p className="text-muted-foreground mt-2">Here's what's happening with your recruitment today.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Resumes</CardTitle>
            <FileSearch className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">1,247</div>
            <p className="text-xs text-purple-600 dark:text-purple-400">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">23</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">+3 new this week</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Matches Found</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">89</div>
            <p className="text-xs text-green-600 dark:text-green-400">+15% match rate</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Hired</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">12</div>
            <p className="text-xs text-orange-600 dark:text-orange-400">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { action: "New resume uploaded", time: "2 minutes ago", color: "bg-blue-100 text-blue-800" },
              { action: "Job analysis completed", time: "15 minutes ago", color: "bg-green-100 text-green-800" },
              { action: "Candidate shortlisted", time: "1 hour ago", color: "bg-purple-100 text-purple-800" },
              { action: "Interview scheduled", time: "3 hours ago", color: "bg-orange-100 text-orange-800" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">{item.action}</span>
                <Badge variant="secondary" className={item.color}>
                  {item.time}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Match Accuracy</span>
                <span className="font-medium">94%</span>
              </div>
              <Progress value={94} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing Speed</span>
                <span className="font-medium">87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>User Satisfaction</span>
                <span className="font-medium">96%</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderAnalyzer = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Resume Analyzer
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upload your pool of resumes, paste your job description, and instantly see the best matches.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/10 dark:to-cyan-950/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Upload className="h-5 w-5" />
              Upload Resumes
            </CardTitle>
            <CardDescription>Upload multiple PDF or DOCX files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                multiple
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <p className="text-blue-600 font-medium">Click to upload or drag and drop</p>
                <p className="text-blue-500 text-sm mt-1">PDF, DOCX up to 10MB each</p>
              </label>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="font-medium text-blue-700 dark:text-blue-300">Uploaded Files:</p>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                    <FileSearch className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-800 dark:text-blue-200">{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Job Description Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/10 dark:to-emerald-950/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <FileSearch className="h-5 w-5" />
              Job Description
            </CardTitle>
            <CardDescription>Paste the job requirements and description</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste your job description here..."
              className="w-full h-48 p-4 border border-green-200 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </CardContent>
        </Card>
      </div>

      {/* Analyze Button */}
      <div className="text-center">
        <Button
          onClick={analyzeResumes}
          disabled={uploadedFiles.length === 0 || !jobDescription.trim() || isAnalyzing}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Resumes"}
        </Button>
      </div>

      {/* Results */}
      {isAnalyzing && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium">Analyzing resumes...</p>
            <p className="text-muted-foreground">This may take a few moments</p>
          </CardContent>
        </Card>
      )}

      {analysisResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Analysis Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisResults.map((result, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="truncate">{result.filename}</span>
                    <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      {result.matchScore}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={result.matchScore} className="h-2" />
                    <div>
                      <p className="text-sm font-medium mb-2">Key Terms Found:</p>
                      <div className="flex flex-wrap gap-1">
                        {result.keyTerms.map((term: string, termIndex: number) => (
                          <Badge key={termIndex} variant="outline" className="text-xs">
                            {term}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderCandidates = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Candidates
        </h1>
        <p className="text-muted-foreground">Manage your candidate pipeline</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: "Sarah Johnson", role: "Frontend Developer", score: 95, status: "Interview Scheduled" },
          { name: "Mike Chen", role: "Full Stack Developer", score: 89, status: "Under Review" },
          { name: "Emily Davis", role: "UI/UX Designer", score: 92, status: "Shortlisted" },
          { name: "Alex Rodriguez", role: "Backend Developer", score: 87, status: "New Application" },
          { name: "Lisa Wang", role: "DevOps Engineer", score: 91, status: "Technical Test" },
          { name: "David Brown", role: "Product Manager", score: 88, status: "Final Round" },
        ].map((candidate, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{candidate.name}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{candidate.score}</span>
                </div>
              </CardTitle>
              <CardDescription>{candidate.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Progress value={candidate.score} className="h-2" />
                <Badge
                  variant="secondary"
                  className={cn(
                    "w-full justify-center",
                    candidate.status === "Interview Scheduled" && "bg-blue-100 text-blue-800",
                    candidate.status === "Under Review" && "bg-yellow-100 text-yellow-800",
                    candidate.status === "Shortlisted" && "bg-green-100 text-green-800",
                    candidate.status === "New Application" && "bg-gray-100 text-gray-800",
                    candidate.status === "Technical Test" && "bg-purple-100 text-purple-800",
                    candidate.status === "Final Round" && "bg-orange-100 text-orange-800",
                  )}
                >
                  {candidate.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderBilling = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Billing & Plans
        </h1>
        <p className="text-muted-foreground">Manage your subscription and usage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            name: "Starter",
            price: "$29",
            period: "/month",
            features: ["100 Resume Analyses", "Basic Matching", "Email Support"],
            color: "from-blue-500 to-cyan-500",
            current: false,
          },
          {
            name: "Professional",
            price: "$79",
            period: "/month",
            features: ["500 Resume Analyses", "Advanced Matching", "Priority Support", "Custom Reports"],
            color: "from-purple-500 to-pink-500",
            current: true,
          },
          {
            name: "Enterprise",
            price: "$199",
            period: "/month",
            features: ["Unlimited Analyses", "AI-Powered Insights", "24/7 Support", "API Access"],
            color: "from-orange-500 to-red-500",
            current: false,
          },
        ].map((plan, index) => (
          <Card
            key={index}
            className={cn("border-0 shadow-lg relative overflow-hidden", plan.current && "ring-2 ring-purple-500")}
          >
            {plan.current && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-medium">
                Current Plan
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="flex items-baseline justify-center gap-1">
                <span
                  className={cn(
                    "text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                    `bg-gradient-to-r ${plan.color}`,
                  )}
                >
                  {plan.price}
                </span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={cn(
                  "w-full text-white",
                  plan.current
                    ? "bg-gradient-to-r from-gray-500 to-gray-600"
                    : `bg-gradient-to-r ${plan.color} hover:opacity-90`,
                )}
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Stats */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Current Usage</CardTitle>
          <CardDescription>Your usage for this billing period</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Resume Analyses</span>
              <span className="font-medium">342 / 500</span>
            </div>
            <Progress value={68} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>API Calls</span>
              <span className="font-medium">1,247 / 2,000</span>
            </div>
            <Progress value={62} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Storage Used</span>
              <span className="font-medium">2.3 GB / 10 GB</span>
            </div>
            <Progress value={23} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard()
      case "analyzer":
        return renderAnalyzer()
      case "candidates":
        return renderCandidates()
      case "billing":
        return renderBilling()
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-800 shadow-xl border-r border-slate-200 dark:border-slate-700">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <FileSearch className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ResumeAI
              </h1>
              <p className="text-xs text-muted-foreground">HR Platform</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group",
                    activeTab === item.id
                      ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 text-purple-700 dark:text-purple-300 shadow-md"
                      : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300",
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                      activeTab === item.id
                        ? item.color
                        : "bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors duration-200",
                        activeTab === item.id ? "text-white" : "text-slate-500 dark:text-slate-400",
                      )}
                    />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{renderContent()}</div>
      </div>
    </div>
  )
}
