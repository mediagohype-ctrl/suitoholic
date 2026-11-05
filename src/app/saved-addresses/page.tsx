"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Home,
  Briefcase,
  Check,
  ArrowRight,
} from "lucide-react";
import PageShell from "@/components/bag/PageShell";

export interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  landmark?: string;
  alternatePhone?: string;
  addressType: "home" | "work";
  isDefault?: boolean;
}

const STORAGE_ADDRESSES_KEY = "suitoholic_saved_addresses";

const INITIAL_SAMPLE_ADDRESSES: SavedAddress[] = [
  {
    id: "addr-bespoke-1",
    name: "Arjun Mehta",
    phone: "9876543210",
    pincode: "110021",
    address: "Villa 4B, Shanti Niketan Luxury Enclave",
    locality: "South Delhi",
    city: "New Delhi",
    state: "Delhi",
    landmark: "Near Embassy Quarter",
    addressType: "home",
    isDefault: true,
  },
];

export default function SavedAddressesPage() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Omit<SavedAddress, "id">>({
    name: "",
    phone: "",
    pincode: "",
    address: "",
    locality: "",
    city: "",
    state: "",
    landmark: "",
    alternatePhone: "",
    addressType: "home",
    isDefault: false,
  });
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_ADDRESSES_KEY);
      if (stored) {
        setAddresses(JSON.parse(stored));
      } else {
        setAddresses(INITIAL_SAMPLE_ADDRESSES);
        localStorage.setItem(STORAGE_ADDRESSES_KEY, JSON.stringify(INITIAL_SAMPLE_ADDRESSES));
      }
    } catch {
      setAddresses(INITIAL_SAMPLE_ADDRESSES);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      name: "",
      phone: "",
      pincode: "",
      address: "",
      locality: "",
      city: "",
      state: "",
      landmark: "",
      alternatePhone: "",
      addressType: "home",
      isDefault: addresses.length === 0,
    });
    setError(null);
    setShowAddressForm(true);
  };

  const handleEditAddress = (addr: SavedAddress) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      name: addr.name,
      phone: addr.phone,
      pincode: addr.pincode,
      address: addr.address,
      locality: addr.locality,
      city: addr.city,
      state: addr.state,
      landmark: addr.landmark || "",
      alternatePhone: addr.alternatePhone || "",
      addressType: addr.addressType,
      isDefault: addr.isDefault || false,
    });
    setError(null);
    setShowAddressForm(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !addressForm.name.trim() ||
      !addressForm.phone.trim() ||
      !addressForm.pincode.trim() ||
      !addressForm.address.trim() ||
      !addressForm.locality.trim() ||
      !addressForm.city.trim() ||
      !addressForm.state.trim()
    ) {
      setError("Please fill in all mandatory address fields.");
      return;
    }

    let updated: SavedAddress[];
    if (editingAddressId) {
      updated = addresses.map((a) => {
        if (a.id === editingAddressId) {
          return { ...addressForm, id: editingAddressId };
        }
        return addressForm.isDefault ? { ...a, isDefault: false } : a;
      });
      setNotice("Address updated successfully!");
    } else {
      const newAddr: SavedAddress = {
        ...addressForm,
        id: `addr-${Date.now()}`,
        isDefault: addressForm.isDefault || addresses.length === 0,
      };
      updated =
        addressForm.isDefault || addresses.length === 0
          ? [...addresses.map((a) => ({ ...a, isDefault: false })), newAddr]
          : [...addresses, newAddr];
      setNotice("New address added successfully!");
    }

    setAddresses(updated);
    try {
      localStorage.setItem(STORAGE_ADDRESSES_KEY, JSON.stringify(updated));
    } catch {}

    setShowAddressForm(false);
    setEditingAddressId(null);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
      updated[0].isDefault = true;
    }
    setAddresses(updated);
    try {
      localStorage.setItem(STORAGE_ADDRESSES_KEY, JSON.stringify(updated));
    } catch {}
    setNotice("Address removed.");
    setTimeout(() => setNotice(null), 3000);
  };

  const handleSetDefaultAddress = (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddresses(updated);
    try {
      localStorage.setItem(STORAGE_ADDRESSES_KEY, JSON.stringify(updated));
    } catch {}
    setNotice("Default delivery address updated.");
    setTimeout(() => setNotice(null), 3000);
  };

  if (loading) {
    return (
      <PageShell eyebrow="DELIVERY DESTINATIONS" title="SAVED ADDRESSES">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-black border-t-transparent animate-spin" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow="DELIVERY DESTINATIONS" title="SAVED ADDRESSES">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold uppercase tracking-tight text-black flex items-center gap-2">
              <span>Your Delivery Destinations ({addresses.length})</span>
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Saved addresses for 1-click tailored deliveries &amp; bespoke fittings.
            </p>
          </div>

          {!showAddressForm && (
            <button
              type="button"
              onClick={handleOpenAddAddress}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus size={15} />
              <span>Add A New Address</span>
            </button>
          )}
        </div>

        {notice && (
          <div className="p-4 rounded-[12px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
            <span>{notice}</span>
          </div>
        )}

        {/* Address Add / Edit Form Card */}
        {showAddressForm && (
          <div className="bg-white border border-black/20 rounded-[20px] p-6 sm:p-8 shadow-sm space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
              <h3 className="font-serif-luxury text-lg font-bold uppercase tracking-tight text-black flex items-center gap-2">
                <MapPin size={18} className="text-[#8C7355]" />
                <span>{editingAddressId ? "Edit Saved Address" : "Add A New Delivery Address"}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddressForm(false);
                  setEditingAddressId(null);
                }}
                className="text-xs font-bold text-[#888888] hover:text-black uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={addressForm.name}
                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                    placeholder="e.g. Arjun Mehta"
                    required
                    className="w-full bg-[#FAF9F6] border border-[#D5D5D5] focus:border-black rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                    10-Digit Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    required
                    className="w-full bg-[#FAF9F6] border border-[#D5D5D5] focus:border-black rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-black focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    placeholder="e.g. 110021"
                    required
                    className="w-full bg-[#FAF9F6] border border-[#D5D5D5] focus:border-black rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-black focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                    Locality / Area / Colony *
                  </label>
                  <input
                    type="text"
                    value={addressForm.locality}
                    onChange={(e) => setAddressForm({ ...addressForm, locality: e.target.value })}
                    placeholder="e.g. South Delhi, Shanti Niketan"
                    required
                    className="w-full bg-[#FAF9F6] border border-[#D5D5D5] focus:border-black rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-black focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                  Flat, House No., Building, Apartment *
                </label>
                <textarea
                  rows={2}
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                  placeholder="e.g. Villa 4B, Shanti Niketan Luxury Enclave"
                  required
                  className="w-full bg-[#FAF9F6] border border-[#D5D5D5] focus:border-black rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-black focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                    City / District *
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="e.g. New Delhi"
                    required
                    className="w-full bg-[#FAF9F6] border border-[#D5D5D5] focus:border-black rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    placeholder="e.g. Delhi"
                    required
                    className="w-full bg-[#FAF9F6] border border-[#D5D5D5] focus:border-black rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={addressForm.landmark || ""}
                    onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                    placeholder="e.g. Near Embassy Enclave"
                    className="w-full bg-[#FAF9F6] border border-[#D5D5D5] focus:border-black rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                    Alternate Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={addressForm.alternatePhone || ""}
                    onChange={(e) => setAddressForm({ ...addressForm, alternatePhone: e.target.value })}
                    placeholder="Optional backup number"
                    className="w-full bg-[#FAF9F6] border border-[#D5D5D5] focus:border-black rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-black focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Address Type Selection */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666666]">
                  Address Type
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAddressForm({ ...addressForm, addressType: "home" })}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer transition ${
                      addressForm.addressType === "home"
                        ? "bg-black text-white border-black"
                        : "bg-[#FAF9F6] text-[#666666] border-[#D5D5D5] hover:text-black"
                    }`}
                  >
                    <Home size={14} />
                    <span>Home (All Day Delivery)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddressForm({ ...addressForm, addressType: "work" })}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer transition ${
                      addressForm.addressType === "work"
                        ? "bg-black text-white border-black"
                        : "bg-[#FAF9F6] text-[#666666] border-[#D5D5D5] hover:text-black"
                    }`}
                  >
                    <Briefcase size={14} />
                    <span>Work (9 AM - 6 PM)</span>
                  </button>
                </div>
              </div>

              {/* Default Address Checkbox */}
              <div className="pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
                  />
                  <span className="text-xs font-medium text-[#444444]">
                    Make this my default bespoke delivery address
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="px-7 py-3 rounded-[8px] bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                >
                  {editingAddressId ? "Save Changes" : "Save Address"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddressForm(false);
                    setEditingAddressId(null);
                  }}
                  className="px-6 py-3 rounded-[8px] border border-[#E5E3DD] hover:border-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List of Saved Addresses */}
        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`bg-white border rounded-[20px] p-6 shadow-xs relative flex flex-col justify-between transition-all ${
                  addr.isDefault
                    ? "border-black shadow-sm ring-1 ring-black/5"
                    : "border-[#E5E3DD] hover:border-[#CCCCCC]"
                }`}
              >
                <div>
                  {/* Top Header: Badge, Default indicator, and Quick Actions */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#F5F3EF] mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E5E3DD] text-[10px] font-mono font-bold uppercase tracking-wider text-[#666666] flex items-center gap-1">
                        {addr.addressType === "home" ? <Home size={11} /> : <Briefcase size={11} />}
                        <span>{addr.addressType}</span>
                      </span>

                      {addr.isDefault && (
                        <span className="px-2.5 py-0.5 rounded-md bg-[#14110E] text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEditAddress(addr)}
                        title="Edit Address"
                        className="p-1.5 text-[#666666] hover:text-black rounded-md hover:bg-[#FAF8F5] transition cursor-pointer"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        title="Delete Address"
                        className="p-1.5 text-[#888888] hover:text-red-600 rounded-md hover:bg-red-50 transition cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Recipient Details */}
                  <h4 className="font-serif-luxury text-base font-bold text-black uppercase tracking-tight">
                    {addr.name}
                  </h4>
                  <p className="text-xs font-mono text-[#666666] mt-0.5">
                    {addr.phone} {addr.alternatePhone ? `• Alt: ${addr.alternatePhone}` : ""}
                  </p>

                  {/* Address Lines */}
                  <p className="text-xs text-[#333333] leading-relaxed mt-3">
                    {addr.address}, {addr.locality}
                  </p>
                  <p className="text-xs font-medium text-[#14110E]">
                    {addr.city}, {addr.state} — <span className="font-mono font-bold">{addr.pincode}</span>
                  </p>
                  {addr.landmark && (
                    <p className="text-[11px] text-[#777777] italic mt-1">Landmark: {addr.landmark}</p>
                  )}
                </div>

                {/* Bottom Status / Set Default Action */}
                <div className="pt-4 mt-4 border-t border-[#F5F3EF] flex items-center justify-between text-xs">
                  {addr.isDefault ? (
                    <span className="text-[11px] font-bold text-[#8C7355] flex items-center gap-1 uppercase tracking-wider font-mono">
                      <Check size={13} />
                      <span>Primary Delivery Destination</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetDefaultAddress(addr.id)}
                      className="text-[11px] font-bold text-[#666666] hover:text-black uppercase tracking-wider underline cursor-pointer"
                    >
                      Set As Default
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleEditAddress(addr)}
                    className="text-[11px] font-bold text-black uppercase tracking-wider hover:underline cursor-pointer"
                  >
                    Edit →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-8 sm:p-14 text-center space-y-5 shadow-xs max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E5E3DD] flex items-center justify-center text-[#8C7355] mx-auto">
              <MapPin size={30} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold uppercase tracking-tight text-black">
                No Saved Addresses
              </h2>
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed max-w-md mx-auto">
                Add your home or office address to enable 1-click tailored deliveries for all bespoke commissions.
              </p>
            </div>
            <div className="pt-3">
              <button
                type="button"
                onClick={handleOpenAddAddress}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-[8px] transition-all shadow-xs cursor-pointer"
              >
                <Plus size={14} />
                <span>Add First Address</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

