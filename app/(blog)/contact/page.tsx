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
    <div className="max-w-4xl mx-auto py-12 space-y-12 animate-in fade-in duration-700 px-6">
      {/* 1. HEADER */}
      <div className="space-y-4 border-b border-neutral-900 pb-8">
        <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-neutral-500">
          <Globe size={14} />
          <span>Get in Touch</span>
        </div>
        <h1 className="text-4xl md:text-6xl text-white tracking-tight font-black leading-tight">
          Contact Us
        </h1>
      </div>

      <div className="bg-neutral-950 border border-neutral-900 rounded-[2rem] p-8 md:p-12">
        <div className="mb-10">
          <h2 className="text-xl text-white font-bold tracking-tight">
            Send a Message
          </h2>
          <p className="text-neutral-500 text-sm mt-1">
            Fill out the form below and we’ll get back to you as soon as
            possible.
          </p>
        </div>

        {/* 2. STATUS MESSAGES */}
        {status && (
          <div
            className={`mb-8 p-4 rounded-xl border flex items-center gap-3 animate-in fade-in duration-300 ${
              status.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span className="text-xs font-bold">{status.msg}</span>
          </div>
        )}

        {/* 3. FORM SECTION */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-neutral-500 ml-1 tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700"
                />
                <input
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  onChange={handleChange}
                  value={formData.name}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-medium placeholder-neutral-700 focus:outline-none focus:border-neutral-600 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-neutral-500 ml-1 tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  onChange={handleChange}
                  value={formData.email}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-medium placeholder-neutral-700 focus:outline-none focus:border-neutral-600 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-neutral-500 ml-1 tracking-wider">
              Subject
            </label>
            <div className="relative">
              <Hash
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700"
              />
              <input
                name="subject"
                type="text"
                placeholder="What is this about?"
                onChange={handleChange}
                value={formData.subject}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-medium placeholder-neutral-700 focus:outline-none focus:border-neutral-600 transition-all"
              />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-neutral-500 ml-1 tracking-wider">
              Message
            </label>
            <textarea
              name="message"
              placeholder="Your message..."
              onChange={handleChange}
              value={formData.message}
              rows={5}
              required
              className="w-full px-5 py-4 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-medium placeholder-neutral-700 focus:outline-none focus:border-neutral-600 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
              self-end flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold transition-all
              ${
                loading
                  ? "bg-neutral-800 text-neutral-600"
                  : "bg-white text-black hover:bg-neutral-200 active:scale-95"
              }
            `}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Send size={16} /> Send
              </>
            )}
          </button>
        </form>
      </div>

      {/* FOOTER: Alternative Contact */}
      <div className="pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-bold text-neutral-700 tracking-widest">
          Official Email
        </p>
        <div className="flex items-center gap-3 text-sm font-bold text-neutral-400">
          <Mail size={16} className="text-neutral-700" />
          <a
            href={`mailto:${ENV.CONTACT_EMAIL}`}
            className="hover:text-white transition-colors"
          >
            {ENV.CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
}
