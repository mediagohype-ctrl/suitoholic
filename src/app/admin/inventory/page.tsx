"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  Check,
  Download,
  ExternalLink,
  Layers,
  Minus,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Scissors,
  Search,
  Settings,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { formatMoney } from "@/lib/api";
import { useAdminApi, useAdminQuery } from "@/lib/admin/api";
import type { AdminCategory, AdminFabric, AdminProduct, AdminSettings, Paginated } from "@/lib/admin/types";
import { useToast } from "@/components/admin/feedback";
import { inputClass } from "@/components/admin/fields";
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  EmptyState,
  ErrorState,
  PageHeader,
  SkeletonRows,
  TableWrap,
  Td,
  Th,
  Thumb,
  cn,
} from "@/components/admin/ui";

type InventoryTab = "products" | "fabrics";
type StockFilter = "all" | "low" | "out" | "in_stock" | "made_to_order";
type SortOption = "stock_asc" | "stock_desc" | "value_desc" | "name_asc";

export default function InventoryPage() {
  const request = useAdminApi();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<InventoryTab>("products");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("stock_asc");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [localStocks, setLocalStocks] = useState<Record<string, number | "">>({});

  // Query products and fabrics with safe limit (<= 200)
  const productsQuery = useAdminQuery<Paginated<AdminProduct>>("/products?limit=200");
  const fabricsQuery = useAdminQuery<Paginated<AdminFabric>>("/fabrics?limit=200");
  const categories = useAdminQuery<AdminCategory[]>("/categories");
  const settings = useAdminQuery<AdminSettings>("/settings");

  const lowThreshold = settings.data?.lowStockThreshold ?? 10;
  const currencySymbol = settings.data?.currencySymbol ?? "₹";

  const allProducts = productsQuery.data?.items ?? [];
  const allFabrics = fabricsQuery.data?.items ?? [];

  // Metrics for Garments
  const productMetrics = useMemo(() => {
    let totalUnits = 0;
    let totalValuation = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let madeToOrderCount = 0;
    let inStockCount = 0;

    for (const p of allProducts) {
      if (p.stock === null || p.stock === undefined) {
        madeToOrderCount++;
      } else {
        const qty = Number(p.stock);
        totalUnits += qty;
        totalValuation += qty * (Number(p.rawPrice) || 0);

        if (qty === 0) {
          outOfStockCount++;
        } else if (qty <= lowThreshold) {
          lowStockCount++;
        } else {
          inStockCount++;
        }
      }
    }

    return {
      totalItems: allProducts.length,
      totalUnits,
      totalValuation,
      lowStockCount,
      outOfStockCount,
      madeToOrderCount,
      inStockCount,
    };
  }, [allProducts, lowThreshold]);

  // Metrics for Fabrics
  const fabricMetrics = useMemo(() => {
    let totalMeters = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let inStockCount = 0;

    for (const f of allFabrics) {
      const qty = Number(f.stock ?? 50);
      totalMeters += qty;
      if (qty === 0) {
        outOfStockCount++;
      } else if (qty <= lowThreshold) {
        lowStockCount++;
      } else {
        inStockCount++;
      }
    }

    return {
      totalItems: allFabrics.length,
      totalUnits: totalMeters,
      totalValuation: 0,
      lowStockCount,
      outOfStockCount,
      madeToOrderCount: 0,
      inStockCount,
    };
  }, [allFabrics, lowThreshold]);

  const activeMetrics = activeTab === "products" ? productMetrics : fabricMetrics;

  // Filtered and sorted products
  const displayedProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSlug = p.slug.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchFabric = (p.fabric || "").toLowerCase().includes(q);
          if (!matchName && !matchSlug && !matchCat && !matchFabric) return false;
        }

        if (category && p.category !== category) return false;

        if (stockFilter === "low") {
          return p.stock !== null && p.stock !== undefined && p.stock > 0 && p.stock <= lowThreshold;
        }
        if (stockFilter === "out") {
          return p.stock !== null && p.stock !== undefined && p.stock === 0;
        }
        if (stockFilter === "in_stock") {
          return p.stock !== null && p.stock !== undefined && p.stock > lowThreshold;
        }
        if (stockFilter === "made_to_order") {
          return p.stock === null || p.stock === undefined;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "stock_asc") {
          const sA = a.stock === null ? 999999 : Number(a.stock);
          const sB = b.stock === null ? 999999 : Number(b.stock);
          return sA - sB;
        }
        if (sortBy === "stock_desc") {
          const sA = a.stock === null ? -1 : Number(a.stock);
          const sB = b.stock === null ? -1 : Number(b.stock);
          return sB - sA;
        }
        if (sortBy === "value_desc") {
          const valA = a.stock === null ? 0 : Number(a.stock) * (Number(a.rawPrice) || 0);
          const valB = b.stock === null ? 0 : Number(b.stock) * (Number(b.rawPrice) || 0);
          return valB - valA;
        }
        return a.name.localeCompare(b.name);
      });
  }, [allProducts, search, category, stockFilter, sortBy, lowThreshold]);

  // Filtered and sorted fabrics
  const displayedFabrics = useMemo(() => {
    return allFabrics
      .filter((f) => {
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = f.name.toLowerCase().includes(q);
          const matchCode = f.code.toLowerCase().includes(q);
          const matchCat = f.category.toLowerCase().includes(q);
          const matchComp = (f.composition || "").toLowerCase().includes(q);
          if (!matchName && !matchCode && !matchCat && !matchComp) return false;
        }

        if (category && f.category !== category) return false;

        const qty = Number(f.stock ?? 50);
        if (stockFilter === "low") return qty > 0 && qty <= lowThreshold;
        if (stockFilter === "out") return qty === 0;
        if (stockFilter === "in_stock") return qty > lowThreshold;
        if (stockFilter === "made_to_order") return false;

        return true;
      })
      .sort((a, b) => {
        const sA = Number(a.stock ?? 50);
        const sB = Number(b.stock ?? 50);
        if (sortBy === "stock_asc") return sA - sB;
        if (sortBy === "stock_desc") return sB - sA;
        return a.name.localeCompare(b.name);
      });
  }, [allFabrics, search, category, stockFilter, sortBy, lowThreshold]);

  // Update Product Stock
  const handleUpdateProductStock = async (product: AdminProduct, newStock: number | null) => {
    setUpdatingId(product.id);
    try {
      const updated = await request<AdminProduct>(`/products/${product.id}`, {
        method: "PATCH",
        body: { stock: newStock },
      });

      productsQuery.setData((d) => (d ? { ...d, items: d.items.map((x) => (x.id === product.id ? updated : x)) } : d!));

      setLocalStocks((prev) => {
        const next = { ...prev };
        delete next[`p_${product.id}`];
        return next;
      });

      if (newStock === null) {
        toast.success(`"${product.name}" set to Made to Order (Bespoke cut)`);
      } else if (newStock <= lowThreshold && newStock > 0) {
        toast.success(`Stock updated to ${newStock} units (Low Stock alert triggered)`);
      } else if (newStock === 0) {
        toast.success(`"${product.name}" is now Out of Stock`);
      } else {
        toast.success(`Updated stock for "${product.name}" to ${newStock} units`);
      }
    } catch (err) {
      toast.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Update Fabric Stock
  const handleUpdateFabricStock = async (fabric: AdminFabric, newStock: number) => {
    setUpdatingId(fabric.id);
    try {
      const updated = await request<AdminFabric>(`/fabrics/${fabric.id}`, {
        method: "PATCH",
        body: { stock: newStock },
      });

      fabricsQuery.setData((d) => (d ? { ...d, items: d.items.map((x) => (x.id === fabric.id ? updated : x)) } : d!));

      setLocalStocks((prev) => {
        const next = { ...prev };
        delete next[`f_${fabric.id}`];
        return next;
      });

      if (newStock <= lowThreshold && newStock > 0) {
        toast.success(`Fabric "${fabric.name}" stock updated to ${newStock} meters (Low stock alert)`);
      } else if (newStock === 0) {
        toast.success(`Fabric "${fabric.name}" is now Out of Stock (0m)`);
      } else {
        toast.success(`Fabric "${fabric.name}" stock updated to ${newStock} meters`);
      }
    } catch (err) {
      toast.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Quick product delta
  const handleProductDelta = (product: AdminProduct, delta: number) => {
    const current = product.stock === null || product.stock === undefined ? 0 : Number(product.stock);
    const nextVal = Math.max(0, current + delta);
    void handleUpdateProductStock(product, nextVal);
  };

  // Quick fabric delta
  const handleFabricDelta = (fabric: AdminFabric, delta: number) => {
    const current = Number(fabric.stock ?? 50);
    const nextVal = Math.max(0, current + delta);
    void handleUpdateFabricStock(fabric, nextVal);
  };

  // Restock low stock products (+10)
  const handleRestockLowProducts = async () => {
    const lowStockItems = allProducts.filter(
      (p) => p.stock !== null && p.stock !== undefined && p.stock <= lowThreshold,
    );
    if (lowStockItems.length === 0) {
      toast.info("No low stock products to restock right now.");
      return;
    }

    try {
      toast.info(`Restocking ${lowStockItems.length} products by +10 units...`);
      for (const item of lowStockItems) {
        const nextQty = (Number(item.stock) || 0) + 10;
        await request(`/products/${item.id}`, { method: "PATCH", body: { stock: nextQty } });
      }
      productsQuery.reload();
      toast.success(`Restocked ${lowStockItems.length} products!`);
    } catch (err) {
      toast.error(err);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (activeTab === "products") {
      const headers = ["ID", "SKU / Slug", "Name", "Category", "Unit Price", "Stock Units", "Status", "Asset Value"];
      const rows = allProducts.map((p) => {
        const isMto = p.stock === null || p.stock === undefined;
        const stock = isMto ? "Made to Order" : p.stock;
        const status = isMto ? "Bespoke" : Number(p.stock) === 0 ? "Out of Stock" : Number(p.stock) <= lowThreshold ? "Low Stock" : "In Stock";
        const totalVal = isMto ? 0 : Number(p.stock) * (Number(p.rawPrice) || 0);
        return [p.id, `"${p.slug}"`, `"${p.name.replace(/"/g, '""')}"`, `"${p.category}"`, p.rawPrice || 0, stock, status, totalVal];
      });
      const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csv));
      link.setAttribute("download", `suitoholic_products_inventory_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const headers = ["ID", "Code / SKU", "Name", "Category", "Price Label", "Stock (Meters)", "Status"];
      const rows = allFabrics.map((f) => {
        const qty = Number(f.stock ?? 50);
        const status = qty === 0 ? "Out of Stock" : qty <= lowThreshold ? "Low Stock" : "In Stock";
        return [f.id, `"${f.code}"`, `"${f.name.replace(/"/g, '""')}"`, `"${f.category}"`, `"${f.price || ""}"`, qty, status];
      });
      const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csv));
      link.setAttribute("download", `suitoholic_fabrics_inventory_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    toast.success("Inventory exported to CSV");
  };

  const getCategoryTitle = (key: string) => {
    const found = categories.data?.find((c) => c.id === key);
    return found?.shortTitle || found?.title || key;
  };

  const currentLoading = activeTab === "products" ? productsQuery.loading : fabricsQuery.loading;
  const currentError = activeTab === "products" ? productsQuery.error : fabricsQuery.error;
  const currentData = activeTab === "products" ? productsQuery.data : fabricsQuery.data;

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Monitor, update, and restock warehouse quantities across your entire store in real-time."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" icon={<Download className="h-4 w-4" />} onClick={handleExportCSV}>
              Export CSV
            </Button>
            <ButtonLink href="/admin/settings" variant="secondary" icon={<Settings className="h-4 w-4" />}>
              Alert Settings
            </ButtonLink>
            <ButtonLink href="/admin/products" variant="secondary" icon={<Package className="h-4 w-4" />}>
              Products
            </ButtonLink>
          </div>
        }
      />

      {/* Tab Switcher: Garments vs Fabrics */}
      <div className="mb-6 flex border-b border-[#E5E7EB]">
        <button
          type="button"
          onClick={() => {
            setActiveTab("products");
            setCategory("");
            setSearch("");
            setStockFilter("all");
          }}
          className={cn(
            "flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all cursor-pointer",
            activeTab === "products"
              ? "border-[#14110E] text-[#14110E]"
              : "border-transparent text-[#6B7280] hover:text-[#14110E]"
          )}
        >
          <Package className="h-4 w-4" />
          <span>Garments Stock</span>
          <span className="rounded-full bg-[#FAF5EE] px-2 py-0.5 text-xs text-[#9E774C] font-mono">
            {allProducts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("fabrics");
            setCategory("");
            setSearch("");
            setStockFilter("all");
          }}
          className={cn(
            "flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all cursor-pointer",
            activeTab === "fabrics"
              ? "border-[#14110E] text-[#14110E]"
              : "border-transparent text-[#6B7280] hover:text-[#14110E]"
          )}
        >
          <Scissors className="h-4 w-4" />
          <span>Fabrics Stock (Rolls &amp; Meters)</span>
          <span className="rounded-full bg-[#FAF5EE] px-2 py-0.5 text-xs text-[#9E774C] font-mono">
            {allFabrics.length}
          </span>
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="flex flex-col justify-between rounded-xl border border-[#E5E7EB] bg-white p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-[#6B7280]">
            <span className="text-xs font-medium">Total {activeTab === "products" ? "SKUs" : "Fabrics"}</span>
            <Package className="h-4 w-4 text-[#9CA3AF]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[#14110E]">{activeMetrics.totalItems}</p>
          <span className="mt-1 text-[11px] text-[#6B7280]">Active catalog items</span>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-[#E5E7EB] bg-white p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-[#6B7280]">
            <span className="text-xs font-medium">{activeTab === "products" ? "Units on Hand" : "Meters on Hand"}</span>
            <Boxes className="h-4 w-4 text-[#9E774C]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[#9E774C]">{activeMetrics.totalUnits.toLocaleString()}</p>
          <span className="mt-1 text-[11px] text-[#6B7280]">{activeTab === "products" ? "Total pieces" : "Total meters"}</span>
        </div>

        {activeTab === "products" ? (
          <div className="flex flex-col justify-between rounded-xl border border-[#E5E7EB] bg-white p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-xs font-medium">Stock Value</span>
              <Layers className="h-4 w-4 text-[#2E7D32]" />
            </div>
            <p className="mt-2 text-xl font-bold text-[#14110E] truncate" title={formatMoney(productMetrics.totalValuation, currencySymbol)}>
              {formatMoney(productMetrics.totalValuation, currencySymbol)}
            </p>
            <span className="mt-1 text-[11px] text-[#6B7280]">Total inventory asset</span>
          </div>
        ) : (
          <div className="flex flex-col justify-between rounded-xl border border-[#E5E7EB] bg-white p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-xs font-medium">In Stock Rolls</span>
              <Check className="h-4 w-4 text-[#2E7D32]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#2E7D32]">{fabricMetrics.inStockCount}</p>
            <span className="mt-1 text-[11px] text-[#6B7280]">Ready for bespoke cut</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setStockFilter(stockFilter === "low" ? "all" : "low")}
          className={cn(
            "flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all shadow-sm cursor-pointer",
            stockFilter === "low"
              ? "border-[#B45309] bg-[#FFFBEB] ring-2 ring-[#B45309]/50"
              : "border-[#FDE68A] bg-[#FEFDF7] hover:border-[#B45309]"
          )}
        >
          <div className="flex items-center justify-between text-[#B45309]">
            <span className="text-xs font-semibold">Low Stock</span>
            <AlertTriangle className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[#B45309]">{activeMetrics.lowStockCount}</p>
          <span className="mt-1 text-[11px] font-medium text-[#92400E]">≤ {lowThreshold} (urgent)</span>
        </button>

        <button
          type="button"
          onClick={() => setStockFilter(stockFilter === "out" ? "all" : "out")}
          className={cn(
            "flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all shadow-sm cursor-pointer",
            stockFilter === "out"
              ? "border-[#DC2626] bg-[#FEF2F2] ring-2 ring-[#DC2626]/50"
              : "border-[#FECACA] bg-[#FFFBFB] hover:border-[#DC2626]"
          )}
        >
          <div className="flex items-center justify-between text-[#DC2626]">
            <span className="text-xs font-semibold">Out of Stock</span>
            <XCircle className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[#DC2626]">{activeMetrics.outOfStockCount}</p>
          <span className="mt-1 text-[11px] font-medium text-[#991B1B]">0 units remaining</span>
        </button>

        <button
          type="button"
          onClick={() => setStockFilter(stockFilter === "made_to_order" ? "all" : "made_to_order")}
          className={cn(
            "flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all shadow-sm cursor-pointer",
            stockFilter === "made_to_order"
              ? "border-[#6B21A8] bg-[#FAF5FF] ring-2 ring-[#6B21A8]/50"
              : "border-[#E9D5FF] bg-[#FDFBFF] hover:border-[#6B21A8]"
          )}
        >
          <div className="flex items-center justify-between text-[#6B21A8]">
            <span className="text-xs font-semibold">Bespoke Cut</span>
            <span className="text-xs">✂️</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#6B21A8]">{activeMetrics.madeToOrderCount}</p>
          <span className="mt-1 text-[11px] text-[#6B7280]">Made to order pieces</span>
        </button>
      </div>

      {/* Alert Banner */}
      <div className="mb-6 flex flex-col gap-2 rounded-xl border border-[#FDE68A] bg-[#FFFDF5] p-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FEF3C7] text-[#B45309]">
            <ShieldAlert className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#92400E]">
              Low stock threshold is configured at ≤ {lowThreshold} units
            </p>
            <p className="text-[11px] text-[#B45309]">
              Instant Email &amp; WhatsApp alerts trigger automatically when any item drops to or below this count.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {activeTab === "products" && productMetrics.lowStockCount > 0 && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => void handleRestockLowProducts()}
              className="text-[#92400E] border-[#FCD34D] bg-[#FEF3C7] hover:bg-[#FDE68A]"
            >
              Restock All Low (+10)
            </Button>
          )}
          <Link href="/admin/settings" className="text-[11px] font-semibold text-[#9E774C] hover:underline">
            Configure Threshold →
          </Link>
        </div>
      </div>

      {/* Main Table Card */}
      <Card>
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-[#EEF0F3] p-3 sm:flex-row sm:items-center sm:p-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              className={cn(inputClass, "pl-9")}
              placeholder={activeTab === "products" ? "Search product name, SKU, material…" : "Search fabric name, code, composition…"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {activeTab === "products" && (
            <select
              className={cn(inputClass, "sm:w-48")}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories.data?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.shortTitle || c.title}
                </option>
              ))}
            </select>
          )}

          <select
            className={cn(inputClass, "sm:w-48")}
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as StockFilter)}
            aria-label="Filter by stock status"
          >
            <option value="all">All Statuses ({activeTab === "products" ? allProducts.length : allFabrics.length})</option>
            <option value="low">⚠️ Low Stock (≤ {lowThreshold})</option>
            <option value="out">🔴 Out of Stock (0)</option>
            <option value="in_stock">🟢 In Stock (&gt; {lowThreshold})</option>
            {activeTab === "products" && <option value="made_to_order">✂️ Made to Order</option>}
          </select>

          <select
            className={cn(inputClass, "sm:w-52")}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="Sort inventory"
          >
            <option value="stock_asc">Sort: Lowest Stock First</option>
            <option value="stock_desc">Sort: Highest Stock First</option>
            {activeTab === "products" && <option value="value_desc">Sort: Highest Value (₹)</option>}
            <option value="name_asc">Sort: Name (A-Z)</option>
          </select>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              if (activeTab === "products") productsQuery.reload();
              else fabricsQuery.reload();
            }}
            icon={<RefreshCw className={cn("h-3.5 w-3.5", currentLoading && "animate-spin")} />}
          >
            Refresh
          </Button>
        </div>

        {/* Content Table */}
        {currentError && !currentData ? (
          <ErrorState message={currentError.message} onRetry={() => (activeTab === "products" ? productsQuery.reload() : fabricsQuery.reload())} />
        ) : !currentData ? (
          <SkeletonRows rows={8} />
        ) : activeTab === "products" ? (
          /* Products Table */
          displayedProducts.length === 0 ? (
            <EmptyState
              icon={<Boxes className="h-6 w-6" />}
              title="No products match this filter"
              action={
                <Button onClick={() => { setSearch(""); setCategory(""); setStockFilter("all"); }}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <TableWrap className={cn(currentLoading && "opacity-60")}>
              <thead>
                <tr>
                  <Th>Product &amp; SKU</Th>
                  <Th>Category</Th>
                  <Th className="text-right">Price</Th>
                  <Th>Stock Status</Th>
                  <Th className="text-center min-w-[200px]">Quantity on Hand</Th>
                  <Th className="text-right">Stock Valuation</Th>
                  <Th className="text-right">Quick Restock</Th>
                </tr>
              </thead>
              <tbody>
                {displayedProducts.map((p) => {
                  const isUpdating = updatingId === p.id;
                  const isMto = p.stock === null || p.stock === undefined;
                  const currentQty = isMto ? null : Number(p.stock);
                  const localKey = `p_${p.id}`;
                  const localVal = localStocks[localKey];
                  const displayQty = localVal !== undefined ? localVal : (currentQty ?? 0);
                  const assetValue = isMto ? 0 : (currentQty || 0) * (Number(p.rawPrice) || 0);

                  return (
                    <tr
                      key={p.id}
                      className={cn(
                        "hover:bg-[#F9FAFB] transition-colors",
                        !p.active && "bg-[#F9FAFB]/70 opacity-70",
                        currentQty !== null && currentQty === 0 && "bg-[#FEF2F2]/30",
                        currentQty !== null && currentQty > 0 && currentQty <= lowThreshold && "bg-[#FFFBEB]/40"
                      )}
                    >
                      <Td>
                        <div className="flex min-w-[240px] items-center gap-3">
                          <Link href={`/admin/products/${p.id}`} className="shrink-0">
                            <Thumb src={p.image} className="h-11 w-11 rounded-lg border border-[#E5E7EB] object-cover" />
                          </Link>
                          <div className="min-w-0">
                            <Link href={`/admin/products/${p.id}`} className="font-semibold text-xs sm:text-sm text-[#14110E] hover:underline block truncate">
                              {p.name}
                            </Link>
                            <span className="font-mono text-[11px] text-[#6B7280]">{p.slug}</span>
                          </div>
                        </div>
                      </Td>
                      <Td><Badge tone="neutral">{getCategoryTitle(p.category)}</Badge></Td>
                      <Td className="text-right font-medium text-xs text-[#14110E]">
                        {formatMoney(Number(p.rawPrice) || 0, currencySymbol)}
                      </Td>
                      <Td>
                        {isMto || currentQty === null ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF5FF] px-2.5 py-1 text-xs font-semibold text-[#6B21A8] border border-[#E9D5FF]">
                            <span>✂️</span> Made to order
                          </span>
                        ) : currentQty === 0 ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF2F2] px-2.5 py-1 text-xs font-semibold text-[#DC2626] border border-[#FECACA]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#DC2626]" /> Out of stock
                          </span>
                        ) : currentQty <= lowThreshold ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFFBEB] px-2.5 py-1 text-xs font-semibold text-[#B45309] border border-[#FDE68A]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#B45309] animate-pulse" /> Low stock ({currentQty})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] px-2.5 py-1 text-xs font-semibold text-[#16A34A] border border-[#BBF7D0]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" /> In stock ({currentQty})
                          </span>
                        )}
                      </Td>
                      <Td className="text-center">
                        {isMto || currentQty === null ? (
                          <button
                            type="button"
                            onClick={() => void handleUpdateProductStock(p, 10)}
                            disabled={isUpdating}
                            className="text-xs font-medium text-[#9E774C] hover:underline rounded px-2.5 py-1 bg-[#FAF8F5] border border-[#E8DFD5] hover:bg-[#F5EFE6]"
                          >
                            + Track Stock Units
                          </button>
                        ) : (
                          <div className="inline-flex flex-col items-center gap-1">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleProductDelta(p, -1)}
                                disabled={isUpdating || currentQty <= 0}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F3F4F6] disabled:opacity-30"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <input
                                type="number"
                                min={0}
                                step={1}
                                value={displayQty}
                                disabled={isUpdating}
                                onChange={(e) => {
                                  const val = e.target.value === "" ? "" : Number(e.target.value);
                                  setLocalStocks((prev) => ({ ...prev, [localKey]: val }));
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    const val = localStocks[localKey];
                                    if (val !== undefined && val !== "") void handleUpdateProductStock(p, Math.max(0, Number(val)));
                                  }
                                }}
                                onBlur={() => {
                                  const val = localStocks[localKey];
                                  if (val !== undefined && val !== "" && val !== currentQty) void handleUpdateProductStock(p, Math.max(0, Number(val)));
                                }}
                                className={cn(
                                  "h-8 w-18 text-center text-xs font-bold rounded-md border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-[#9E774C]",
                                  currentQty <= lowThreshold && "border-[#F59E0B] text-[#B45309]",
                                  currentQty === 0 && "border-[#EF4444] text-[#DC2626]"
                                )}
                              />
                              <button
                                type="button"
                                onClick={() => handleProductDelta(p, 1)}
                                disabled={isUpdating}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F3F4F6] disabled:opacity-30"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                              {localStocks[localKey] !== undefined && localStocks[localKey] !== currentQty && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const val = localStocks[localKey];
                                    if (val !== undefined && val !== "") void handleUpdateProductStock(p, Math.max(0, Number(val)));
                                  }}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#16A34A] text-white hover:bg-[#15803D]"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => void handleUpdateProductStock(p, null)}
                              disabled={isUpdating}
                              className="text-[10px] text-[#6B7280] hover:text-[#14110E] hover:underline"
                            >
                              Set to Made to Order
                            </button>
                          </div>
                        )}
                      </Td>
                      <Td className="text-right font-medium text-xs text-[#14110E]">
                        {isMto ? <span className="text-[#9CA3AF]">—</span> : formatMoney(assetValue, currencySymbol)}
                      </Td>
                      <Td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!isMto && (
                            <>
                              <Button size="sm" variant="secondary" onClick={() => handleProductDelta(p, 10)} disabled={isUpdating} className="h-7 px-2 text-[11px]">
                                +10
                              </Button>
                              <Button size="sm" variant="secondary" onClick={() => handleProductDelta(p, 25)} disabled={isUpdating} className="h-7 px-2 text-[11px]">
                                +25
                              </Button>
                            </>
                          )}
                          <Link href={`/admin/products/${p.id}`} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#6B7280] hover:bg-[#F3F4F6]">
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </TableWrap>
          )
        ) : (
          /* Fabrics Table */
          displayedFabrics.length === 0 ? (
            <EmptyState
              icon={<Scissors className="h-6 w-6" />}
              title="No fabrics match this filter"
              action={<Button onClick={() => { setSearch(""); setCategory(""); setStockFilter("all"); }}>Clear filters</Button>}
            />
          ) : (
            <TableWrap className={cn(currentLoading && "opacity-60")}>
              <thead>
                <tr>
                  <Th>Fabric &amp; SKU</Th>
                  <Th>Category</Th>
                  <Th>Composition &amp; Weave</Th>
                  <Th className="text-right">Price</Th>
                  <Th>Stock Status</Th>
                  <Th className="text-center min-w-[200px]">Meters on Hand</Th>
                  <Th className="text-right">Quick Restock</Th>
                </tr>
              </thead>
              <tbody>
                {displayedFabrics.map((f) => {
                  const isUpdating = updatingId === f.id;
                  const currentQty = Number(f.stock ?? 50);
                  const localKey = `f_${f.id}`;
                  const localVal = localStocks[localKey];
                  const displayQty = localVal !== undefined ? localVal : currentQty;

                  return (
                    <tr
                      key={f.id}
                      className={cn(
                        "hover:bg-[#F9FAFB] transition-colors",
                        !f.active && "bg-[#F9FAFB]/70 opacity-70",
                        currentQty === 0 && "bg-[#FEF2F2]/30",
                        currentQty > 0 && currentQty <= lowThreshold && "bg-[#FFFBEB]/40"
                      )}
                    >
                      <Td>
                        <div className="flex min-w-[240px] items-center gap-3">
                          <Link href={`/admin/fabrics/${f.id}`} className="shrink-0">
                            <Thumb src={f.image} className="h-11 w-11 rounded-lg border border-[#D5C2AF] object-cover" />
                          </Link>
                          <div className="min-w-0">
                            <Link href={`/admin/fabrics/${f.id}`} className="font-semibold text-xs sm:text-sm text-[#14110E] hover:underline block truncate">
                              {f.name}
                            </Link>
                            <span className="font-mono text-[11px] text-[#7A4B1A] font-semibold">{f.code}</span>
                          </div>
                        </div>
                      </Td>
                      <Td><Badge tone="bronze">{f.categoryLabel || f.category}</Badge></Td>
                      <Td>
                        <p className="max-w-[200px] truncate text-xs text-[#14110E]">{f.composition || "—"}</p>
                        <p className="truncate text-[11px] text-[#6B7280]">{f.gsm ? `${f.gsm} · ` : ""}{f.weave || ""}</p>
                      </Td>
                      <Td className="text-right font-medium text-xs text-[#14110E]">{f.price || "—"}</Td>
                      <Td>
                        {currentQty === 0 ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF2F2] px-2.5 py-1 text-xs font-semibold text-[#DC2626] border border-[#FECACA]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#DC2626]" /> Out of stock (0m)
                          </span>
                        ) : currentQty <= lowThreshold ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFFBEB] px-2.5 py-1 text-xs font-semibold text-[#B45309] border border-[#FDE68A]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#B45309] animate-pulse" /> Low stock ({currentQty}m)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] px-2.5 py-1 text-xs font-semibold text-[#16A34A] border border-[#BBF7D0]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" /> In stock ({currentQty}m)
                          </span>
                        )}
                      </Td>
                      <Td className="text-center">
                        <div className="inline-flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleFabricDelta(f, -5)}
                            disabled={isUpdating || currentQty <= 0}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F3F4F6] disabled:opacity-30"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <div className="relative">
                            <input
                              type="number"
                              min={0}
                              step={1}
                              value={displayQty}
                              disabled={isUpdating}
                              onChange={(e) => {
                                const val = e.target.value === "" ? "" : Number(e.target.value);
                                setLocalStocks((prev) => ({ ...prev, [localKey]: val }));
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const val = localStocks[localKey];
                                  if (val !== undefined && val !== "") void handleUpdateFabricStock(f, Math.max(0, Number(val)));
                                }
                              }}
                              onBlur={() => {
                                const val = localStocks[localKey];
                                if (val !== undefined && val !== "" && val !== currentQty) void handleUpdateFabricStock(f, Math.max(0, Number(val)));
                              }}
                              className={cn(
                                "h-8 w-20 text-center text-xs font-bold rounded-md border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-[#9E774C]",
                                currentQty <= lowThreshold && "border-[#F59E0B] text-[#B45309]",
                                currentQty === 0 && "border-[#EF4444] text-[#DC2626]"
                              )}
                            />
                            <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-[#9CA3AF]">m</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleFabricDelta(f, 5)}
                            disabled={isUpdating}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F3F4F6] disabled:opacity-30"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          {localStocks[localKey] !== undefined && localStocks[localKey] !== currentQty && (
                            <button
                              type="button"
                              onClick={() => {
                                const val = localStocks[localKey];
                                if (val !== undefined && val !== "") void handleUpdateFabricStock(f, Math.max(0, Number(val)));
                              }}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#16A34A] text-white hover:bg-[#15803D]"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </Td>
                      <Td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="secondary" onClick={() => handleFabricDelta(f, 10)} disabled={isUpdating} className="h-7 px-2 text-[11px]">
                            +10m
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleFabricDelta(f, 50)} disabled={isUpdating} className="h-7 px-2 text-[11px]">
                            +50m
                          </Button>
                          <Link href={`/admin/fabrics/${f.id}`} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#6B7280] hover:bg-[#F3F4F6]">
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </TableWrap>
          )
        )}

        {/* Footer info */}
        <div className="flex flex-col gap-2 border-t border-[#EEF0F3] px-4 py-3 sm:flex-row sm:items-center sm:justify-between text-xs text-[#6B7280]">
          <p>
            Showing <strong className="text-[#14110E]">{activeTab === "products" ? displayedProducts.length : displayedFabrics.length}</strong> {activeTab === "products" ? "garments" : "fabrics"}
          </p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#16A34A]" /> In Stock
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#B45309]" /> Low Stock (≤ {lowThreshold})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#DC2626]" /> Out of Stock
            </span>
            {activeTab === "products" && (
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#6B21A8]" /> Made to Order
              </span>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}
