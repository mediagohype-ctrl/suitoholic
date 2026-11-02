"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  ArrowRight,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  Shield,
  Phone,
  Mail,
  LogOut,
  Heart,
  Ruler,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWishlist } from "@/context/WishlistProvider";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 170 170" fill="currentColor">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.05-7.69-7.85-11.96-14.41-6.1-9.35-10.8-19.78-14.1-31.29-3.3-11.51-4.95-22.37-4.95-32.58 0-14.14 3.58-26.04 10.74-35.69 7.16-9.65 16.48-14.61 27.95-14.88 4.79 0 10.21 1.25 16.27 3.75 6.06 2.5 10.15 3.86 12.28 4.09 2.72-.44 6.97-1.85 12.74-4.22 5.77-2.38 10.98-3.46 15.64-3.25 11.96.65 21.7 5.06 29.21 13.22-10.45 6.31-15.57 15.12-15.35 26.43.22 8.71 3.53 16.05 9.92 22.03 6.39 5.98 13.98 9.53 22.78 10.63-2.61 7.84-5.93 15.8-9.97 23.88zM119.22 31.84c0-7.18 2.66-14.03 7.99-20.55 5.33-6.52 11.91-10.65 19.75-12.39.44 1.74.65 3.37.65 4.9 0 7.4-2.83 14.42-8.49 21.06-5.66 6.64-12.51 10.67-20.55 12.09-.22-1.74-.44-3.44-.44-5.11z" />
    </svg>
  );
}

interface UserProfile {
  email: string;
  name: string;
  phone?: string;
  isLoggedIn: boolean;
  offersOptIn?: boolean;
}

const STORAGE_USER_KEY = "suitoholic_client_user";

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [phoneInput, setPhoneInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");
  const [step, setStep] = useState<"input" | "otp">("input");
  const [otpCode, setOtpCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { wishlistCount } = useWishlist();

  // Load existing session from storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.isLoggedIn) {
          setUser(parsed);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || phoneInput.length < 10) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep("otp");
    }, 400);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep("otp");
    }, 400);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const isPhone = authMethod === "phone";
      const cleanName = isPhone
        ? `Patron (+91 ${phoneInput.slice(-4)})`
        : (emailInput.split("@")[0].charAt(0).toUpperCase() + emailInput.split("@")[0].slice(1));
      
      const profile: UserProfile = {
        email: isPhone ? `${phoneInput}@suitoholic-patron.com` : emailInput,
        phone: isPhone ? `+91 ${phoneInput}` : undefined,
        name: cleanName,
        isLoggedIn: true,
      };
      setUser(profile);
      try {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(profile));
      } catch {
        // ignore
      }
      setSubmitting(false);
    }, 500);
  };

  const handleGoogleSignIn = () => {
    setSubmitting(true);
    setTimeout(() => {
      const profile: UserProfile = {
        email: "patron.atelier@gmail.com",
        name: "Google Patron",
        isLoggedIn: true,
      };
      setUser(profile);
      try {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(profile));
      } catch {}
      setSubmitting(false);
    }, 400);
  };

  const handleAppleSignIn = () => {
    setSubmitting(true);
    setTimeout(() => {
      const profile: UserProfile = {
        email: "patron.atelier@icloud.com",
        name: "Apple Patron",
        isLoggedIn: true,
      };
      setUser(profile);
      try {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(profile));
      } catch {}
      setSubmitting(false);
    }, 400);
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem(STORAGE_USER_KEY);
    } catch {
      // ignore
    }
    setUser(null);
    setPhoneInput("");
    setEmailInput("");
    setOtpCode("");
    setAuthMethod("phone");
    setStep("input");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="w-8 h-8 rounded-full border-2 border-black border-t-transparent animate-spin" />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STATE 1: NOT LOGGED IN -> Modern Login Card Matching User Image 2
  // --------------------------------------------------------------------------
  if (!user || !user.isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#FAF7F2] text-black antialiased selection:bg-black selection:text-white">
        <Header forceSolid />

        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-32 sm:pt-36 pb-16 w-full">
          <div className="w-full max-w-[440px]">
            {/* White Floating Card Matching Reference Image 2 */}
            <div className="bg-white border border-[#EDE8E1] rounded-2xl p-6 sm:p-8 shadow-sm transition-all">
              {step === "input" ? (
                authMethod === "phone" ? (
                  /* Phone Number / WhatsApp Flow */
                  <form onSubmit={handlePhoneSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#14110E] mb-2">
                        Phone Number
                      </label>
                      <div className="flex items-center gap-2">
                        {/* Country code selector */}
                        <div className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-xl px-3 py-3 bg-white shrink-0">
                          <span className="text-base leading-none">🇮🇳</span>
                          <span className="text-sm font-semibold text-[#14110E]">+91</span>
                          <ChevronDown size={14} className="text-[#9CA3AF] ml-0.5" />
                        </div>
                        {/* Phone input */}
                        <input
                          type="tel"
                          inputMode="numeric"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="1234567890"
                          required
                          className="flex-1 min-w-0 border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-medium text-[#14110E] placeholder:text-[#9CA3AF] outline-none focus:border-[#D25A24] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Terracotta Continue with WhatsApp button */}
                    <button
                      type="submit"
                      disabled={submitting || phoneInput.length < 10}
                      className="w-full bg-[#D25A24] hover:bg-[#B84E1F] disabled:opacity-50 text-white font-semibold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                      {submitting ? "Connecting..." : "Continue with WhatsApp"}
                    </button>

                    {/* Divider: O R */}
                    <div className="relative my-5">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#E5E7EB]" />
                      </div>
                      <div className="relative flex justify-center text-[11px]">
                        <span className="bg-white px-3 font-medium tracking-[0.2em] text-[#9CA3AF] uppercase">
                          O R
                        </span>
                      </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={submitting}
                        className="w-full bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#14110E] font-medium text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-98"
                      >
                        <GoogleIcon className="w-4 h-4 shrink-0" />
                        <span>Continue with Google</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleAppleSignIn}
                        disabled={submitting}
                        className="w-full bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#14110E] font-medium text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-98"
                      >
                        <AppleIcon className="w-4 h-4 shrink-0" />
                        <span>Continue with Apple</span>
                      </button>
                    </div>

                    {/* Switch to Email link */}
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setAuthMethod("email")}
                        className="text-sm font-medium text-[#D25A24] hover:underline cursor-pointer"
                      >
                        Sign in with email
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Email Flow */
                  <form onSubmit={handleEmailSubmit} className="space-y-4 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#14110E] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="patron@example.com"
                        required
                        className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-medium text-[#14110E] placeholder:text-[#9CA3AF] outline-none focus:border-[#D25A24] transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || !emailInput.trim()}
                      className="w-full bg-[#D25A24] hover:bg-[#B84E1F] disabled:opacity-50 text-white font-semibold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                      {submitting ? "Sending Code..." : "Continue with Email"}
                    </button>

                    {/* Divider: O R */}
                    <div className="relative my-5">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#E5E7EB]" />
                      </div>
                      <div className="relative flex justify-center text-[11px]">
                        <span className="bg-white px-3 font-medium tracking-[0.2em] text-[#9CA3AF] uppercase">
                          O R
                        </span>
                      </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={submitting}
                        className="w-full bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#14110E] font-medium text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-98"
                      >
                        <GoogleIcon className="w-4 h-4 shrink-0" />
                        <span>Continue with Google</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleAppleSignIn}
                        disabled={submitting}
                        className="w-full bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#14110E] font-medium text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-98"
                      >
                        <AppleIcon className="w-4 h-4 shrink-0" />
                        <span>Continue with Apple</span>
                      </button>
                    </div>

                    {/* Switch to Phone link */}
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setAuthMethod("phone")}
                        className="text-sm font-medium text-[#D25A24] hover:underline cursor-pointer"
                      >
                        Sign in with phone number
                      </button>
                    </div>
                  </form>
                )
              ) : (
                /* OTP Verification Step */
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-[#FAF7F2] border border-[#EDE8E1] rounded-xl p-3.5 text-xs text-[#6B7280]">
                    Verification code sent to{" "}
                    <strong className="text-[#14110E]">
                      {authMethod === "phone" ? `+91 ${phoneInput}` : emailInput}
                    </strong>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#14110E] mb-2">
                      Enter 6-Digit Code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="123456"
                      required
                      maxLength={6}
                      autoFocus
                      className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest text-[#14110E] placeholder:text-[#9CA3AF] outline-none focus:border-[#D25A24] transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || otpCode.length < 6}
                    className="w-full bg-[#D25A24] hover:bg-[#B84E1F] disabled:opacity-50 text-white font-semibold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-98"
                  >
                    {submitting ? "Verifying..." : "Verify & Continue"}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("input");
                        setOtpCode("");
                      }}
                      className="text-[#6B7280] hover:text-[#14110E] underline cursor-pointer"
                    >
                      {authMethod === "phone" ? "Change phone number" : "Change email"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpCode("123456");
                      }}
                      className="text-[#D25A24] font-semibold hover:underline cursor-pointer"
                    >
                      Resend code
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Terms and Privacy Footer matching Reference Image 2 */}
            <p className="text-center text-xs text-[#718096] mt-6 leading-relaxed">
              By continuing you agree to Suitoholic&apos;s{" "}
              <Link href="/terms" className="text-[#D25A24] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#D25A24] hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STATE 2: AUTHENTICATED -> Full Atelier Client Concierge Dashboard
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-[#ECEAE5] text-black antialiased relative overflow-x-hidden selection:bg-black selection:text-white">
      <Header forceSolid />

      <main className="relative z-10 flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-12 pt-36 sm:pt-42 pb-16">
        {/* Top Profile Header Card */}
        <div className="bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#14110E] text-white flex items-center justify-center font-serif-luxury text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold uppercase tracking-tight text-black">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E5E3DD] text-[10px] font-mono font-bold text-[#8C7355] uppercase tracking-wider">
                  Patron
                </span>
              </div>
              <p className="text-xs text-[#666666] font-mono mt-0.5">{user.phone || user.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E5E3DD] hover:border-black hover:bg-[#FAF9F6] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Quick Services & Bespoke Profile */}
          <div className="lg:col-span-8 space-y-6">
            {/* Orders & Tracking Card */}
            <div className="bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-6 border-b border-[#F0ECE1]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E5E3DD] flex items-center justify-center text-[#14110E]">
                    <Package size={20} />
                  </div>
                  <div>
                    <h2 className="font-serif-luxury text-lg sm:text-xl font-bold uppercase tracking-tight">
                      Recent Commissions & Orders
                    </h2>
                    <p className="text-xs text-[#666666]">
                      Bespoke tailoring status & order fulfillment
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FAF8F5] text-xs font-mono font-bold text-[#14110E] border border-[#E5E3DD]">
                  Active (1)
                </span>
              </div>

              {/* Sample Active Order */}
              <div className="pt-6 space-y-6">
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E3DD] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[#888888]">Order ID: </span>
                      <strong className="font-mono text-black">#SUT-2026-8942</strong>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#8C7355] font-semibold">
                      <Clock size={14} />
                      <span>Atelier Crafting Phase</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 py-2 border-y border-[#ECE8DE]">
                    <div className="w-16 h-16 rounded-xl bg-white border border-[#E5E3DD] overflow-hidden flex items-center justify-center shrink-0">
                      <ShoppingBag size={24} className="text-[#8C7355]" />
                    </div>
                    <div>
                      <h4 className="font-serif-luxury text-sm font-bold uppercase tracking-tight text-black">
                        Pure Egyptian Giza Twill • Custom Tailored
                      </h4>
                      <p className="text-xs text-[#666666]">
                        Collar: English Semi-Spread · Cuff: Rounded Barrel · Chest 40&quot;
                      </p>
                      <p className="text-xs font-mono font-bold text-black mt-1">
                        Rs. 3,290 • Bespoke Fit
                      </p>
                    </div>
                  </div>

                  {/* Tailoring Progress Tracker */}
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between text-[11px] font-mono text-[#666666]">
                      <span className="text-black font-semibold">Pattern Cut & Hand-Stitched</span>
                      <span>Estimated Delivery: In 4 Days</span>
                    </div>
                    <div className="w-full bg-[#ECE8DE] rounded-full h-2 overflow-hidden">
                      <div className="bg-[#14110E] h-2 rounded-full w-[65%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bespoke Fit Passport Card */}
            <div className="bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-6 border-b border-[#F0ECE1]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E5E3DD] flex items-center justify-center text-[#14110E]">
                    <Ruler size={20} />
                  </div>
                  <div>
                    <h2 className="font-serif-luxury text-lg sm:text-xl font-bold uppercase tracking-tight">
                      Saved Fit Passport
                    </h2>
                    <p className="text-xs text-[#666666]">
                      Tailored measurements saved for 1-click ordering
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#EBF7EE] text-[#1E6B37] text-xs font-mono font-bold border border-[#C5E8CE]">
                  Verified
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E3DD] text-center">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#888888]">
                    Chest
                  </span>
                  <p className="font-serif-luxury text-xl font-bold text-black mt-1">40&quot;</p>
                  <span className="text-[10px] text-[#666666]">Tailored Ease</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E3DD] text-center">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#888888]">
                    Collar
                  </span>
                  <p className="font-serif-luxury text-xl font-bold text-black mt-1">15.5&quot;</p>
                  <span className="text-[10px] text-[#666666]">Semi-Spread</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E3DD] text-center">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#888888]">
                    Sleeve
                  </span>
                  <p className="font-serif-luxury text-xl font-bold text-black mt-1">34&quot;</p>
                  <span className="text-[10px] text-[#666666]">Full Barrel</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E3DD] text-center">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#888888]">
                    Silhouette
                  </span>
                  <p className="font-serif-luxury text-xl font-bold text-black mt-1">Slim</p>
                  <span className="text-[10px] text-[#666666]">Tapered Waist</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Concierge Assistance & Privileges */}
          <div className="lg:col-span-4 space-y-6">
            {/* Atelier Concierge VIP Support */}
            <div className="bg-[#14110E] text-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-lg space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#8C7355]">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold uppercase tracking-tight text-white">
                    Master Tailor Concierge
                  </h3>
                  <p className="text-xs text-[#A9A49C]">Direct line to your artisan</p>
                </div>
              </div>

              <p className="text-xs text-[#D5D0C6] leading-relaxed">
                Need adjustments, bespoke measurements consultation, or styling assistance for an
                upcoming event? Your personal stylist is available on WhatsApp and Phone.
              </p>

              <div className="space-y-3 pt-2">
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#8C7355] hover:bg-[#7A6449] text-white font-serif-luxury text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Phone size={14} />
                  <span>Chat with Concierge</span>
                </a>
                <Link
                  href="/shop"
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-serif-luxury text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-full flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingBag size={14} />
                  <span>Explore New Arrivals</span>
                </Link>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-6 shadow-sm space-y-4">
              <h4 className="font-serif-luxury text-sm font-bold uppercase tracking-tight text-black">
                Account Summary
              </h4>

              <div className="divide-y divide-[#F0ECE1] text-xs">
                <div className="flex justify-between py-2.5">
                  <span className="text-[#666666]">Saved in Wishlist</span>
                  <Link href="/wishlist" className="font-bold text-black flex items-center gap-1 hover:text-[#8C7355]">
                    <Heart size={12} className="fill-current text-[#8C7355]" />
                    <span>{wishlistCount} Items</span>
                  </Link>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-[#666666]">Total Commissions</span>
                  <span className="font-bold text-black">1 Completed</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-[#666666]">Atelier Membership</span>
                  <span className="font-bold text-[#8C7355]">Signature Patron</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
