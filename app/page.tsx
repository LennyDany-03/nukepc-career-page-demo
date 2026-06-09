'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, MapPin, Briefcase, Clock, Users, Lightbulb, Target, Gamepad2, BookOpen, Globe, Star, ChevronRight, Menu, X, Loader2, Upload, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  employment_type: 'internship' | 'fulltime' | null;
  description: string;
  skills: string[];
  min_salary: string;
  max_salary: string;
  salary_frequency: 'annual' | 'monthly';
  application_deadline: string;
  application_template: 'internship' | 'fulltime' | 'custom';
  status: 'published' | 'draft';
  
  // Custom form toggles
  customize_resume: boolean;
  customize_cover_letter: boolean;
  customize_portfolio: boolean;
  customize_phone: boolean;
  
  created_at: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true }
}

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { staggerChildren: 0.1 },
}

export default function Page() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)
  const [selectedDept, setSelectedDept] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Dynamic API states
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
      const res = await fetch(`${baseUrl}/jobs/`)
      if (!res.ok) {
        throw new Error(`Failed to fetch jobs: ${res.statusText}`)
      }
      const data = await res.json()
      const jobsList = Array.isArray(data) ? data : (data && Array.isArray(data.results) ? data.results : [])
      const publishedJobs = jobsList.filter((job: Job) => !job.status || job.status === 'published')
      setJobs(publishedJobs)
      setError(null)
    } catch (err: any) {
      console.error(err)
      setError('Could not connect to the job listings server. Please ensure the backend is running and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const whyJoinUs = [
    {
      icon: Users,
      title: 'Fast Growth',
      description: 'Work in a rapidly growing tech startup scaling to new heights.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'Build products used by thousands of PC enthusiasts worldwide.',
    },
    {
      icon: Target,
      title: 'Ownership',
      description: 'Take responsibility and make real impact on the company.',
    },
    {
      icon: Gamepad2,
      title: 'Gaming Culture',
      description: 'Work alongside passionate PC gamers and enthusiasts.',
    },
    {
      icon: BookOpen,
      title: 'Learning Budget',
      description: 'Continuous learning, certifications, and skill development.',
    },
    {
      icon: Globe,
      title: 'Flexible Environment',
      description: 'Healthy work-life balance with flexible work arrangements.',
    },
  ]

  const timelineSteps = [
    { step: 'Application', description: 'Submit your resume and portfolio' },
    { step: 'Resume Screening', description: 'Our team reviews your profile' },
    { step: 'Technical Assessment', description: 'Showcase your skills' },
    { step: 'Interview', description: 'Meet our team members' },
    { step: 'Offer Letter', description: 'Welcome aboard!' },
  ]

  const testimonials = [
    {
      name: 'Arjun Patel',
      role: 'Frontend Developer',
      text: 'NukePC gave me the opportunity to work on cutting-edge technologies while being part of an amazing team that cares about growth.',
      initials: 'AP',
    },
    {
      name: 'Priya Singh',
      role: 'Product Designer',
      text: 'The culture here is incredible. Every idea is heard, and we truly empower each other to push boundaries.',
      initials: 'PS',
    },
    {
      name: 'Rahul Kumar',
      role: 'Backend Developer',
      text: 'Working at NukePC feels like being part of a mission to revolutionize the custom PC industry.',
      initials: 'RK',
    },
  ]

  const faqs = [
    {
      question: 'How do I apply?',
      answer: 'You can apply directly through our careers page. Fill out the application form with your resume, portfolio, and other details. Our team will review your profile and get back to you within 2-3 weeks.',
    },
    {
      question: 'Do you offer internships?',
      answer: 'Yes! We have a comprehensive internship program with mentorship, real project experience, and potential PPO opportunities. Interns get to work on meaningful projects and learn from experienced professionals.',
    },
    {
      question: 'Is remote work available?',
      answer: 'We offer flexible work arrangements for most positions. Some roles require office presence for collaboration, while others are fully remote. This will be clearly mentioned in the job description.',
    },
    {
      question: 'What technologies do you use?',
      answer: 'Our tech stack includes Next.js, React, Node.js, TypeScript, PostgreSQL, and more. We focus on modern, scalable technologies and are always exploring new tools that improve our products.',
    },
    {
      question: 'How long does the hiring process take?',
      answer: 'Typically, our hiring process takes 3-4 weeks from application to offer. The timeline depends on the role and your availability for interviews.',
    },
  ]

  const filteredJobs = jobs.filter((job) => {
    const matchesDept = selectedDept === 'All' || job.department.toLowerCase() === selectedDept.toLowerCase()
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDept && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#050505]/80 border-b border-[#222222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <Image 
                src="/Nuke_Logo.png" 
                alt="NukePC Logo" 
                width={120} 
                height={32} 
                className="h-8 w-auto object-contain"
                priority
              />
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center bg-[#151515]/90 border border-white/10 rounded-full p-1 gap-1 shadow-lg backdrop-blur-md">
              <a href="#" className="text-sm text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2 rounded-full transition-all duration-300 font-medium">Prebuild</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2 rounded-full transition-all duration-300 font-medium">Accessories</a>
              <a href="#" className="text-sm bg-white text-black px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm">Career</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2 rounded-full transition-all duration-300 font-medium">My Configurations</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2 rounded-full transition-all duration-300 font-medium">Gallery</a>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <button className="hidden sm:block bg-[#FF5A2C] hover:bg-[#ff4d1a] text-white px-6 py-2 rounded-full font-medium transition">
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
              <a href="#" className="block text-sm text-gray-400 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition font-medium">Prebuild</a>
              <a href="#" className="block text-sm text-gray-400 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition font-medium">Accessories</a>
              <a href="#" className="block text-sm bg-white text-black px-3 py-2 rounded-lg font-semibold transition">About</a>
              <a href="#" className="block text-sm text-gray-400 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition font-medium">My Configurations</a>
              <a href="#" className="block text-sm text-gray-400 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition font-medium">Gallery</a>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
        {/* Background Orbs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#FF5A2C] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#0066ff] rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <motion.div {...fadeInUp}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Build The{' '}
              <span className="text-[#FF5A2C]">Future</span>{' '}
              With Us
            </h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-lg">
              Join a passionate team redefining custom PC experiences and empowering thousands of gamers, creators, and professionals worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button 
                onClick={() => document.getElementById('jobs-section')?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#FF5A2C] hover:bg-[#ff4d1a] text-white px-8 py-4 rounded-full font-bold transition flex items-center justify-center gap-2"
              >
                View Open Positions
                <ChevronRight size={20} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-[#FF5A2C] text-[#FF5A2C] hover:bg-[#FF5A2C]/10 px-8 py-4 rounded-full font-bold transition"
              >
                Life At NukePC
              </motion.button>
            </div>
          </motion.div>

          {/* Right Content - Illustration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-96 hidden md:flex items-center justify-center"
          >
            <div className="relative w-full h-full">
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-10 right-10 w-32 h-32 bg-[#FF5A2C]/20 rounded-lg border border-[#FF5A2C]/50 backdrop-blur-lg flex items-center justify-center"
              >
                <Gamepad2 size={64} className="text-[#FF5A2C]" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute bottom-10 left-10 w-28 h-28 bg-[#0066ff]/20 rounded-lg border border-[#0066ff]/50 backdrop-blur-lg flex items-center justify-center"
              >
                <Lightbulb size={48} className="text-[#0066ff]" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                className="absolute top-1/2 right-0 w-24 h-24 bg-[#00cc99]/20 rounded-lg border border-[#00cc99]/50 backdrop-blur-lg flex items-center justify-center"
              >
                <Users size={40} className="text-[#00cc99]" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why <span className="text-[#FF5A2C]">NukePC?</span></h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Experience a workplace where innovation meets culture</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {whyJoinUs.map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ y: -10, boxShadow: '0 0 30px rgba(255, 90, 44, 0.2)' }}
                  className="bg-[#0f0f0f] border border-[#222222] rounded-2xl p-8 backdrop-blur-lg hover:border-[#FF5A2C]/50 transition"
                >
                  <div className="w-14 h-14 bg-[#FF5A2C]/20 rounded-lg flex items-center justify-center mb-6">
                    <Icon size={28} className="text-[#FF5A2C]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="jobs-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Open <span className="text-[#FF5A2C]">Positions</span></h2>
            <p className="text-gray-400 text-lg">Find your perfect role and grow with us</p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div {...fadeInUp} className="mb-12 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search positions by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#222222] rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5A2C] transition"
              />
            </div>

            {/* Department Filter */}
            <div className="flex flex-wrap gap-3">
              {(() => {
                const defaultDepts = ['All', 'Engineering', 'Design', 'Marketing', 'Operations']
                const departments = jobs.length > 0 
                  ? ['All', ...Array.from(new Set(jobs.map(j => j.department))).filter(Boolean)] 
                  : defaultDepts
                return departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`px-6 py-2 rounded-full font-medium transition ${
                      selectedDept.toLowerCase() === dept.toLowerCase()
                        ? 'bg-[#FF5A2C] text-white'
                        : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#222222]'
                    }`}
                  >
                    {dept}
                  </button>
                ))
              })()}
            </div>
          </motion.div>

          {/* Job Cards */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-[#1a1a1a]/30 border border-[#222222] rounded-2xl">
              <Loader2 className="animate-spin text-[#FF5A2C] mb-4" size={40} />
              <p className="text-lg font-medium">Loading open positions...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto bg-[#1a1a1a]/30 border border-[#222222] rounded-2xl px-6">
              <AlertTriangle className="text-[#ff3333] mb-4" size={40} />
              <p className="text-lg font-medium text-white mb-2">Failed to load positions</p>
              <p className="text-gray-400 text-sm mb-6">{error}</p>
              <button
                onClick={fetchJobs}
                className="bg-[#FF5A2C] hover:bg-[#ff4d1a] text-white px-6 py-2 rounded-full font-bold transition text-sm"
              >
                Try Again
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-[#1a1a1a]/30 border border-[#222222] rounded-2xl">
              <p className="text-lg font-medium text-gray-400">No open positions found matching your criteria.</p>
              <p className="text-sm mt-2 text-gray-600">Try adjusting your search query or department filters.</p>
            </div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="space-y-4"
            >
              {filteredJobs.map((job, idx) => (
                <motion.div
                  key={job.id || idx}
                  variants={fadeInUp}
                  whileHover={{ x: 10, boxShadow: '0 0 30px rgba(255, 90, 44, 0.15)' }}
                  onClick={() => router.push(`/jobs/${job.id}`)}
                  className="bg-[#1a1a1a] border border-[#222222] rounded-xl p-6 hover:border-[#FF5A2C]/50 transition cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-[#FF5A2C] transition">{job.title}</h3>
                      <p className="text-gray-400 mb-4">{job.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 items-center">
                        <div className="flex items-center gap-2">
                          <Briefcase size={16} className="text-[#FF5A2C]" />
                          {job.department}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-[#FF5A2C]" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-[#FF5A2C]" />
                          {job.employment_type === 'fulltime' ? 'Full-time' : job.employment_type === 'internship' ? 'Internship' : 'Contract'}
                        </div>
                        {job.min_salary && job.max_salary && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#FF5A2C] font-semibold text-base">₹</span>
                            <span>
                              {(() => {
                                const minVal = parseFloat(job.min_salary);
                                const maxVal = parseFloat(job.max_salary);
                                if (isNaN(minVal) || isNaN(maxVal)) return `${job.min_salary} - ${job.max_salary} / ${job.salary_frequency}`;
                                const formatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
                                return `${formatter.format(minVal)} - ${formatter.format(maxVal)} / ${job.salary_frequency === 'annual' ? 'yr' : 'mo'}`;
                              })()}
                            </span>
                          </div>
                        )}
                        {job.application_deadline && (
                          <div className="text-xs text-gray-600 bg-gray-900 border border-gray-800 px-2 py-0.5 rounded">
                            Apply by: {new Date(job.application_deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                        )}
                      </div>

                      {/* Skills */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {job.skills.map((skill, sIdx) => (
                            <span key={sIdx} className="text-xs bg-[#FF5A2C]/10 text-[#FF5A2C] border border-[#FF5A2C]/20 px-2.5 py-0.5 rounded-full font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card onClick trigger
                        router.push(`/jobs/${job.id}`);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#FF5A2C] hover:bg-[#ff4d1a] text-white px-8 py-3 rounded-lg font-bold transition whitespace-nowrap self-start md:self-center"
                    >
                      Apply Now
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>



      {/* Timeline Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Hiring <span className="text-[#FF5A2C]">Process</span></h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Timeline Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5A2C] via-[#0066ff] to-[#00cc99] -translate-y-1/2"></div>

            {/* Timeline Steps */}
            <div className="grid md:grid-cols-5 gap-8">
              {timelineSteps.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: true }}
                  className="relative text-center"
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#050505] border-4 border-[#FF5A2C] rounded-full flex items-center justify-center font-bold text-lg z-10 relative">
                      {idx + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.step}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our <span className="text-[#FF5A2C]">Team Says</span></h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-[#0f0f0f] border border-[#222222] rounded-xl p-8 backdrop-blur-lg"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#FF5A2C] rounded-full flex items-center justify-center font-bold text-lg">
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-[#FF5A2C] text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-400 italic">"{testimonial.text}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-[#FF5A2C] text-[#FF5A2C]" />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f5f1ed]">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#050505]">F<span className="text-[#FF5A2C]">AQ</span></h2>
            <p className="text-[#666666] text-base leading-relaxed max-w-2xl mx-auto">
              Welcome to our FAQ section! Here, we've compiled answers to the most common questions about our products, services, and policies to help you find the information you need quickly. Whether you're curious about PC configurations, order tracking, or our return policy, you'll find all the details right here. Still have questions? Feel free to reach out to our support team—we're here to help!
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="space-y-3"
          >
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition"
                >
                  <h3 className="text-base font-bold text-left text-[#050505]">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: expandedFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 ml-4"
                  >
                    <div className="w-10 h-10 bg-[#e8e8e8] hover:bg-[#d8d8d8] rounded-lg flex items-center justify-center transition">
                      {expandedFaq === idx ? '−' : '+'}
                    </div>
                  </motion.div>
                </button>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: expandedFaq === idx ? 1 : 0,
                    height: expandedFaq === idx ? 'auto' : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="px-5 pb-5 text-[#666666]"
                >
                  {faq.answer}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FF5A2C]/20 via-[#0066ff]/10 to-[#FF5A2C]/20 border border-[#FF5A2C]/30 p-12 md:p-16"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5A2C] via-transparent to-[#FF5A2C] opacity-0 blur-3xl -z-10"></div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Power Your <span className="text-[#FF5A2C]">Career?</span></h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join NukePC and help shape the future of custom computing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => document.getElementById('jobs-section')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#FF5A2C] hover:bg-[#ff4d1a] text-white px-8 py-4 rounded-full font-bold transition text-lg"
            >
              Apply Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-[#FF5A2C] text-[#FF5A2C] hover:bg-[#FF5A2C]/10 px-8 py-4 rounded-full font-bold transition text-lg"
            >
              Contact HR
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f5f1ed] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div>
              <div className="mb-4">
                <svg width="120" height="40" viewBox="0 0 200 60" className="h-8 w-auto">
                  <text x="20" y="35" fontSize="28" fontWeight="bold" fill="#050505">NUKEPC</text>
                </svg>
              </div>
              <p className="text-[#666666] text-sm leading-relaxed">
                Hassle-free computing experience with precision-built PCs designed just for you. We deeply consider a PC is an investment to POWER YOUR JOURNEY
              </p>
            </div>

            {/* Links Section 1 */}
            <div>
              <h4 className="font-bold mb-4 text-[#050505]">About Us</h4>
              <ul className="space-y-2 text-[#666666] text-sm">
                <li><a href="#" className="hover:text-[#FF5A2C] transition">Prebuild</a></li>
                <li><a href="#" className="hover:text-[#FF5A2C] transition">Accessories</a></li>
                <li><a href="#" className="hover:text-[#FF5A2C] transition">Gallery</a></li>
              </ul>
            </div>

            {/* Links Section 2 */}
            <div>
              <h4 className="font-bold mb-4 text-[#050505]">Contact Us</h4>
              <ul className="space-y-2 text-[#666666] text-sm">
                <li><a href="#" className="hover:text-[#FF5A2C] transition">Refund Policy</a></li>
                <li><a href="#" className="hover:text-[#FF5A2C] transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#FF5A2C] transition">Terms of Service</a></li>
              </ul>
            </div>

            {/* Reach Out Section */}
            <div>
              <h4 className="font-bold mb-4 text-[#050505]">Reach to us</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FF5A2C] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">@</span>
                  </div>
                  <div>
                    <p className="text-[#FF5A2C] font-semibold text-xs">For Support</p>
                    <p className="text-[#666666] text-sm">support@nukepc.in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FF5A2C] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">@</span>
                  </div>
                  <div>
                    <p className="text-[#FF5A2C] font-semibold text-xs">For Sales</p>
                    <p className="text-[#666666] text-sm">enquiry@nukepc.in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FF5A2C] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">📞</span>
                  </div>
                  <div>
                    <p className="text-[#FF5A2C] font-semibold text-xs">For Instant Replies</p>
                    <p className="text-[#666666] text-sm">+91 9025380083</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FF5A2C] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">📍</span>
                  </div>
                  <div>
                    <p className="text-[#FF5A2C] font-semibold text-xs">Our Address</p>
                    <p className="text-[#666666] text-sm">Chennai, TN</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Section */}
          <div className="border-t border-[#d8d0c8] pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[#999999] text-sm">© 2026 Nuke Technologies Private Limited. All Rights Reserved</p>
              <div className="flex gap-4">
                <a href="#" className="text-[#999999] hover:text-[#FF5A2C] transition">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 . .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.016 12.016 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </a>
                <a href="#" className="text-[#999999] hover:text-[#FF5A2C] transition">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9-1.75 9-5.5v-1a4.5 4.5 0 00-4-4.5z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
