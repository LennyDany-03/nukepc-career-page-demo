'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  ArrowLeft, MapPin, Briefcase, Clock, Loader2, 
  Upload, AlertTriangle, Menu, X, User, Mail, 
  Phone, Link, GraduationCap, Building, Award, 
  Calendar, FileText, CheckCircle2, DollarSign
} from 'lucide-react'

interface Job {
  id: number;
  job_title: string;
  role: string;
  department: string;
  employment_type: string;
  candidate_level: string | null;
  number_of_openings: number | null;
  internship_duration: string | null;
  work_mode: string | null;
  office_location: string | null;
  shift_timing: string | null;
  application_deadline: string | null;
  expected_joining_date: string | null;
  stipend_amount: number | null;
  stipend_visible: boolean;
  ctc_min: number | null;
  ctc_max: number | null;
  salary_visible: boolean;
  probation_period: string | null;
  probation_stipend: number | null;
  notice_period: string | null;
  performance_bonus: boolean;
  performance_bonus_description: string | null;
  other_compensation: string | null;
  min_education: string | null;
  preferred_branch: string | null;
  min_cgpa: number | null;
  year_of_study: string | null;
  graduation_year: number | null;
  min_experience: number | null;
  max_experience: number | null;
  required_skills: string;
  good_to_have_skills: string;
  portfolio_required: boolean;
  assignment_round: boolean;
  assignment_description: string | null;
  certifications: string | null;
  previous_industry_experience: string | null;
  led_team: boolean | null;
  roles_responsibilities: string | null;
  what_intern_learns: string | null;
  what_we_offer: string | null;
  growth_path: string | null;
  team_structure: string | null;
  perks_benefits: string | null;
  additional_info: string | null;
  screening_question_1: string | null;
  screening_question_2: string | null;
  screening_question_3: string | null;
  status: string;
  scheduled_date: string | null;
  notify_team: boolean;
  created_by: number;
  created_by_email: string;
  created_at: string;
  updated_at: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params?.id

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!jobId) return

    const fetchJobDetails = async () => {
      try {
        setLoading(true)
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        const res = await fetch(`${baseUrl}/jobs/${jobId}/`)
        if (!res.ok) {
          throw new Error(`Failed to fetch job details: ${res.statusText}`)
        }
        const data = await res.json()
        setJob(data)
        setError(null)
      } catch (err: any) {
        console.error(err)
        setError('Could not connect to the job listings server. Please ensure the backend is running and try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetails()
  }, [jobId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0])
    }
  }

  const handleRemoveFile = () => {
    setResumeFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!job) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const payload = new FormData()
      payload.append('job', job.id.toString())
      payload.append('full_name', formData.fullName || '')
      payload.append('email', formData.email || '')

      if (formData.phone) {
        payload.append('phone', formData.phone)
      }
      if (job.portfolio_required && formData.portfolio) {
        payload.append('portfolio', formData.portfolio)
      }
      if (formData.cover_letter) {
        payload.append('cover_letter', formData.cover_letter)
      }
      if (resumeFile) {
        payload.append('resume', resumeFile)
      }

      if (job.employment_type === 'Internship') {
        payload.append('college_name', formData.college_name || '')
        payload.append('degree_branch', formData.degree_branch || '')
        payload.append('year_of_study', formData.year_of_study || '')
        payload.append('cgpa', formData.cgpa || '')
      } else if (job.employment_type === 'Full-time') {
        payload.append('current_company', formData.current_company || '')
        payload.append('total_experience', formData.total_experience || '')
        payload.append('current_ctc', formData.current_ctc || '')
        payload.append('expected_ctc', formData.expected_ctc || '')
        payload.append('notice_period', formData.notice_period || '')
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
      const res = await fetch(`${baseUrl}/applications/`, {
        method: 'POST',
        body: payload,
      })

      if (!res.ok) {
        let errMsg = 'Something went wrong while submitting your application.'
        try {
          const errData = await res.json()
          if (errData && typeof errData === 'object') {
            const errorKeys = Object.keys(errData)
            if (errorKeys.length > 0) {
              const firstKey = errorKeys[0]
              const val = errData[firstKey]
              if (Array.isArray(val)) {
                errMsg = `${firstKey}: ${val[0]}`
              } else if (typeof val === 'string') {
                errMsg = `${firstKey}: ${val}`
              } else {
                errMsg = JSON.stringify(errData)
              }
            }
          }
        } catch (_) {}
        throw new Error(errMsg)
      }

      setSubmitSuccess(true)
    } catch (err: any) {
      console.error(err)
      setSubmitError(err.message || 'Could not connect to the submission server.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#FF5A2C] rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-[#0066ff] rounded-full mix-blend-screen filter blur-3xl opacity-5 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#050505]/80 border-b border-[#222222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              onClick={() => router.push('/')} 
              className="flex items-center gap-2 cursor-pointer group"
            >
              <Image 
                src="/Nuke_Logo.png" 
                alt="NukePC Logo" 
                width={120} 
                height={32} 
                className="h-8 w-auto object-contain transition group-hover:scale-105"
                priority
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center bg-[#151515]/90 border border-white/10 rounded-full p-1 gap-1 shadow-lg backdrop-blur-md">
              <a href="#" onClick={() => router.push('/')} className="text-sm text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2 rounded-full transition-all duration-300 font-medium">Prebuild</a>
              <a href="#" onClick={() => router.push('/')} className="text-sm text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2 rounded-full transition-all duration-300 font-medium">Accessories</a>
              <a href="#" onClick={() => router.push('/')} className="text-sm bg-white text-black px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm">About</a>
              <a href="#" onClick={() => router.push('/')} className="text-sm text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2 rounded-full transition-all duration-300 font-medium">My Configurations</a>
              <a href="#" onClick={() => router.push('/')} className="text-sm text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2 rounded-full transition-all duration-300 font-medium">Gallery</a>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/')} 
                className="hidden sm:block bg-[#FF5A2C] hover:bg-[#ff4d1a] text-white px-6 py-2 rounded-full font-medium transition active:scale-95"
              >
                Login
              </button>
              <button 
                className="md:hidden text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden pb-4 space-y-2 border-t border-[#222222] pt-4 mt-2"
            >
              <a href="#" onClick={() => router.push('/')} className="block text-sm text-gray-400 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition font-medium">Prebuild</a>
              <a href="#" onClick={() => router.push('/')} className="block text-sm text-gray-400 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition font-medium">Accessories</a>
              <a href="#" onClick={() => router.push('/')} className="block text-sm bg-white text-black px-3 py-2 rounded-lg font-semibold transition">About</a>
              <a href="#" onClick={() => router.push('/')} className="block text-sm text-gray-400 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition font-medium">My Configurations</a>
              <a href="#" onClick={() => router.push('/')} className="block text-sm text-gray-400 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition font-medium">Gallery</a>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
        {/* Back navigation */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#FF5A2C] mb-10 group transition"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1.5 transition-transform" />
          Back to Open Positions
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 text-gray-400">
            <Loader2 className="animate-spin text-[#FF5A2C] mb-4" size={48} />
            <p className="text-lg font-medium text-gray-300">Loading position details...</p>
          </div>
        ) : error || !job ? (
          <div className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto bg-[#0f0f0f] border border-[#222222] p-8 rounded-2xl">
            <AlertTriangle className="text-[#ff3333] mb-4" size={48} />
            <h2 className="text-xl font-bold text-white mb-2">Error Loading Page</h2>
            <p className="text-gray-400 text-sm mb-6">{error || 'Job not found.'}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-[#FF5A2C] hover:bg-[#ff4d1a] text-white px-8 py-3 rounded-full font-bold transition text-sm shadow-lg shadow-[#FF5A2C]/20"
            >
              Return Home
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Job Details */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="lg:col-span-7 space-y-8"
            >
              {/* Header Title Card */}
              <div className="bg-[#0f0f0f]/60 border border-[#1f1f1f] rounded-2xl p-6 md:p-8 backdrop-blur-md">
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <span className="text-xs font-bold text-[#FF5A2C] uppercase tracking-widest bg-[#FF5A2C]/10 border border-[#FF5A2C]/20 px-3 py-1.5 rounded-full">
                    {job.department}
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                    job.employment_type === 'Internship'
                      ? 'text-[#00cc99] bg-[#00cc99]/10 border-[#00cc99]/20'
                      : 'text-[#0066ff] bg-[#0066ff]/10 border-[#0066ff]/20'
                  }`}>
                    {job.employment_type === 'Internship' ? 'Internship' : job.employment_type}
                  </span>
                  {job.candidate_level && (
                    <span className="text-xs font-medium text-gray-400 bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-full">
                      {job.candidate_level}
                    </span>
                  )}
                  {job.number_of_openings && (
                    <span className="text-xs font-medium text-gray-400 bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-full">
                      {job.number_of_openings} opening{job.number_of_openings > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2 leading-tight tracking-tight">
                  {job.job_title}
                </h1>
                {job.role && job.role !== job.job_title && (
                  <p className="text-gray-400 text-sm mt-1.5">{job.role}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-6 items-center border-t border-[#1f1f1f] pt-5">
                  {job.office_location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#FF5A2C]" />
                      <span>{job.office_location}</span>
                    </div>
                  )}
                  {job.work_mode && (
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} className="text-[#FF5A2C]" />
                      <span>{job.work_mode}</span>
                    </div>
                  )}
                  {job.employment_type && (
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-[#FF5A2C]" />
                      <span>{job.employment_type === 'Internship' ? 'Internship' : 'Full-time'}</span>
                    </div>
                  )}
                  {job.shift_timing && (
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-[#FF5A2C]" />
                      <span>{job.shift_timing} Shift</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Compensation Details Card */}
              {((!job.employment_type || job.employment_type !== 'Internship') && job.salary_visible && job.ctc_min != null) || (job.employment_type === 'Internship' && job.stipend_visible && job.stipend_amount != null) || job.application_deadline || job.expected_joining_date ? (
                <div className="bg-[#0f0f0f]/60 border border-[#1f1f1f] rounded-2xl p-6 backdrop-blur-md">
                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    {job.employment_type !== 'Internship' && job.salary_visible && job.ctc_min != null && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#00cc99]/10 border border-[#00cc99]/20 flex items-center justify-center">
                          <span className="text-[#00cc99] font-bold text-xl">₹</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Salary Range</p>
                          <p className="text-lg font-bold text-white mt-0.5">
                            ₹{Intl.NumberFormat('en-IN').format(job.ctc_min)}
                            {job.ctc_max != null && job.ctc_max !== job.ctc_min ? ` - ₹${Intl.NumberFormat('en-IN').format(job.ctc_max)}` : ''}
                            <span className="text-xs text-gray-400 font-medium ml-1">/ yr</span>
                          </p>
                        </div>
                      </div>
                    )}
                    {job.employment_type === 'Internship' && job.stipend_visible && job.stipend_amount != null && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#00cc99]/10 border border-[#00cc99]/20 flex items-center justify-center">
                          <span className="text-[#00cc99] font-bold text-xl">₹</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Stipend</p>
                          <p className="text-lg font-bold text-white mt-0.5">
                            ₹{Intl.NumberFormat('en-IN').format(job.stipend_amount)}
                            <span className="text-xs text-gray-400 font-medium ml-1">/ mo</span>
                          </p>
                        </div>
                      </div>
                    )}
                    {job.application_deadline && (
                      <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-[#1f1f1f] pt-4 md:pt-0 md:pl-6">
                        <div className="w-12 h-12 rounded-xl bg-[#FF5A2C]/10 border border-[#FF5A2C]/20 flex items-center justify-center">
                          <Calendar className="text-[#FF5A2C]" size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Apply Before</p>
                          <p className="text-sm font-bold text-white mt-0.5">
                            {new Date(job.application_deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {job.expected_joining_date && (
                    <div className="mt-4 pt-4 border-t border-[#1f1f1f] flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#0066ff]/10 border border-[#0066ff]/20 flex items-center justify-center flex-shrink-0">
                        <Calendar className="text-[#0066ff]" size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Expected Joining</p>
                        <p className="text-sm font-bold text-white mt-0.5">
                          {new Date(job.expected_joining_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Role Requirements Card */}
              {(job.min_education || job.preferred_branch || job.min_cgpa != null || (job.min_experience != null) || (job.max_experience != null) || job.year_of_study || job.graduation_year || job.led_team != null) && (
                <div className="bg-[#0f0f0f]/60 border border-[#1f1f1f] rounded-2xl p-6 md:p-8 backdrop-blur-md">
                  <h3 className="text-base font-bold text-white mb-5 uppercase tracking-wider border-l-2 border-[#FF5A2C] pl-3">
                    Role Requirements
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    {job.min_education && (
                      <div className="bg-[#161616] border border-[#222222] rounded-xl p-3.5">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Education</p>
                        <p className="text-white font-medium text-xs">{job.min_education}</p>
                      </div>
                    )}
                    {job.preferred_branch && (
                      <div className="bg-[#161616] border border-[#222222] rounded-xl p-3.5">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Preferred Branch</p>
                        <p className="text-white font-medium text-xs">{job.preferred_branch}</p>
                      </div>
                    )}
                    {job.min_cgpa != null && (
                      <div className="bg-[#161616] border border-[#222222] rounded-xl p-3.5">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Min CGPA</p>
                        <p className="text-white font-medium text-xs">{job.min_cgpa}</p>
                      </div>
                    )}
                    {(job.min_experience != null || job.max_experience != null) && (
                      <div className="bg-[#161616] border border-[#222222] rounded-xl p-3.5">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Experience</p>
                        <p className="text-white font-medium text-xs">
                          {job.min_experience != null ? job.min_experience : 0} - {job.max_experience != null ? job.max_experience : '∞'} yrs
                        </p>
                      </div>
                    )}
                    {job.year_of_study && (
                      <div className="bg-[#161616] border border-[#222222] rounded-xl p-3.5">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Year of Study</p>
                        <p className="text-white font-medium text-xs">{job.year_of_study}</p>
                      </div>
                    )}
                    {job.graduation_year && (
                      <div className="bg-[#161616] border border-[#222222] rounded-xl p-3.5">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Grad Year</p>
                        <p className="text-white font-medium text-xs">{job.graduation_year}</p>
                      </div>
                    )}
                    {job.led_team != null && (
                      <div className="bg-[#161616] border border-[#222222] rounded-xl p-3.5">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Team Lead</p>
                        <p className="text-white font-medium text-xs">{job.led_team ? 'Yes' : 'No'}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Skills Card */}
              {(() => {
                const parseSkills = (val: any) => Array.isArray(val) ? val : (() => { try { return JSON.parse(val || '[]'); } catch { return []; } })();
                return parseSkills(job.required_skills).length > 0;
              })() && (
                <div className="bg-[#0f0f0f]/60 border border-[#1f1f1f] rounded-2xl p-6 md:p-8 backdrop-blur-md">
                  <h3 className="text-base font-bold text-white mb-4 uppercase tracking-wider border-l-2 border-[#FF5A2C] pl-3">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {(() => {
                      const parseSkills = (val: any) => Array.isArray(val) ? val : (() => { try { return JSON.parse(val || '[]'); } catch { return []; } })();
                      return parseSkills(job.required_skills);
                    })().map((skill: string, sIdx: number) => (
                      <span key={sIdx} className="text-xs bg-[#FF5A2C]/5 text-gray-300 border border-white/5 hover:border-[#FF5A2C]/40 px-3.5 py-2 rounded-xl font-medium transition cursor-default hover:text-white">
                        {skill}
                      </span>
                    ))}
                  </div>
                  {(() => {
                    const parseSkills = (val: any) => Array.isArray(val) ? val : (() => { try { return JSON.parse(val || '[]'); } catch { return []; } })();
                    return parseSkills(job.good_to_have_skills).length > 0;
                  })() && (
                    <>
                      <h4 className="text-sm font-bold text-gray-400 mt-6 mb-3 uppercase tracking-wider border-l-2 border-gray-600 pl-3">
                        Good to Have
                      </h4>
                      <div className="flex flex-wrap gap-2.5">
                        {(() => {
                          const parseSkills = (val: any) => Array.isArray(val) ? val : (() => { try { return JSON.parse(val || '[]'); } catch { return []; } })();
                          return parseSkills(job.good_to_have_skills);
                        })().map((skill: string, sIdx: number) => (
                          <span key={sIdx} className="text-xs bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500 px-3.5 py-2 rounded-xl font-medium transition cursor-default">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Roles & Responsibilities Card */}
              {job.roles_responsibilities && (
                <div className="bg-[#0f0f0f]/60 border border-[#1f1f1f] rounded-2xl p-6 md:p-8 backdrop-blur-md">
                  <h3 className="text-base font-bold text-white mb-6 uppercase tracking-wider border-l-2 border-[#FF5A2C] pl-3">
                    Roles & Responsibilities
                  </h3>
                  <div className="text-gray-300 leading-relaxed whitespace-pre-line text-sm md:text-base space-y-4">
                    {job.roles_responsibilities}
                  </div>
                </div>
              )}

              {/* What We Offer / Perks / Growth */}
              {(job.what_we_offer || job.perks_benefits || job.growth_path || job.what_intern_learns) && (
                <div className="bg-[#0f0f0f]/60 border border-[#1f1f1f] rounded-2xl p-6 md:p-8 backdrop-blur-md">
                  <h3 className="text-base font-bold text-white mb-6 uppercase tracking-wider border-l-2 border-[#FF5A2C] pl-3">
                    What We Offer
                  </h3>
                  <div className="space-y-5">
                    {job.what_we_offer && (
                      <div className="text-gray-300 leading-relaxed whitespace-pre-line text-sm">
                        <h4 className="text-white font-semibold mb-2 text-xs uppercase tracking-wider">Offer</h4>
                        {job.what_we_offer}
                      </div>
                    )}
                    {job.perks_benefits && (
                      <div className="text-gray-300 leading-relaxed whitespace-pre-line text-sm">
                        <h4 className="text-white font-semibold mb-2 text-xs uppercase tracking-wider">Perks & Benefits</h4>
                        {job.perks_benefits}
                      </div>
                    )}
                    {job.growth_path && (
                      <div className="text-gray-300 leading-relaxed whitespace-pre-line text-sm">
                        <h4 className="text-white font-semibold mb-2 text-xs uppercase tracking-wider">Growth Path</h4>
                        {job.growth_path}
                      </div>
                    )}
                    {job.what_intern_learns && (
                      <div className="text-gray-300 leading-relaxed whitespace-pre-line text-sm">
                        <h4 className="text-white font-semibold mb-2 text-xs uppercase tracking-wider">What You'll Learn</h4>
                        {job.what_intern_learns}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Details Card */}
              {(job.internship_duration || job.probation_period || job.probation_stipend != null || job.notice_period || job.shift_timing || job.performance_bonus || job.performance_bonus_description || job.other_compensation || job.certifications || job.previous_industry_experience || job.team_structure || job.assignment_round || job.assignment_description || job.additional_info) && (
                <div className="bg-[#0f0f0f]/60 border border-[#1f1f1f] rounded-2xl p-6 md:p-8 backdrop-blur-md">
                  <h3 className="text-base font-bold text-white mb-5 uppercase tracking-wider border-l-2 border-[#FF5A2C] pl-3">
                    Additional Details
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {job.internship_duration && (
                      <div className="bg-[#161616] border border-[#222222] rounded-xl p-3">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase">Duration</p>
                        <p className="text-white font-medium text-xs mt-1">{job.internship_duration}</p>
                      </div>
                    )}
                    {job.probation_period && (
                      <div className="bg-[#161616] border border-[#222222] rounded-xl p-3">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase">Probation</p>
                        <p className="text-white font-medium text-xs mt-1">{job.probation_period}{job.probation_stipend != null ? ` (₹${Intl.NumberFormat('en-IN').format(job.probation_stipend)}/mo)` : ''}</p>
                      </div>
                    )}
                    {job.notice_period && (
                      <div className="bg-[#161616] border border-[#222222] rounded-xl p-3">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase">Notice Period</p>
                        <p className="text-white font-medium text-xs mt-1">{job.notice_period}</p>
                      </div>
                    )}
                    {job.shift_timing && (
                      <div className="bg-[#161616] border border-[#222222] rounded-xl p-3">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase">Shift</p>
                        <p className="text-white font-medium text-xs mt-1">{job.shift_timing}</p>
                      </div>
                    )}
                    {job.performance_bonus && (
                      <div className="bg-[#161616] border border-[#222222] rounded-xl p-3">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase">Performance Bonus</p>
                        <p className="text-white font-medium text-xs mt-1">{job.performance_bonus_description || 'Yes'}</p>
                      </div>
                    )}
                    {job.other_compensation && (
                      <div className="bg-[#161616] border border-[#222222] rounded-xl p-3">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase">Other Comp.</p>
                        <p className="text-white font-medium text-xs mt-1">{job.other_compensation}</p>
                      </div>
                    )}
                    {job.assignment_round && job.assignment_description && (
                      <div className="col-span-2 bg-[#161616] border border-[#222222] rounded-xl p-3">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase">Assignment Round</p>
                        <p className="text-white font-medium text-xs mt-1">{job.assignment_description}</p>
                      </div>
                    )}
                  </div>
                  {job.additional_info && (
                    <div className="mt-4 pt-4 border-t border-[#1f1f1f]">
                      <p className="text-[10px] text-gray-500 font-semibold uppercase mb-2">Additional Information</p>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{job.additional_info}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Screening Questions */}
              {(job.screening_question_1 || job.screening_question_2 || job.screening_question_3) && (
                <div className="bg-[#0f0f0f]/60 border border-[#1f1f1f] rounded-2xl p-6 md:p-8 backdrop-blur-md">
                  <h3 className="text-base font-bold text-white mb-5 uppercase tracking-wider border-l-2 border-[#FF5A2C] pl-3">
                    Screening Questions
                  </h3>
                  <ul className="space-y-3">
                    {[job.screening_question_1, job.screening_question_2, job.screening_question_3].filter(Boolean).map((q, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                        <span className="w-6 h-6 rounded-full bg-[#FF5A2C]/10 border border-[#FF5A2C]/20 flex items-center justify-center text-[#FF5A2C] text-xs font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

            {/* Right Column: Dynamic Form */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="lg:col-span-5 bg-[#0f0f0f]/90 border border-[#1f1f1f] rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-lg sticky top-28"
            >
              {submitSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                    className="w-20 h-20 bg-[#00cc99]/10 rounded-full flex items-center justify-center mb-6 border-2 border-[#00cc99]"
                  >
                    <CheckCircle2 className="w-10 h-10 text-[#00cc99]" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2 text-white">Application Submitted!</h3>
                  <p className="text-gray-400 max-w-sm mb-8 text-sm leading-relaxed">
                    Thank you for applying to the {job.job_title} position. Our team will review your application and get back to you soon.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitSuccess(false);
                      router.push('/');
                    }}
                    className="w-full bg-[#00cc99] hover:bg-[#00b386] text-white py-3.5 rounded-xl font-bold transition text-sm active:scale-95 shadow-lg shadow-[#00cc99]/10"
                  >
                    Return to Careers Page
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-white">Apply for this Role</h2>
                    <p className="text-xs text-gray-400 mt-1.5">Please provide your details below to submit your application.</p>
                  </div>

                  {submitError && (
                    <div className="bg-[#ff0000]/5 border border-[#ff0000]/20 rounded-xl p-4 flex gap-3 text-xs text-[#ff3333]">
                      <AlertTriangle className="flex-shrink-0 mt-0.5" size={16} />
                      <div>
                        <p className="font-bold">Submission Failed</p>
                        <p className="mt-0.5 text-gray-400">{submitError}</p>
                      </div>
                    </div>
                  )}

                  {/* COMMON FIELDS */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-2">
                        Full Name <span className="text-[#FF5A2C]">*</span>
                      </label>
                      <div className="relative group">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF5A2C] transition-colors">
                          <User size={16} />
                        </span>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName || ''}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A2C] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF5A2C]/10 transition text-sm"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-2">
                        Email Address <span className="text-[#FF5A2C]">*</span>
                      </label>
                      <div className="relative group">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF5A2C] transition-colors">
                          <Mail size={16} />
                        </span>
                        <input
                          type="email"
                          name="email"
                          value={formData.email || ''}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A2C] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF5A2C]/10 transition text-sm"
                          placeholder="john.doe@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-2">
                        Phone Number <span className="text-[#FF5A2C]">*</span>
                      </label>
                      <div className="relative group">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF5A2C] transition-colors">
                          <Phone size={16} />
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone || ''}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A2C] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF5A2C]/10 transition text-sm"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                    {job.portfolio_required && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-2">
                          Portfolio / GitHub Link <span className="text-[#FF5A2C]">*</span>
                        </label>
                        <div className="relative group">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF5A2C] transition-colors">
                            <Link size={16} />
                          </span>
                          <input
                            type="url"
                            name="portfolio"
                            value={formData.portfolio || ''}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A2C] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF5A2C]/10 transition text-sm"
                            placeholder="https://github.com/username"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">
                      Cover Letter <span className="text-[#FF5A2C]">*</span>
                    </label>
                    <textarea
                      name="cover_letter"
                      value={formData.cover_letter || ''}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A2C] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF5A2C]/10 transition text-sm resize-none"
                      placeholder="Tell us why you are a great fit for this role..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">
                      Upload Resume (PDF, DOC, DOCX) <span className="text-[#FF5A2C]">*</span>
                    </label>
                    
                    {resumeFile ? (
                      <div className="border border-white/10 rounded-xl p-4 bg-[#161616] flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 bg-[#FF5A2C]/10 border border-[#FF5A2C]/20 rounded-lg flex items-center justify-center flex-shrink-0 text-[#FF5A2C]">
                            <FileText size={18} />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-semibold text-white truncate">{resumeFile.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="text-gray-400 hover:text-[#ff3333] p-1.5 hover:bg-white/5 rounded-lg transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="relative border border-dashed border-white/10 hover:border-[#FF5A2C]/50 rounded-xl p-6 flex flex-col items-center justify-center transition cursor-pointer group bg-[#161616]/30">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          required
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className="text-gray-500 group-hover:text-[#FF5A2C] mb-2.5 transition" size={22} />
                        <p className="text-xs text-gray-300 font-medium text-center">
                          Click or drag file to upload
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                          PDF, DOC, or DOCX (Max 5MB)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* TEMPLATE-SPECIFIC FIELDS */}
                  {job.employment_type === 'Internship' && (
                    <div className="border-t border-white/5 pt-5 space-y-4">
                      <h3 className="text-xs font-bold text-[#FF5A2C] uppercase tracking-wider">Education Details</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-300 mb-2">
                            College / University Name <span className="text-[#FF5A2C]">*</span>
                          </label>
                          <div className="relative group">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF5A2C] transition-colors">
                              <Building size={16} />
                            </span>
                            <input
                              type="text"
                              name="college_name"
                              value={formData.college_name || ''}
                              onChange={handleInputChange}
                              required
                              className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A2C] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF5A2C]/10 transition text-sm"
                              placeholder="College Name"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-300 mb-2">
                            Degree & Branch <span className="text-[#FF5A2C]">*</span>
                          </label>
                          <div className="relative group">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF5A2C] transition-colors">
                              <GraduationCap size={16} />
                            </span>
                            <input
                              type="text"
                              name="degree_branch"
                              value={formData.degree_branch || ''}
                              onChange={handleInputChange}
                              required
                              className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A2C] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF5A2C]/10 transition text-sm"
                              placeholder="e.g. B.Tech Computer Science"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-300 mb-2">
                              Year of Study <span className="text-[#FF5A2C]">*</span>
                            </label>
                            <div className="relative group">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF5A2C] transition-colors">
                                <Award size={16} />
                              </span>
                              <input
                                type="number"
                                name="year_of_study"
                                value={formData.year_of_study || ''}
                                onChange={handleInputChange}
                                required
                                min={1}
                                max={6}
                                className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A2C] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF5A2C]/10 transition text-sm"
                                placeholder="3"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-300 mb-2">
                              CGPA / % <span className="text-[#FF5A2C]">*</span>
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              name="cgpa"
                              value={formData.cgpa || ''}
                              onChange={handleInputChange}
                              required
                              min={0}
                              max={100}
                              className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A2C] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF5A2C]/10 transition text-sm"
                              placeholder="8.5"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {job.employment_type === 'Full-time' && (
                    <div className="border-t border-white/5 pt-5 space-y-4">
                      <h3 className="text-xs font-bold text-[#FF5A2C] uppercase tracking-wider">Professional Experience</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-300 mb-2">
                            Current Company & Designation <span className="text-[#FF5A2C]">*</span>
                          </label>
                          <div className="relative group">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF5A2C] transition-colors">
                              <Building size={16} />
                            </span>
                            <input
                              type="text"
                              name="current_company"
                              value={formData.current_company || ''}
                              onChange={handleInputChange}
                              required
                              className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A2C] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF5A2C]/10 transition text-sm"
                              placeholder="e.g. Systems Engineer - Infosys"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-300 mb-2">
                              Total Experience <span className="text-[#FF5A2C]">*</span>
                            </label>
                            <div className="relative group">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF5A2C] transition-colors">
                                <Award size={16} />
                              </span>
                              <input
                                type="number"
                                step="0.1"
                                name="total_experience"
                                value={formData.total_experience || ''}
                                onChange={handleInputChange}
                                required
                                min={0}
                                className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A2C] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF5A2C]/10 transition text-sm"
                                placeholder="3.5 yr"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-300 mb-2">
                              Notice Period (Days) <span className="text-[#FF5A2C]">*</span>
                            </label>
                            <input
                              type="number"
                              name="notice_period"
                              value={formData.notice_period || ''}
                              onChange={handleInputChange}
                              required
                              min={0}
                              className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A2C] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF5A2C]/10 transition text-sm"
                              placeholder="30"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-300 mb-2">
                              Current CTC <span className="text-[#FF5A2C]">*</span>
                            </label>
                            <input
                              type="text"
                              name="current_ctc"
                              value={formData.current_ctc || ''}
                              onChange={handleInputChange}
                              required
                              className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A2C] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF5A2C]/10 transition text-sm"
                              placeholder="e.g. ₹6.5 LPA"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-300 mb-2">
                              Expected CTC <span className="text-[#FF5A2C]">*</span>
                            </label>
                            <input
                              type="text"
                              name="expected_ctc"
                              value={formData.expected_ctc || ''}
                              onChange={handleInputChange}
                              required
                              className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A2C] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF5A2C]/10 transition text-sm"
                              placeholder="e.g. ₹10 LPA"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#FF5A2C] to-[#ff7a54] hover:from-[#ff4d1a] hover:to-[#ff673b] active:scale-[0.98] disabled:from-[#FF5A2C]/50 disabled:to-[#ff7a54]/50 text-white py-3.5 rounded-xl font-bold transition duration-300 flex items-center justify-center gap-2 text-sm shadow-lg shadow-[#FF5A2C]/20"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Submitting Application...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
