"use client";

import api from "@/api/axios";
import React, { useState } from "react";
import {
  Mail,
  User,
  Hash,
  Send,
  AlertCircle,
  CheckCircle,
  Loader2,
  Globe,
  MessageSquare,
} from "lucide-react";
import { ENV } from "@/config/env.config";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await api.post("/contact", formData);
      setStatus({
        type: "success",
        msg: "Message sent!",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        msg: "Sending failed. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12 animate-in fade-in duration-700">
      {/* 1. Header Section */}
      <div className="space-y-4 border-b border-neutral-900 pb-10">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-cyan-500">
          <Globe size={14} />
          <span>Get in Touch</span>
        </div>
        <h1 className="text-4xl md:text-6xl text-white tracking-tighter flex items-center gap-4">
          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-cyan-500">
            <Mail size={32} strokeWidth={2.5} />
          </div>
          Contact Us
        </h1>
      </div>

      <div className="bg-neutral-950 border border-neutral-900 rounded-[2.5rem] p-8 md:p-12">
        <div className="mb-10">
          <h2 className="text-xl text-white uppercase tracking-tight flex items-center gap-2">
            <MessageSquare size={20} className="text-cyan-500" />
            Direct Communication
          </h2>
          <p className="text-neutral-500 text-sm mt-2">
            Feel free to reach out for collaborations or technical inquiries.
          </p>
        </div>

        {/* 2. Status Banner */}
        {status && (
          <div
            className={`mb-8 p-4 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${
              status.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span className="text-xs font-bold uppercase tracking-widest">
              {status.msg}
            </span>
          </div>
        )}

        {/* 3. Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 ml-4">
                Full Name
              </label>
              <div className="relative group">
                <User
                  size={16}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-cyan-500 transition-colors"
                />
                <input
                  name="name"
                  type="text"
                  placeholder="e.g. John Doe"
                  onChange={handleChange}
                  value={formData.name}
                  required
                  className="w-full pl-12 pr-6 py-4 bg-neutral-800/30 border border-neutral-700 rounded-2xl text-white font-bold placeholder-neutral-600 focus:outline-none focus:border-cyan-500 focus:bg-neutral-800/60 transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 ml-4">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  size={16}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-cyan-500 transition-colors"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="hello@example.com"
                  onChange={handleChange}
                  value={formData.email}
                  required
                  className="w-full pl-12 pr-6 py-4 bg-neutral-900 border border-neutral-700 rounded-2xl text-white font-bold placeholder-neutral-600 focus:outline-none focus:border-cyan-500 focus:bg-neutral-800/60 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 ml-4">
              Subject
            </label>
            <div className="relative group">
              <Hash
                size={16}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-cyan-500 transition-colors"
              />
              <input
                name="subject"
                type="text"
                placeholder="How can we help you?"
                onChange={handleChange}
                value={formData.subject}
                required
                className="w-full pl-12 pr-6 py-4 bg-neutral-800/30 border border-neutral-700 rounded-2xl text-white font-bold placeholder-neutral-600 focus:outline-none focus:border-cyan-500 focus:bg-neutral-800/60 transition-all"
              />
            </div>
          </div>

          {/* Message Area */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 ml-4">
              Your Message
            </label>
            <textarea
              name="message"
              placeholder="Type your message here..."
              onChange={handleChange}
              value={formData.message}
              rows={5}
              required
              className="w-full px-6 py-4 bg-neutral-800/30 border border-neutral-700 rounded-2xl text-white font-medium placeholder-neutral-600 focus:outline-none focus:border-cyan-500 focus:bg-neutral-800/60 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
              self-end group flex items-center justify-center gap-3 px-10 py-4 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer
              ${
                loading
                  ? "bg-neutral-900 text-neutral-600 border border-neutral-800"
                  : "bg-cyan-500 text-black hover:bg-cyan-400 active:scale-95"
              }
            `}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Send size={18} /> Send Message
              </>
            )}
          </button>
        </form>
      </div>

      {/* 4. Alternative Info */}
      <div className="pt-10 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] uppercase tracking-widest text-neutral-700">
          Emergency Channel
        </p>
        <div className="flex items-center gap-3 px-6 py-3 bg-neutral-950 border border-neutral-800 rounded-full group hover:border-cyan-500/30 transition-all">
          <Mail size={16} className="text-cyan-500" />
          <a
            href={`mailto:${ENV.CONTACT_EMAIL}`}
            className="text-xs font-bold text-neutral-400 group-hover:text-white transition-colors"
          >
            {ENV.CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
}
