import React, { useState } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", org: "", size: "1-10M", note: "" })
  const [formSubmitted, setFormSubmitted] = useState(false)
  
  const [selectedDay, setSelectedDay] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return
    setFormSubmitted(true)
  }

  const handleBookingSubmit = () => {
    if (!selectedDay || !selectedTime) return
    setBookingConfirmed(true)
  }

  const days = ["Mon, June 22", "Tue, June 23", "Wed, June 24", "Thu, June 25"]
  const times = ["9:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"]

  return (
    <div className="space-y-16 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. HEADER */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight">
          Connect with Our{' '}
          <span className="bg-gradient-to-r from-brand-safety to-brand-accent bg-clip-text text-transparent">
            Solutions Team
          </span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Schedule a personalized demo using your active drawings or inquire about enterprise pricing.
        </p>
      </section>

      {/* 2. GRID FORM & SCHEDULER */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
        {/* Contact Form */}
        <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 sm:p-8 shadow-floating space-y-6">
          <h3 className="font-heading font-bold text-lg border-b border-border pb-3 flex items-center gap-2">
            <Mail className="w-5 h-5 text-brand-safety" />
            Submit an Inquiry
          </h3>

          {formSubmitted ? (
            <div className="p-6 bg-brand-success/10 border border-brand-success/25 rounded-xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-brand-success mx-auto" />
              <h4 className="font-heading font-bold text-base text-brand-success">Inquiry Submitted Successfully</h4>
              <p className="text-xs text-muted-foreground">
                Our solutions coordinators will review your project size and contact you within 2 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-350">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded border border-border bg-transparent focus:outline-none focus:border-brand-safety"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-350">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded border border-border bg-transparent focus:outline-none focus:border-brand-safety"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-350">Organization Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Builders"
                    value={formData.org}
                    onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                    className="w-full p-2.5 rounded border border-border bg-transparent focus:outline-none focus:border-brand-safety"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-350">Annual Project Pipeline</label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full p-2.5 rounded border border-border bg-white dark:bg-[#141B2D] focus:outline-none focus:border-brand-safety"
                  >
                    <option value="1-10M">&lt; $10M</option>
                    <option value="10-50M">$10M - $50M</option>
                    <option value="50-200M">$50M - $200M</option>
                    <option value="200M+">$200M+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-350">Project Details / Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your active sites, safety requirements, or RFI bottlenecks..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full p-2.5 rounded border border-border bg-transparent focus:outline-none focus:border-brand-safety"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-safety text-white text-xs font-semibold rounded hover:bg-brand-safety/90 transition-all shadow shadow-brand-safety/10"
              >
                Send Request
              </button>
            </form>
          )}
        </div>

        {/* Demo Scheduler */}
        <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 sm:p-8 shadow-floating space-y-6">
          <h3 className="font-heading font-bold text-lg border-b border-border pb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-accent animate-pulse-slow" />
            Book AI Demo Instantly
          </h3>

          {bookingConfirmed ? (
            <div className="p-6 bg-brand-accent/10 border border-brand-accent/25 rounded-xl text-center space-y-3 text-xs">
              <CheckCircle2 className="w-10 h-10 text-brand-accent mx-auto" />
              <h4 className="font-heading font-bold text-base text-brand-accent">Meeting Scheduled!</h4>
              <p className="text-slate-800 dark:text-slate-200 font-semibold">
                📅 {selectedDay} @ {selectedTime} (Your Local Time)
              </p>
              <p className="text-muted-foreground mt-2">
                We've sent a calendar invite with a Zoom/Google Meet link and instructions on how to upload your drawings for custom scans.
              </p>
            </div>
          ) : (
            <div className="space-y-5 text-xs">
              {/* Day selection */}
              <div className="space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-350 block">1. Select a Day</span>
                <div className="grid grid-cols-2 gap-2">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => { setSelectedDay(day); setBookingConfirmed(false); }}
                      className={`p-2.5 border rounded font-semibold text-center transition-all ${
                        selectedDay === day
                          ? 'border-brand-accent bg-brand-accent/10 text-brand-accent'
                          : 'border-border hover:bg-muted dark:hover:bg-slate-800'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time selection */}
              <div className="space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-350 block">2. Select a Time Slot</span>
                <div className="grid grid-cols-2 gap-2">
                  {times.map((time) => (
                    <button
                      key={time}
                      onClick={() => { setSelectedTime(time); setBookingConfirmed(false); }}
                      className={`p-2.5 border rounded font-semibold text-center transition-all ${
                        selectedTime === time
                          ? 'border-brand-accent bg-brand-accent/10 text-brand-accent'
                          : 'border-border hover:bg-muted dark:hover:bg-slate-800'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleBookingSubmit}
                disabled={!selectedDay || !selectedTime}
                className="w-full py-2.5 bg-brand-accent text-brand-obsidian text-xs font-bold rounded hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                Confirm Demo Slot
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. CONTACT INFRA */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-center text-xs">
        <div className="p-4 bg-muted/30 dark:bg-slate-900/30 border border-border rounded-xl space-y-1">
          <Phone className="w-4 h-4 text-brand-safety mx-auto mb-1.5" />
          <p className="font-bold">Phone Support</p>
          <p className="text-muted-foreground">+1 (800) 555-0199</p>
        </div>
        <div className="p-4 bg-muted/30 dark:bg-slate-900/30 border border-border rounded-xl space-y-1">
          <Mail className="w-4 h-4 text-brand-safety mx-auto mb-1.5" />
          <p className="font-bold">Sales Desk</p>
          <p className="text-muted-foreground">solutions@buildspace.ai</p>
        </div>
        <div className="p-4 bg-muted/30 dark:bg-slate-900/30 border border-border rounded-xl space-y-1">
          <MapPin className="w-4 h-4 text-brand-safety mx-auto mb-1.5" />
          <p className="font-bold">HQ Address</p>
          <p className="text-muted-foreground">San Francisco, CA</p>
        </div>
      </section>
    </div>
  )
}
