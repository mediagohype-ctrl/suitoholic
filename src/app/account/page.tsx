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
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWishlist } from "@/context/WishlistProvider";

interface UserProfile {
  email: string;
  name: string;
  isLoggedIn: boolean;
  offersOptIn?: boolean;
}

const STORAGE_USER_KEY = "suitoholic_client_user";

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [offersOptIn, setOffersOptIn] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<"email" | "otp">("email");
  const [otpCode, setOtpCode] = useState("");
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

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubmitting(true);
    // Instant smooth transition to OTP code simulation
    setTimeout(() => {
      setSubmitting(false);
      setStep("otp");
    }, 400);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const rawName = emailInput.split("@")[0] || "Patron";
      const cleanName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      const profile: UserProfile = {
        email: emailInput,
        name: cleanName,
        isLoggedIn: true,
        offersOptIn,
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

  const handleShopOneClick = () => {
    setSubmitting(true);
    setTimeout(() => {
      const profile: UserProfile = {
        email: "guest.atelier@suitoholic.com",
        name: "Valued Patron",
        isLoggedIn: true,
        offersOptIn: true,
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

  const handleSignOut = () => {
    try {
      localStorage.removeItem(STORAGE_USER_KEY);
    } catch {
      // ignore
    }
    setUser(null);
    setEmailInput("");
    setOtpCode("");
    setStep("email");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F6F3]">
        <div className="w-8 h-8 rounded-full border-2 border-black border-t-transparent animate-spin" />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STATE 1: NOT LOGGED IN -> Renders Clean Sign In Page Matching User Image
  // --------------------------------------------------------------------------
  if (!user || !user.isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-white text-black antialiased selection:bg-black selection:text-white">
        <Header forceSolid />

        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-36 sm:pt-40 pb-16 w-full max-w-lg mx-auto">
          <div className="w-full space-y-6">
            {/* Header Titles */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-[28px] font-bold text-black tracking-tight">
                Sign in
              </h1>
              <p className="text-sm text-[#666666]">
                Sign in or create an account
              </p>
            </div>

            {step === "email" ? (
              <>
                {/* Purple Continue with Shop button matching reference */}
                <button
                  type="button"
                  onClick={handleShopOneClick}
                  disabled={submitting}
                  className="w-full bg-[#5A31F4] hover:bg-[#4C28D4] disabled:opacity-75 text-white font-medium text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  <span className="font-semibold">Continue with</span>
                  <span className="font-bold tracking-tight text-[15px]">shop</span>
                </button>

                {/* Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E5E3DD]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-[#999999]">or</span>
                  </div>
                </div>

                {/* Email Input Form with right-side arrow */}
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="relative w-full">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Email"
                      required
                      className="w-full border border-[#D5D3CD] rounded-xl px-4 py-3.5 pr-12 text-sm text-black placeholder:text-[#999999] outline-none focus:border-black transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={submitting || !emailInput.trim()}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-black hover:text-[#5A31F4] disabled:opacity-40 transition-colors cursor-pointer"
                      aria-label="Submit Email"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>

                  {/* News and offers checkbox matching screenshot */}
                  <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-black pt-1">
                    <input
                      type="checkbox"
                      checked={offersOptIn}
                      onChange={(e) => setOffersOptIn(e.target.checked)}
                      className="w-4 h-4 rounded text-black accent-[#005B94] focus:ring-0 cursor-pointer"
                    />
                    <span className="font-medium text-[#222222]">
                      Email me with news and offers
                    </span>
                  </label>
                </form>
              </>
            ) : (
              /* Step 2: Instant One-Time Verification Code */
              <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-[#FAF8F5] border border-[#E5E3DD] rounded-xl p-3.5 text-xs text-[#555555]">
                  A 6-digit login code was sent to <strong className="text-black">{emailInput}</strong>
                </div>

                <div className="relative w-full">
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit code (e.g. 123456)"
                    required
                    maxLength={6}
                    autoFocus
                    className="w-full border border-[#D5D3CD] rounded-xl px-4 py-3.5 pr-12 text-sm text-black placeholder:text-[#999999] outline-none focus:border-black font-mono tracking-widest transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-black hover:text-[#5A31F4] transition-colors cursor-pointer"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="text-[#666666] hover:text-black underline cursor-pointer"
                  >
                    Change email
                  </button>
                  <button
                    type="submit"
                    className="text-[#5A31F4] font-semibold hover:underline cursor-pointer"
                  >
                    Instant Verify
                  </button>
                </div>
              </form>
            )}

            {/* Terms text below form */}
            <p className="text-center text-[11px] text-[#666666] pt-2">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-black">
                Terms of service
              </Link>
            </p>

            {/* Privacy policy link at the bottom matching reference */}
            <div className="text-center pt-8">
              <Link
                href="/privacy"
                className="text-xs text-[#006699] hover:underline"
              >
                Privacy policy
              </Link>
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
              <p className="text-xs text-[#666666] font-mono mt-0.5">{user.email}</p>
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
            <div className="bg-white border border-[#E5E3DD] rounded-[24px] p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
                <div className="flex items-center gap-2.5">
                  <Package size={18} className="text-[#8C7355]" />
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black">
                    Your Orders & Commissioned Shirts
                  </h2>
                </div>
                <Link
                  href="/track-order"
                  className="text-xs text-[#8C7355] hover:text-black font-semibold underline"
                >
                  Track by Order ID
                </Link>
              </div>

              <div className="py-6 text-center space-y-2 bg-[#FAF9F6] rounded-2xl border border-dashed border-[#E5E3DD]">
                <Clock size={24} className="mx-auto text-[#888888]" />
                <p className="text-xs font-semibold text-black uppercase tracking-wider">
                  No Active Custom Orders
                </p>
                <p className="text-[11px] text-[#666666] max-w-sm mx-auto">
                  Commission your bespoke tailored shirt with Italian Giza Cotton and personalized monogram embroidery.
                </p>
                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 px-6 py-2 bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition-colors shadow-xs"
                  >
                    <span>Browse Collection</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bespoke Fit Profile */}
            <div className="bg-white border border-[#E5E3DD] rounded-[24px] p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
                <div className="flex items-center gap-2.5">
                  <Ruler size={18} className="text-[#8C7355]" />
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black">
                    Saved Measurement Profile
                  </h2>
                </div>
                <Link
                  href="/custom-shirt"
                  className="text-xs text-[#8C7355] hover:text-black font-semibold underline"
                >
                  Configure Fit
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E3DD] text-center">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#777] block">Collar Size</span>
                  <span className="text-sm font-bold text-black mt-1 block">15.5 IN</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E3DD] text-center">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#777] block">Chest</span>
                  <span className="text-sm font-bold text-black mt-1 block">40 IN</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E3DD] text-center">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#777] block">Sleeve Length</span>
                  <span className="text-sm font-bold text-black mt-1 block">34 IN</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E3DD] text-center">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#777] block">Fit Silhouette</span>
                  <span className="text-sm font-bold text-black mt-1 block">Tailored</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Concierge Services */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white border border-[#E5E3DD] rounded-[24px] p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7355] mb-2">
                Atelier Privileges
              </h3>

              <Link
                href="/wishlist"
                className="flex items-center justify-between p-3 rounded-xl border border-[#E5E3DD] hover:border-black hover:bg-[#FAF9F6] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Heart size={16} className="text-[#8C7355]" />
                  <span className="text-xs font-semibold text-black">Saved Pieces</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#8C7355]">
                  {wishlistCount}
                </span>
              </Link>

              <Link
                href="/custom-shirt"
                className="flex items-center justify-between p-3 rounded-xl border border-[#E5E3DD] hover:border-black hover:bg-[#FAF9F6] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag size={16} className="text-[#8C7355]" />
                  <span className="text-xs font-semibold text-black">6-Step Configurator</span>
                </div>
                <ArrowRight size={13} className="text-[#888] group-hover:text-black" />
              </Link>

              <Link
                href="/track-order"
                className="flex items-center justify-between p-3 rounded-xl border border-[#E5E3DD] hover:border-black hover:bg-[#FAF9F6] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Package size={16} className="text-[#8C7355]" />
                  <span className="text-xs font-semibold text-black">Track Existing Order</span>
                </div>
                <ArrowRight size={13} className="text-[#888] group-hover:text-black" />
              </Link>
            </div>

            {/* Concierge Contact Card */}
            <div className="bg-[#14110E] text-white rounded-[24px] p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2.5">
                <Shield size={18} className="text-[#8C7355]" />
                <h3 className="font-serif-luxury text-base font-bold uppercase tracking-wider text-white">
                  30-Day Fit Guarantee
                </h3>
              </div>
              <p className="text-xs text-[#CCCCCC] leading-relaxed">
                Complimentary alterations and master tailor refitting on all bespoke garments.
              </p>

              <div className="pt-2 border-t border-white/10 space-y-2 text-xs text-[#AAA]">
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-[#8C7355]" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-[#8C7355]" />
                  <span>concierge@suitoholic.com</span>
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
