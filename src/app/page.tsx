"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import { ArrowRight, Scissors, Sparkles, ShieldCheck, RefreshCw } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#EAE3D2]">
      {/* Header with Logo from public/logo.jpg */}
      <Header activeTab="home" />

      {/* REFERENCE IMAGE 1: Exact UI Replica */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 px-4">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Typography & Action Buttons */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <span className="text-xs font-bold tracking-[0.3em] text-[#9E7D52] uppercase block">
              EFFORTLESSLY ELEGANT
            </span>

            <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold tracking-tight text-[#1F1C18] leading-[1.1] uppercase">
              NOT EVERY BODY <br />
              <span className="text-[#9E7D52]">IS THE SAME SIZE.</span>
            </h1>

            <p className="text-sm text-[#5C554C] max-w-md mx-auto lg:mx-0 leading-relaxed">
              Experience handcrafted luxury tailored to your distinct measurements, shoulder width, and personal monogram embroidery.
            </p>

            {/* Action Buttons (Reference Image 1: SHOP SHIRTS solid black, CUSTOM FIT outlined) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto bg-[#1F1C18] hover:bg-[#9E7D52] text-[#EAE3D2] px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-xl text-center"
              >
                SHOP SHIRTS
              </Link>
              <Link
                href="/custom-shirt"
                className="w-full sm:w-auto bg-transparent border border-[#1F1C18] hover:border-[#9E7D52] hover:text-[#9E7D52] text-[#1F1C18] px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2"
              >
                <span>CUSTOM FIT</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Scroll Indicator & Page Counter (Reference Image 1 Left Side) */}
            <div className="pt-6 hidden sm:flex items-center space-x-3 text-xs text-[#5C554C]">
              <span className="font-bold text-[#1F1C18]">01</span>
              <div className="w-12 h-[2px] bg-[#9E7D52]" />
              <span>05</span>
              <span className="text-[11px] tracking-wider uppercase ml-4 text-[#9E7D52] font-semibold">SCROLL DOWN</span>
            </div>
          </div>

          {/* Right Column: Exact 3D Levitating Shirt on Stone Podium Render */}
          <div className="lg:col-span-7 relative">
            <div className="relative w-full h-[400px] sm:h-[540px] rounded-3xl overflow-hidden shadow-2xl border border-[#D3C9B4]">
              <Image
                src="/hero_shirt_mannequin.jpg"
                alt="Levitating Tailored Shirt on Stone Podium"
                fill
                className="object-cover"
                priority
              />
              {/* Soft Spotlight Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Icons Banner (Exact Match to Reference Image 1 Bottom Bar) */}
      <section className="bg-[#E4DCC9] border-y border-[#D3C9B4] py-6 px-4">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-[#D3C9B4]/60">
          <div className="flex items-center justify-center space-x-3 px-2">
            <div className="w-10 h-10 rounded-full bg-[#1F1C18] text-[#EAE3D2] flex items-center justify-center shrink-0 shadow">
              <Scissors size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold tracking-wider text-[#1F1C18] uppercase">CUSTOM FIT</h4>
              <p className="text-[11px] text-[#5C554C]">Made for You</p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 px-2">
            <div className="w-10 h-10 rounded-full bg-[#1F1C18] text-[#EAE3D2] flex items-center justify-center shrink-0 shadow">
              <Sparkles size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold tracking-wider text-[#1F1C18] uppercase">PREMIUM FABRICS</h4>
              <p className="text-[11px] text-[#5C554C]">Finest Quality</p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 px-2">
            <div className="w-10 h-10 rounded-full bg-[#1F1C18] text-[#EAE3D2] flex items-center justify-center shrink-0 shadow">
              <ShieldCheck size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold tracking-wider text-[#1F1C18] uppercase">PERFECT DETAILS</h4>
              <p className="text-[11px] text-[#5C554C]">Every Stitch</p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 px-2">
            <div className="w-10 h-10 rounded-full bg-[#1F1C18] text-[#EAE3D2] flex items-center justify-center shrink-0 shadow">
              <RefreshCw size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold tracking-wider text-[#1F1C18] uppercase">EASY RETURNS</h4>
              <p className="text-[11px] text-[#5C554C]">Hassle Free</p>
            </div>
          </div>
        </div>
      </section>

      {/* REFERENCE IMAGE 1 LOWER BANNERS: PREMIUM FABRICS & CUSTOM FIT */}
      <section id="fabrics" className="py-12 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Dark Fabric Tile */}
          <div className="relative rounded-2xl overflow-hidden min-h-[260px] sm:min-h-[300px] shadow-2xl flex flex-col justify-end p-8 text-white group">
            <Image
              src="/fabric_texture.jpg"
              alt="Premium Fabric Texture"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            <div className="relative z-10">
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold uppercase tracking-wider mb-2">
                PREMIUM FABRICS
              </h3>
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 text-xs font-bold tracking-widest text-[#C5A069] group-hover:text-white uppercase transition-colors"
              >
                <span>Explore</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right Custom Fit Tile */}
          <div className="bg-[#DFD7C2] border border-[#D3C9B4] rounded-2xl min-h-[260px] sm:min-h-[300px] shadow-lg flex flex-col justify-end p-8 text-[#1F1C18] relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold uppercase tracking-wider mb-2">
                CUSTOM FIT
              </h3>
              <Link
                href="/custom-shirt"
                className="inline-flex items-center space-x-2 text-xs font-bold tracking-widest text-[#1F1C18] group-hover:text-[#9E7D52] uppercase transition-colors"
              >
                <span>Know More</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
