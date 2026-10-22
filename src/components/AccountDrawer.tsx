"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, User, Package, Calendar, RefreshCcw, HelpCircle, Shield, Phone, Mail, Clock, ArrowRight } from "lucide-react";

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountDrawer({ isOpen, onClose }: AccountDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-hidden select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#ECEAE5] border-l border-[#E5E3DD] shadow-2xl flex flex-col text-black relative z-10 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4.5 bg-white border-b border-[#E5E3DD]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                <User size={15} />
              </div>
              <div>
                <h2 className="font-serif-luxury text-lg font-bold uppercase tracking-wider text-black">
                  CLIENT CONCIERGE
                </h2>
                <p className="text-[10px] text-[#666666] font-mono">SUITOHOLIC PRIVATE ATELIER</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-neutral-100 text-[#666666] hover:text-black transition-colors cursor-pointer"
              aria-label="Close Account Menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body Links */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            {/* Quick Actions Card */}
            <div className="bg-white border border-[#E5E3DD] rounded-2xl p-4 shadow-2xs space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#726254] block px-2 mb-2">
                ORDER & SERVICES
              </span>

              <Link
                href="/track-order"
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F5F4F0] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#F5F4F0] rounded-lg group-hover:bg-white text-black">
                    <Package size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-black">Track Order</h4>
                    <p className="text-[11px] text-[#666666]">Real-time status of your tailored commission</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-[#999999] group-hover:text-black group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/contact"
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F5F4F0] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#F5F4F0] rounded-lg group-hover:bg-white text-black">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-black">Book Fitting Appointment</h4>
                    <p className="text-[11px] text-[#666666]">In-person or virtual consultation with master tailors</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-[#999999] group-hover:text-black group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/returns"
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F5F4F0] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#F5F4F0] rounded-lg group-hover:bg-white text-black">
                    <RefreshCcw size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-black">30-Day Fit Guarantee</h4>
                    <p className="text-[11px] text-[#666666]">Alterations and fit adjustments support</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-[#999999] group-hover:text-black group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/faq"
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F5F4F0] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#F5F4F0] rounded-lg group-hover:bg-white text-black">
                    <HelpCircle size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-black">Bespoke FAQ</h4>
                    <p className="text-[11px] text-[#666666]">Common questions regarding fabrics, drape, and care</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-[#999999] group-hover:text-black group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Direct Atelier Support Card */}
            <div className="bg-white border border-[#E5E3DD] rounded-2xl p-5 shadow-2xs space-y-3">
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#726254] block">
                DIRECT CONCIERGE ASSISTANCE
              </span>
              <div className="space-y-2 text-xs text-[#555555]">
                <div className="flex items-center gap-2.5">
                  <Phone size={14} className="text-black shrink-0" />
                  <a href="tel:+911294158890" className="hover:text-black font-semibold text-black">
                    +91 (0) 129 415 8890
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail size={14} className="text-black shrink-0" />
                  <a href="mailto:support@suitoholic.com" className="hover:text-black font-semibold text-black">
                    support@suitoholic.com
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={14} className="text-black shrink-0" />
                  <span>Mon – Sat: 10:00 AM – 8:30 PM IST</span>
                </div>
              </div>
            </div>

            {/* Atelier Admin Portal Link */}
            <div className="pt-2">
              <Link
                href="/admin/login"
                onClick={onClose}
                className="w-full flex items-center justify-between p-3.5 bg-white border border-[#E5E3DD] rounded-2xl text-xs font-bold uppercase tracking-wider text-[#666666] hover:text-black hover:border-black transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Shield size={15} />
                  <span>Atelier Management Portal</span>
                </div>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
