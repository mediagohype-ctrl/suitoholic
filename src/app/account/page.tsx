"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  User,
  ArrowRight,
  Package,
  Calendar,
  CheckCircle2,
  AlertCircle,
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
  Trash2,
  KeyRound,
  ExternalLink,
  ChevronRight,
  Settings,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModernProductCard from "@/components/ModernProductCard";
import { useWishlist } from "@/context/WishlistProvider";
import { useCatalog } from "@/context/SiteDataProvider";
import { allProducts, ProductItem } from "@/data/products";
import { DEFAULT_LOOKS } from "@/components/CuratedStartingPoints";
import { LUXURY_CLOTH_ITEMS } from "@/components/LuxuryClothArchiveSection";

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
  password?: string;
  isLoggedIn: boolean;
  offersOptIn?: boolean;
}

interface UserOrder {
  orderNumber: string;
  date: string;
  statusLabel: string;
  currentStage: string;
  progressPercent: number;
  estimatedDelivery: string;
  totalLabel: string;
  items: {
    name: string;
    details: string;
    price: string;
    quantity: number;
    image: string;
  }[];
}

const STORAGE_USER_KEY = "suitoholic_client_user";
const STORAGE_ACCOUNTS_KEY = "suitoholic_client_accounts";

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "profile">("orders");

  // Sign in / Sign up form state
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

  // Edit Profile Form State
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileNotice, setProfileNotice] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Change Password Form State
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Wishlist context & backend catalog
  const { wishlistIds, clearWishlist, toggleWishlist, wishlistCount } = useWishlist();
  const { products } = useCatalog();

  // Load existing session from storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USER_KEY);
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        if (parsed?.isLoggedIn) {
          setUser(parsed);
          setEditFirstName(parsed.firstName || parsed.name.split(" ")[0] || "");
          setEditLastName(parsed.lastName || parsed.name.split(" ").slice(1).join(" ") || "");
          setEditEmail(parsed.email || "");
          setEditPhone(parsed.phone || "");
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync user profile fields when user changes
  useEffect(() => {
    if (user) {
      setEditFirstName(user.firstName || user.name.split(" ")[0] || "");
      setEditLastName(user.lastName || user.name.split(" ").slice(1).join(" ") || "");
      setEditEmail(user.email || "");
      setEditPhone(user.phone || "");
    }
  }, [user]);

  // Resolve all saved wishlist products
  const wishlistProducts: ProductItem[] = useMemo(() => {
    const productMap = new Map<string, ProductItem>();

    allProducts.forEach((p) => {
      productMap.set(String(p.id), p);
      if (p.slug) productMap.set(p.slug.toLowerCase(), p);
    });

    (products || []).forEach((p) => {
      productMap.set(String(p.id), p);
      if (p.slug) productMap.set(p.slug.toLowerCase(), p);
    });

    DEFAULT_LOOKS.forEach((look, index) => {
      const p: ProductItem = {
        id: 1000 + index,
        slug: look.slug,
        name: look.title,
        category: "formal_bespoke",
        price: look.price,
        rawPrice: 2600,
        subtitle: look.subtitle,
        description: look.subtitle,
        fabric: look.subtitle || "Italian Luxury Cotton",
        threadCount: "140s",
        rating: 5,
        reviewsCount: 18,
        image: look.image,
        gallery: look.hoverImage ? [look.image, look.hoverImage] : [look.image],
      };
      productMap.set(String(look.id), p);
      productMap.set(look.slug.toLowerCase(), p);
    });

    LUXURY_CLOTH_ITEMS.forEach((cloth, index) => {
      const p: ProductItem = {
        id: 2000 + index,
        slug: cloth.id,
        name: `${cloth.mill} ${cloth.code} Swatch`,
        category: "fabrics",
        price: cloth.formattedPrice,
        rawPrice: cloth.pricePerMetre,
        subtitle: `${cloth.mill} • ${cloth.fibre}`,
        description: cloth.description,
        fabric: `${cloth.mill} • ${cloth.fibre}`,
        threadCount: cloth.weightLabel || "135 GSM",
        rating: 5,
        reviewsCount: 12,
        image: cloth.image,
        gallery: [cloth.image],
      };
      productMap.set(cloth.id, p);
    });

    const results: ProductItem[] = [];
    const seen = new Set<string>();

    wishlistIds.forEach((id) => {
      const item = productMap.get(String(id));
      if (item && !seen.has(String(item.id))) {
        seen.add(String(item.id));
        results.push(item);
      }
    });

    return results;
  }, [wishlistIds, products]);

  // User Orders list (retrieves stored orders or provides bespoke initial commission)
  const ordersList: UserOrder[] = useMemo(() => {
    const list: UserOrder[] = [];

    // Check sessionStorage for last placed order
    try {
      const lastRaw = sessionStorage.getItem("suitoholic_last_order");
      if (lastRaw) {
        const parsed = JSON.parse(lastRaw);
        if (parsed?.orderNumber) {
          list.push({
            orderNumber: parsed.orderNumber,
            date: new Date(parsed.createdAt || Date.now()).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            statusLabel: parsed.status === "delivered" ? "Delivered" : "Atelier Crafting Phase",
            currentStage: "Hand-Cut & Precision Stitching",
            progressPercent: 65,
            estimatedDelivery: "Estimated in 3-4 Days",
            totalLabel: parsed.totalLabel || `₹ ${(parsed.total || 0).toLocaleString("en-IN")}`,
            items: (parsed.items || []).map((it: { name?: string; size?: string; lineTotal?: number; image?: string }) => ({
              name: it.name || "Bespoke Tailored Shirt",
              details: `Size ${it.size || "Custom Fit"} • Master Cut`,
              price: `₹ ${(it.lineTotal || 2600).toLocaleString("en-IN")}`,
              quantity: 1,
              image: it.image || "/new_shirts/shirt_19.jpg",
            })),
          });
        }
      }
    } catch {}

    // Add signature bespoke commission order for patron
    list.push({
      orderNumber: "#SUT-2026-8942",
      date: "02 Nov 2026",
      statusLabel: "Atelier Crafting Phase",
      currentStage: "Pattern Cut & Hand-Stitched",
      progressPercent: 65,
      estimatedDelivery: "Estimated in 4 Days",
      totalLabel: "Rs. 3,290",
      items: [
        {
          name: "Pure Egyptian Giza Twill • Custom Tailored",
          details: "Collar: English Semi-Spread · Cuff: Rounded Barrel · Chest 40\" Tailored",
          price: "Rs. 3,290",
          quantity: 1,
          image: "/new_shirts/shirt_19.jpg",
        },
      ],
    });

    return list;
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
          password: passwordInput,
          offersOptIn: offersOptIn,
          isLoggedIn: true,
        };
        setUser(profile);
        try {
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(profile));
          const accountsRaw = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
          const accounts = accountsRaw ? JSON.parse(accountsRaw) : {};
          accounts[emailInput.trim().toLowerCase()] = profile;
          localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
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
        let profileToLogin: UserProfile | null = null;
        try {
          const accountsRaw = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
          if (accountsRaw) {
            const accounts = JSON.parse(accountsRaw);
            const savedAcc: UserProfile | undefined = accounts[emailInput.trim().toLowerCase()];
            if (savedAcc) {
              if (savedAcc.password && savedAcc.password !== passwordInput) {
                setFormError("Incorrect password. Please verify and try again.");
                setSubmitting(false);
                return;
              }
              profileToLogin = { ...savedAcc, isLoggedIn: true };
            }
          }
        } catch {}

        if (!profileToLogin) {
          const rawName = emailInput.split("@")[0] || "Patron";
          const cleanName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
          profileToLogin = {
            email: emailInput.trim(),
            name: cleanName,
            password: passwordInput,
            isLoggedIn: true,
          };
        }

        setUser(profileToLogin);
        try {
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(profileToLogin));
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
        firstName: "Google",
        lastName: "Patron",
        phone: "+91 98765 43210",
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
    } catch {}
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

  // Handle Save Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileNotice(null);

    if (!editFirstName.trim() || !editLastName.trim()) {
      setProfileError("First name and last name are required.");
      return;
    }
    if (!editEmail.trim()) {
      setProfileError("Valid email address is required.");
      return;
    }

    setSavingProfile(true);
    setTimeout(() => {
      const updatedFullName = `${editFirstName.trim()} ${editLastName.trim()}`;
      const updatedProfile: UserProfile = {
        ...user!,
        name: updatedFullName,
        firstName: editFirstName.trim(),
        lastName: editLastName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
      };

      setUser(updatedProfile);
      try {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updatedProfile));
        const accountsRaw = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
        const accounts = accountsRaw ? JSON.parse(accountsRaw) : {};
        accounts[updatedProfile.email.toLowerCase()] = updatedProfile;
        localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
      } catch {}

      setSavingProfile(false);
      setProfileNotice("Profile details updated successfully!");
      setTimeout(() => setProfileNotice(null), 4000);
    }, 400);
  };

  // Handle Change Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordNotice(null);

    // If existing password exists, verify current password
    if (user?.password && currentPasswordInput !== user.password) {
      setPasswordError("Current password is incorrect. Please check and re-enter.");
      return;
    }

    if (newPasswordInput.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPasswordInput !== confirmNewPasswordInput) {
      setPasswordError("New passwords do not match. Please verify.");
      return;
    }

    setUpdatingPassword(true);
    setTimeout(() => {
      const updatedProfile: UserProfile = {
        ...user!,
        password: newPasswordInput,
      };

      setUser(updatedProfile);
      try {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updatedProfile));
        const accountsRaw = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
        const accounts = accountsRaw ? JSON.parse(accountsRaw) : {};
        accounts[updatedProfile.email.toLowerCase()] = updatedProfile;
        localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
      } catch {}

      setCurrentPasswordInput("");
      setNewPasswordInput("");
      setConfirmNewPasswordInput("");
      setUpdatingPassword(false);
      setPasswordNotice("Password updated successfully! Your account credentials have been secured.");
      setTimeout(() => setPasswordNotice(null), 4000);
    }, 400);
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
  // --------------------------------------------------------------------------
  if (!user || !user.isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-black antialiased selection:bg-black selection:text-white">
        <Header forceSolid />

        <main className="flex-1 w-full pt-[76px] sm:pt-[84px] lg:pt-[88px] flex flex-col md:flex-row items-stretch min-h-[calc(100vh-88px)]">
          {/* Left Column: Full-Bleed Bespoke Atelier Image */}
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

              {/* White Floating Card */}
              <div className="bg-white border border-[#EDE8E1] rounded-2xl sm:rounded-3xl p-7 sm:p-10 shadow-sm transition-all">
                <div className="text-center mb-6">
                  <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#14110E]">
                    {isSignUp ? "Create Your Account" : "Welcome Back"}
                  </h1>
                  <p className="text-xs sm:text-[13px] text-[#555555] mt-1.5 font-normal leading-relaxed">
                    {isSignUp
                      ? "Join the Suitoholic bespoke atelier to track commissions & save fittings:"
                      : "Enter your email and password to access your commissions:"}
                  </p>
                </div>

                {forgotSent && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg text-center font-medium">
                    A password reset link has been sent to your email.
                  </div>
                )}

                {/* Main Email & Password Form */}
                <form onSubmit={handleEmailPasswordSubmit} className="space-y-3.5">
                  {isSignUp && (
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstNameInput}
                          onChange={(e) => setFirstNameInput(e.target.value)}
                          placeholder="Lord"
                          disabled={submitting}
                          required
                          className="w-full bg-[#FAF9F6] border border-[#D5D5D5] focus:border-black rounded-lg px-3.5 py-3 text-xs sm:text-sm text-[#14110E] placeholder:text-[#999999] focus:outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={lastNameInput}
                          onChange={(e) => setLastNameInput(e.target.value)}
                          placeholder="Byron"
                          disabled={submitting}
                          required
                          className="w-full bg-[#FAF9F6] border border-[#D5D5D5] focus:border-black rounded-lg px-3.5 py-3 text-xs sm:text-sm text-[#14110E] placeholder:text-[#999999] focus:outline-none transition"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="name@example.com"
                      disabled={submitting}
                      required
                      className="w-full bg-[#FAF9F6] border border-[#D5D5D5] focus:border-black rounded-lg px-3.5 py-3 text-xs sm:text-sm text-[#14110E] placeholder:text-[#999999] focus:outline-none transition"
                    />
                  </div>

                  {isSignUp && (
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="9876543210"
                        disabled={submitting}
                        required
                        className="w-full bg-[#FAF9F6] border border-[#D5D5D5] focus:border-black rounded-lg px-3.5 py-3 text-xs sm:text-sm text-[#14110E] placeholder:text-[#999999] focus:outline-none transition"
                      />
                    </div>
                  )}

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666]">
                        Password
                      </label>
                      {!isSignUp && (
                        <button
                          type="button"
                          onClick={() => setForgotSent(true)}
                          className="text-[11px] text-[#8C7355] hover:text-black hover:underline cursor-pointer transition font-medium"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder={isSignUp ? "Create a secure password" : "Enter password"}
                        disabled={submitting}
                        required
                        minLength={6}
                        className="w-full bg-[#FAF9F6] border border-[#D5D5D5] focus:border-black rounded-lg px-3.5 py-3 text-xs sm:text-sm text-[#14110E] placeholder:text-[#999999] focus:outline-none transition pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {isSignUp && (
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={confirmPasswordInput}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          placeholder="Re-enter password"
                          disabled={submitting}
                          required
                          minLength={6}
                          className="w-full bg-[#FAF9F6] border border-[#D5D5D5] focus:border-black rounded-lg px-3.5 py-3 text-xs sm:text-sm text-[#14110E] placeholder:text-[#999999] focus:outline-none transition pr-10"
                        />
                      </div>
                    </div>
                  )}

                  {formError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#14110E] hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm py-3.5 sm:py-4 transition-all duration-300 shadow-md cursor-pointer uppercase tracking-[0.16em] disabled:opacity-50 active:scale-98 rounded-none mt-2"
                  >
                    {submitting ? "Authenticating..." : isSignUp ? "Create Account" : "Log In"}
                  </button>
                </form>

                {/* Divider Line */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E5E3DD]" />
                  </div>
                  <div className="relative flex justify-center text-[10px] sm:text-xs uppercase">
                    <span className="bg-white px-3 text-[#888888] tracking-widest font-mono">OR</span>
                  </div>
                </div>

                {/* Continue with Google */}
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

              {/* Sign Up / Log In Toggle Link */}
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
  // (With Orders, Wishlist, and Edit Profile & Change Password Tabs)
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-[#ECEAE5] text-black antialiased relative overflow-x-hidden selection:bg-black selection:text-white">
      <Header forceSolid />

      <main className="relative z-10 flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-12 pt-32 sm:pt-36 pb-16">
        
        {/* Top Profile Header Card */}
        <div className="bg-white border border-[#E5E3DD] rounded-[16px] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#14110E] text-white flex items-center justify-center font-serif-luxury text-2xl font-bold shadow-xs">
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] border border-[#E5E3DD] hover:border-black hover:bg-[#FAF9F6] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* 3 Main Navigation Tabs Bar */}
        <div className="flex items-center gap-2 sm:gap-3 mb-8 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("orders")}
            className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-[8px] text-xs sm:text-[13px] font-bold tracking-wider uppercase transition-all cursor-pointer shrink-0 ${
              activeTab === "orders"
                ? "bg-black text-white shadow-xs"
                : "bg-white text-[#666666] border border-[#E5E3DD] hover:text-black hover:border-black"
            }`}
          >
            <Package size={15} />
            <span>Orders & Commissions</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === "orders" ? "bg-white/20 text-white" : "bg-[#FAF8F5] text-black border border-[#E5E3DD]"}`}>
              {ordersList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-[8px] text-xs sm:text-[13px] font-bold tracking-wider uppercase transition-all cursor-pointer shrink-0 ${
              activeTab === "wishlist"
                ? "bg-black text-white shadow-xs"
                : "bg-white text-[#666666] border border-[#E5E3DD] hover:text-black hover:border-black"
            }`}
          >
            <Heart size={15} className={activeTab === "wishlist" ? "fill-current" : ""} />
            <span>Wishlist</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === "wishlist" ? "bg-white/20 text-white" : "bg-[#FAF8F5] text-black border border-[#E5E3DD]"}`}>
              {wishlistCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-[8px] text-xs sm:text-[13px] font-bold tracking-wider uppercase transition-all cursor-pointer shrink-0 ${
              activeTab === "profile"
                ? "bg-black text-white shadow-xs"
                : "bg-white text-[#666666] border border-[#E5E3DD] hover:text-black hover:border-black"
            }`}
          >
            <User size={15} />
            <span>Edit Profile & Password</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: ORDERS & COMMISSIONS                              */}
        {/* ======================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold uppercase tracking-tight text-black">
                Recent Commissions & Orders ({ordersList.length})
              </h2>
              <p className="text-xs text-[#666666] mt-0.5">
                Bespoke tailoring status, craft timeline, and order fulfillment tracking.
              </p>
            </div>

            {ordersList.length > 0 ? (
              ordersList.map((order) => (
                <div key={order.orderNumber} className="bg-white border border-[#E5E3DD] rounded-[16px] p-6 sm:p-8 shadow-xs space-y-6">
                  {/* Top Bar: Order ID, Date & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#F0ECE1]">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#888888]">Commission ID</span>
                      <h3 className="font-mono text-base sm:text-lg font-bold text-black">{order.orderNumber}</h3>
                      <p className="text-xs text-[#888888] mt-0.5">Placed on {order.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E5E3DD] text-xs font-mono font-bold text-[#8C7355] flex items-center gap-1.5">
                        <Clock size={13} />
                        <span>{order.statusLabel}</span>
                      </span>
                      <span className="font-mono text-base font-bold text-black">{order.totalLabel}</span>
                    </div>
                  </div>

                  {/* 4-Stage Visual Tailoring Progress Tracker */}
                  <div className="space-y-2 py-2">
                    <div className="flex justify-between text-[11px] font-mono text-[#666666]">
                      <span className="font-bold text-black">Stage: {order.currentStage}</span>
                      <span className="text-[#8C7355] font-semibold">{order.estimatedDelivery}</span>
                    </div>
                    <div className="w-full bg-[#EFECE6] rounded-full h-2 overflow-hidden">
                      <div className="bg-black h-2 rounded-full transition-all duration-500" style={{ width: `${order.progressPercent}%` }} />
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-[10px] font-mono uppercase text-[#888888] pt-1">
                      <span className={order.progressPercent >= 25 ? "text-black font-bold" : ""}>1. Pattern Draft</span>
                      <span className={order.progressPercent >= 50 ? "text-black font-bold" : ""}>2. Hand-Cut</span>
                      <span className={order.progressPercent >= 75 ? "text-black font-bold" : ""}>3. Stitch &amp; Press</span>
                      <span className={order.progressPercent >= 100 ? "text-black font-bold" : ""}>4. Dispatch</span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-[#F0ECE1] py-2 border-y border-[#F0ECE1]">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 py-3">
                        <div className="w-16 h-16 rounded-[8px] bg-neutral-100 border border-[#E5E3DD] overflow-hidden shrink-0 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-black uppercase truncate">{item.name}</h4>
                          <p className="text-[11px] text-[#666666] truncate mt-0.5">{item.details}</p>
                          <p className="text-xs font-mono font-bold text-black mt-1">{item.price} • Qty {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <Link
                      href={`/track-order?order=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(user.email)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-black hover:text-[#8C7355] transition-colors"
                    >
                      <Package size={14} />
                      <span>Track Order Live Details →</span>
                    </Link>
                    <a
                      href="https://wa.me/919999999999"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-[#FAF8F5] border border-[#E5E3DD] hover:border-black text-xs font-bold uppercase tracking-wider text-black transition-all"
                    >
                      <Phone size={13} />
                      <span>Concierge Help</span>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-[#E5E3DD] rounded-[16px] p-12 text-center space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#E5E3DD] flex items-center justify-center text-[#888888] mx-auto">
                  <Package size={26} />
                </div>
                <h3 className="font-serif-luxury text-xl font-bold uppercase text-black">No Active Commissions</h3>
                <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto">
                  You have not placed any bespoke tailoring orders yet. Explore our handcrafted shirting collection to begin your bespoke journey.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-[8px] transition-all shadow-xs cursor-pointer"
                >
                  <span>Explore Bespoke Shirts</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: WISHLIST                                          */}
        {/* ======================================================== */}
        {activeTab === "wishlist" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold uppercase tracking-tight text-black">
                  Saved Pieces ({wishlistProducts.length})
                </h2>
                <p className="text-xs text-[#666666] mt-0.5">
                  Your curated bespoke garments saved for 1-click customization and tailoring.
                </p>
              </div>
              {wishlistProducts.length > 0 && (
                <button
                  type="button"
                  onClick={() => clearWishlist()}
                  className="text-xs font-semibold text-[#888888] hover:text-red-600 transition-colors cursor-pointer underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {wishlistProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 w-full items-stretch">
                {wishlistProducts.map((product) => (
                  <div key={product.id} className="relative w-full group">
                    <ModernProductCard product={product} />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      title="Remove from Wishlist"
                      className="absolute top-2 left-2 z-30 p-1.5 rounded-full bg-white/90 hover:bg-white text-neutral-600 hover:text-red-600 shadow-xs transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#E5E3DD] rounded-[16px] p-12 text-center space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#E5E3DD] flex items-center justify-center text-[#888888] mx-auto">
                  <Heart size={26} />
                </div>
                <h3 className="font-serif-luxury text-xl font-bold uppercase text-black">Your Wishlist is Empty</h3>
                <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto">
                  Save your favorite fabrics, textures, and bespoke shirts while browsing to easily access or customize them later.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-[8px] transition-all shadow-xs cursor-pointer"
                >
                  <span>Discover Curated Fabrics</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: EDIT PROFILE & CHANGE PASSWORD                    */}
        {/* ======================================================== */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Personal Information Form */}
            <div className="lg:col-span-6 bg-white border border-[#E5E3DD] rounded-[16px] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[#F0ECE1]">
                <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E5E3DD] flex items-center justify-center text-black">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold uppercase tracking-tight text-black">
                    Personal Information
                  </h3>
                  <p className="text-xs text-[#666666]">Update your bespoke account details</p>
                </div>
              </div>

              {profileNotice && (
                <div className="p-3.5 rounded-[8px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                  <span>{profileNotice}</span>
                </div>
              )}

              {profileError && (
                <div className="p-3.5 rounded-[8px] bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-red-600" />
                  <span>{profileError}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      required
                      className="w-full bg-[#FAF9F6] border border-[#E5E3DD] focus:border-black rounded-[8px] px-3.5 py-2.5 text-xs text-black focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      required
                      className="w-full bg-[#FAF9F6] border border-[#E5E3DD] focus:border-black rounded-[8px] px-3.5 py-2.5 text-xs text-black focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    className="w-full bg-[#FAF9F6] border border-[#E5E3DD] focus:border-black rounded-[8px] px-3.5 py-2.5 text-xs text-black focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#FAF9F6] border border-[#E5E3DD] focus:border-black rounded-[8px] px-3.5 py-2.5 text-xs text-black focus:outline-none transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="w-full py-3 bg-black hover:bg-neutral-800 text-white rounded-[8px] text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {savingProfile ? "Saving Profile..." : "Save Profile Details"}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Change Password Form */}
            <div className="lg:col-span-6 bg-white border border-[#E5E3DD] rounded-[16px] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[#F0ECE1]">
                <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E5E3DD] flex items-center justify-center text-black">
                  <KeyRound size={18} />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold uppercase tracking-tight text-black">
                    Security &amp; Change Password
                  </h3>
                  <p className="text-xs text-[#666666]">Update your account login password</p>
                </div>
              </div>

              {passwordNotice && (
                <div className="p-3.5 rounded-[8px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                  <span>{passwordNotice}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3.5 rounded-[8px] bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-red-600" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                {/* Current Password (if already has password) */}
                {user.password && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1.5">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPasswordInput}
                        onChange={(e) => setCurrentPasswordInput(e.target.value)}
                        placeholder="Enter current password"
                        required
                        className="w-full bg-[#FAF9F6] border border-[#E5E3DD] focus:border-black rounded-[8px] px-3.5 py-2.5 text-xs text-black focus:outline-none transition-colors pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                      >
                        {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="Minimum 6 characters"
                      required
                      minLength={6}
                      className="w-full bg-[#FAF9F6] border border-[#E5E3DD] focus:border-black rounded-[8px] px-3.5 py-2.5 text-xs text-black focus:outline-none transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmNewPasswordInput}
                      onChange={(e) => setConfirmNewPasswordInput(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                      minLength={6}
                      className="w-full bg-[#FAF9F6] border border-[#E5E3DD] focus:border-black rounded-[8px] px-3.5 py-2.5 text-xs text-black focus:outline-none transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="w-full py-3 bg-black hover:bg-neutral-800 text-white rounded-[8px] text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {updatingPassword ? "Updating Password..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
