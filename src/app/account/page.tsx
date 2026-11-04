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
  Eye,
  EyeOff,
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

interface UserProfile {
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isLoggedIn: boolean;
  offersOptIn?: boolean;
}

const STORAGE_USER_KEY = "suitoholic_client_user";

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [offersOptIn, setOffersOptIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
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

  const handleEmailPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (isSignUp) {
      if (!firstNameInput.trim() || !lastNameInput.trim()) {
        setFormError("Please enter your full first and last name.");
        return;
      }
      if (!emailInput.trim()) {
        setFormError("Please enter a valid email address.");
        return;
      }
      const rawPhoneDigits = phoneInput.replace(/\D/g, "");
      if (rawPhoneDigits.length < 10) {
        setFormError("Please enter a valid 10-digit mobile number.");
        return;
      }
      if (passwordInput.length < 6) {
        setFormError("Password must be at least 6 characters.");
        return;
      }
      if (passwordInput !== confirmPasswordInput) {
        setFormError("Passwords do not match. Please re-enter.");
        return;
      }

      setSubmitting(true);
      setTimeout(() => {
        const fullName = `${firstNameInput.trim()} ${lastNameInput.trim()}`;
        const formattedPhone = phoneInput.trim().startsWith("+")
          ? phoneInput.trim()
          : `+91 ${phoneInput.trim()}`;

        const profile: UserProfile = {
          email: emailInput.trim(),
          name: fullName,
          firstName: firstNameInput.trim(),
          lastName: lastNameInput.trim(),
          phone: formattedPhone,
          offersOptIn: offersOptIn,
          isLoggedIn: true,
        };
        setUser(profile);
        try {
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(profile));
        } catch {}
        setSubmitting(false);
      }, 500);
    } else {
      if (!emailInput.trim() || !passwordInput.trim()) {
        setFormError("Please enter both email and password.");
        return;
      }
      setSubmitting(true);
      setTimeout(() => {
        const rawName = emailInput.split("@")[0] || "Patron";
        const cleanName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        const profile: UserProfile = {
          email: emailInput.trim(),
          name: cleanName,
          isLoggedIn: true,
        };
        setUser(profile);
        try {
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(profile));
        } catch {}
        setSubmitting(false);
      }, 400);
    }
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

  const handleSignOut = () => {
    try {
      localStorage.removeItem(STORAGE_USER_KEY);
    } catch {
      // ignore
    }
    setUser(null);
    setEmailInput("");
    setPasswordInput("");
    setConfirmPasswordInput("");
    setFirstNameInput("");
    setLastNameInput("");
    setPhoneInput("");
    setFormError(null);
    setForgotSent(false);
    setIsSignUp(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="w-8 h-8 rounded-full border-2 border-black border-t-transparent animate-spin" />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STATE 1: NOT LOGGED IN -> Split Editorial Login with Navbar
  // (Left: Bespoke Atelier Imagery | Right: Client Sign In)
  // --------------------------------------------------------------------------
  if (!user || !user.isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-black antialiased selection:bg-black selection:text-white">
        {/* Navigation Bar */}
        <Header forceSolid />

        {/* Split Editorial Screen: Left side full-bleed from navbar to bottom, Right side centered form */}
        <main className="flex-1 w-full pt-[76px] sm:pt-[84px] lg:pt-[88px] flex flex-col md:flex-row items-stretch min-h-[calc(100vh-88px)]">
          
          {/* Left Column: Full-Bleed Bespoke Atelier Image (Touches Left Screen Edge & Touches Navbar at Top) */}
          <div className="relative hidden md:block w-full md:w-1/2 min-h-[640px] lg:min-h-[720px] self-stretch overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/banners/outfit_hero_suit_light.jpg"
              alt="Suitoholic Bespoke Atelier Tailoring"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>

          {/* Right Column: Centered Login Card & Options */}
          <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-8 lg:px-14 py-12 sm:py-16">
            <div className="w-full max-w-[440px] flex flex-col justify-center">
              {/* Subtle Atelier Brand Header */}
              <div className="mb-6 text-center">
                <Link
                  href="/"
                  className="inline-block font-serif text-2xl sm:text-3xl font-bold uppercase tracking-[0.22em] text-[#14110E] hover:opacity-80 transition"
                >
                  SUITOHOLIC
                </Link>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#8C7355] mt-1 font-semibold">
                  Bespoke Client Atelier
                </p>
              </div>

              {/* White Floating Card Matching Reference Image */}
              <div className="bg-white border border-[#EDE8E1] rounded-2xl sm:rounded-3xl p-7 sm:p-10 shadow-sm transition-all">
                {/* Form Title & Subtitle Matching Reference Image */}
                <div className="text-center mb-7">
                  <h2 className="text-xl sm:text-2xl font-sans tracking-[0.22em] text-[#14110E] uppercase font-normal">
                    {isSignUp ? "SIGN UP" : "LOGIN"}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4A4A4A] mt-2 font-normal">
                    {isSignUp
                      ? "Enter your details to create an atelier account:"
                      : "Enter your email and password to login:"}
                  </p>
                </div>

                {forgotSent && (
                  <div className="mb-5 p-3 rounded-md bg-[#FAF7F2] border border-[#E5E7EB] text-xs text-[#222222] text-center">
                    A password reset link has been sent to your email.
                  </div>
                )}

                {/* Main Email & Password Form */}
                <form onSubmit={handleEmailPasswordSubmit} className="space-y-3.5">
                  {/* Error Alert */}
                  {formError && (
                    <div className="p-3 bg-[#FFF5F5] border border-[#FCA5A5] text-xs text-[#DC2626] text-center font-medium">
                      {formError}
                    </div>
                  )}

                  {/* SIGN UP ONLY: First and Last Name */}
                  {isSignUp && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={firstNameInput}
                          onChange={(e) => {
                            setFirstNameInput(e.target.value);
                            setFormError(null);
                          }}
                          placeholder="First Name *"
                          required
                          className="w-full border border-[#D5D5D5] px-3.5 py-3 text-sm text-[#14110E] placeholder:text-[#888888] outline-none focus:border-black rounded-none transition-colors bg-white"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={lastNameInput}
                          onChange={(e) => {
                            setLastNameInput(e.target.value);
                            setFormError(null);
                          }}
                          placeholder="Last Name *"
                          required
                          className="w-full border border-[#D5D5D5] px-3.5 py-3 text-sm text-[#14110E] placeholder:text-[#888888] outline-none focus:border-black rounded-none transition-colors bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Input */}
                  <div>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        setFormError(null);
                      }}
                      placeholder={isSignUp ? "E-mail Address *" : "E-mail"}
                      required
                      className="w-full border border-[#D5D5D5] px-3.5 py-3 text-sm text-[#14110E] placeholder:text-[#888888] outline-none focus:border-black rounded-none transition-colors bg-white"
                    />
                  </div>

                  {/* SIGN UP ONLY: Phone Number */}
                  {isSignUp && (
                    <div className="flex border border-[#D5D5D5] focus-within:border-black transition-colors bg-white">
                      <div className="flex items-center px-3 border-r border-[#E5E5E5] bg-[#FAF8F5] text-xs font-semibold text-[#444444] select-none shrink-0">
                        <span>🇮🇳 +91</span>
                      </div>
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^\d\s]/g, "");
                          setPhoneInput(val);
                          setFormError(null);
                        }}
                        placeholder="Mobile Number (10 digits) *"
                        required
                        maxLength={14}
                        className="w-full px-3.5 py-3 text-sm text-[#14110E] placeholder:text-[#888888] outline-none bg-white rounded-none"
                      />
                    </div>
                  )}

                  {/* Password Input */}
                  <div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordInput}
                        onChange={(e) => {
                          setPasswordInput(e.target.value);
                          setFormError(null);
                        }}
                        placeholder={isSignUp ? "Create Password (min 6 characters) *" : "Password"}
                        required
                        className="w-full border border-[#D5D5D5] px-3.5 py-3 pr-10 text-sm text-[#14110E] placeholder:text-[#888888] outline-none focus:border-black rounded-none transition-colors bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-black cursor-pointer transition-colors p-1"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {!isSignUp && (
                      <div className="flex justify-end mt-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setForgotSent(true);
                            setTimeout(() => setForgotSent(false), 4000);
                          }}
                          className="text-xs text-[#555555] hover:text-black hover:underline cursor-pointer transition-colors"
                        >
                          Forgot your password?
                        </button>
                      </div>
                    )}
                  </div>

                  {/* SIGN UP ONLY: Confirm Password */}
                  {isSignUp && (
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPasswordInput}
                        onChange={(e) => {
                          setConfirmPasswordInput(e.target.value);
                          setFormError(null);
                        }}
                        placeholder="Confirm Password *"
                        required
                        className="w-full border border-[#D5D5D5] px-3.5 py-3 text-sm text-[#14110E] placeholder:text-[#888888] outline-none focus:border-black rounded-none transition-colors bg-white"
                      />
                    </div>
                  )}

                  {/* SIGN UP ONLY: Opt-in and Terms */}
                  {isSignUp && (
                    <div className="pt-1 space-y-2">
                      <label className="flex items-start gap-2.5 text-xs text-[#555555] cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={offersOptIn}
                          onChange={(e) => setOffersOptIn(e.target.checked)}
                          className="mt-0.5 rounded text-black focus:ring-black accent-[#14110E] cursor-pointer"
                        />
                        <span className="leading-tight">
                          Receive bespoke collection previews, private fittings & atelier updates.
                        </span>
                      </label>
                      <p className="text-[11px] text-[#777777] leading-relaxed">
                        By creating an account, you agree to Suitoholic&apos;s{" "}
                        <Link href="/terms" className="underline hover:text-black">Terms of Service</Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline hover:text-black">Privacy Policy</Link>.
                      </p>
                    </div>
                  )}

                  {/* Gold Button Matching Reference Image (#F5DB8B) */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#F5DB8B] hover:bg-[#ECCF75] active:scale-99 text-[#2A2522] font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase py-3.5 sm:py-4 transition-all cursor-pointer rounded-none shadow-xs text-center"
                    >
                      {submitting
                        ? "PROCESSING..."
                        : isSignUp
                        ? "CREATE ATELIER ACCOUNT"
                        : "LOGIN"}
                    </button>
                  </div></form>

                {/* OR Divider Matching User Request */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E5E7EB]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-[#777777] font-medium tracking-[0.2em] uppercase">
                      OR
                    </span>
                  </div>
                </div>

                {/* Continue with Google in OR section */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={submitting}
                  className="w-full bg-white border border-[#D5D5D5] hover:bg-[#F9FAFB] hover:border-black text-[#14110E] font-medium text-xs sm:text-sm py-3.5 sm:py-4 px-5 flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xs active:scale-98 rounded-none"
                >
                  <GoogleIcon className="w-4 h-4 shrink-0" />
                  <span>{submitting ? "Connecting..." : "Continue with Google"}</span>
                </button>
              </div>

              {/* Sign Up / Log In Toggle Link (Outside Card) */}
              <div className="text-center mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setForgotSent(false);
                    setFormError(null);
                    setPasswordInput("");
                    setConfirmPasswordInput("");
                  }}
                  className="text-xs sm:text-sm text-[#555555] cursor-pointer hover:text-black transition"
                >
                  {isSignUp ? (
                    <>
                      Already have an account?{" "}
                      <span className="text-[#14110E] underline font-semibold">Log in</span>
                    </>
                  ) : (
                    <>
                      Don&apos;t have an account?{" "}
                      <span className="text-[#14110E] underline font-semibold">Sign up</span>
                    </>
                  )}
                </button>
              </div>

              {/* Return to boutique link */}
              <div className="text-center mt-5">
                <Link
                  href="/"
                  className="text-xs text-[#6B7280] hover:text-[#14110E] transition inline-flex items-center gap-1 font-medium"
                >
                  ← Return to Boutique
                </Link>
              </div>
            </div>
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
