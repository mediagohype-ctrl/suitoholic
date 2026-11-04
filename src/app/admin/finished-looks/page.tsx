"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ExternalLink,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useAdminApi } from "@/lib/admin/api";
import { apiFetch } from "@/lib/api";
import { toApiError } from "@/lib/admin/format";
import { useUnsavedChanges } from "@/lib/admin/useUnsavedChanges";
import { Modal, useConfirm, useToast } from "@/components/admin/feedback";
import { TextField, Toggle } from "@/components/admin/fields";
import { ImageField, MediaPreview } from "@/components/admin/media";
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  EmptyState,
  ErrorState,
  IconButton,
  PageHeader,
  SkeletonRows,
  TableWrap,
  Td,
  Th,
} from "@/components/admin/ui";
import {
  finishedLooks as defaultContent,
  type FinishedLookSlide,
  type FinishedLooksContent,
} from "@/content/sections/finishedLooks";

export default function AdminFinishedLooksPage() {
  const request = useAdminApi();
  const toast = useToast();
  const confirm = useConfirm();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [data, setData] = useState<FinishedLooksContent>(defaultContent);
  const [original, setOriginal] = useState<FinishedLooksContent>(defaultContent);
  const [saving, setSaving] = useState(false);

  // Edit / Add Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<FinishedLookSlide>({
    id: "",
    fabricImage: "",
    lookImage: "",
    title: "",
    description: "",
    fabricName: "",
    active: true,
  });
  const [formErrors, setFormErrors] = useState<{ fabricImage?: string; lookImage?: string; title?: string }>({});

  // Fetch current stored content
  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await apiFetch<{ data: FinishedLooksContent | null }>(
        "/content/finishedLooks"
      );
      if (res?.data && res.data.slides && Array.isArray(res.data.slides)) {
        setData(res.data);
        setOriginal(res.data);
      } else {
        setData(defaultContent);
        setOriginal(defaultContent);
      }
    } catch (err: unknown) {
      const e = toApiError(err);
      if (e.status === 404) {
        // Defaults
        setData(defaultContent);
        setOriginal(defaultContent);
      } else {
        setLoadError(e.message || "Failed to load finished looks data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isDirty = useMemo(
    () => JSON.stringify(data) !== JSON.stringify(original),
    [data, original]
  );
  useUnsavedChanges(isDirty);

  // Save changes to Postgres backend
  const handleSave = async (dataToSave = data) => {
    setSaving(true);
    try {
      await request<{ data: FinishedLooksContent }>(
        "/content/finishedLooks",
        {
          method: "PUT",
          body: { data: dataToSave },
        }
      );
      setData(dataToSave);
      setOriginal(dataToSave);
      toast.success("Finished looks saved — live on the storefront!");
    } catch (err) {
      toast.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Revert back to built-in catalog defaults
  const handleResetToDefaults = async () => {
    const ok = await confirm({
      title: "Reset to default Finished Looks?",
      message:
        "This will restore the original catalog shirt pairs and reset all custom uploaded pairs. Are you sure?",
      confirmLabel: "Reset to Defaults",
      danger: true,
    });
    if (!ok) return;

    setSaving(true);
    try {
      await request("/content/finishedLooks", { method: "DELETE" });
      setData(defaultContent);
      setOriginal(defaultContent);
      toast.success("Reset to defaults — original looks restored.");
    } catch (err) {
      toast.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Open modal to add a new slide
  const openAddModal = () => {
    setEditingIndex(null);
    setForm({
      id: `look-${Date.now()}`,
      fabricImage: "",
      lookImage: "",
      title: "Fabric to bespoke luxury tailored look",
      description: "Shown to you in minutes, in store & online",
      fabricName: "",
      active: true,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  // Open modal to edit an existing slide
  const openEditModal = (slide: FinishedLookSlide, index: number) => {
    setEditingIndex(index);
    setForm({
      ...slide,
      active: slide.active !== false,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  // Submit modal form
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { fabricImage?: string; lookImage?: string; title?: string } = {};

    if (!form.fabricImage.trim()) errors.fabricImage = "Raw fabric image is required";
    if (!form.lookImage.trim()) errors.lookImage = "Finished look preview image is required";
    if (!form.title.trim()) errors.title = "Title is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newSlides = [...data.slides];
    if (editingIndex !== null && editingIndex >= 0) {
      newSlides[editingIndex] = form;
    } else {
      newSlides.push(form);
    }

    const updated = { ...data, slides: newSlides };
    setData(updated);
    setModalOpen(false);
    toast.success(editingIndex !== null ? "Finished look updated" : "Finished look added");
  };

  // Delete slide
  const handleDeleteSlide = async (index: number) => {
    const item = data.slides[index];
    const ok = await confirm({
      title: "Delete Finished Look?",
      message: `Are you sure you want to remove "${item.title || "this look"}"?`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;

    const newSlides = data.slides.filter((_, i) => i !== index);
    const updated = { ...data, slides: newSlides };
    setData(updated);
    toast.success("Finished look removed");
  };

  // Reorder slide
  const moveSlide = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= data.slides.length) return;

    const newSlides = [...data.slides];
    const [moved] = newSlides.splice(index, 1);
    newSlides.splice(targetIndex, 0, moved);

    setData({ ...data, slides: newSlides });
  };

  // Toggle active status directly from row
  const toggleActive = (index: number) => {
    const newSlides = [...data.slides];
    newSlides[index] = {
      ...newSlides[index],
      active: newSlides[index].active === false ? true : false,
    };
    setData({ ...data, slides: newSlides });
  };

  return (
    <>
      <PageHeader
        title="Finished Looks"
        description="Manage the 'See Before You Stitch' fabric-to-tailored look pairs shown on the storefront."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <ButtonLink
              href="/custom-shirt"
              target="_blank"
              variant="secondary"
              size="sm"
              icon={<ExternalLink className="h-4 w-4" />}
            >
              View on Site
            </ButtonLink>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleResetToDefaults}
              icon={<RotateCcw className="h-4 w-4" />}
              disabled={saving}
            >
              Reset to Defaults
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => handleSave()}
              icon={<Save className="h-4 w-4" />}
              loading={saving}
              disabled={!isDirty || saving}
            >
              {isDirty ? "Save Changes *" : "Saved"}
            </Button>
            <Button
              type="button"
              variant="bronze"
              size="sm"
              onClick={openAddModal}
              icon={<Plus className="h-4 w-4" />}
            >
              Add Finished Look
            </Button>
          </div>
        }
      />

      {loading ? (
        <Card className="p-6">
          <SkeletonRows rows={5} />
        </Card>
      ) : loadError ? (
        <ErrorState
          message={loadError}
          onRetry={loadData}
        />
      ) : (
        <div className="space-y-6">
          {/* Section Settings Card */}
          <Card className="p-5 sm:p-6 bg-white border border-[#E5E7EB] rounded-xl shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-[#9E774C]" />
              <h2 className="text-sm font-semibold text-[#14110E]">Section Headlines &amp; Copy</h2>
            </div>
            <div>
              <TextField
                label="Section Heading"
                value={data.sectionTitle}
                onChange={(e) => setData({ ...data, sectionTitle: e.target.value })}
                placeholder="Your fabric, as a finished look"
                hint="Main title displayed above the carousel cards"
              />
            </div>
          </Card>

          {/* Slides List Card */}
          <Card className="overflow-hidden border border-[#E5E7EB] rounded-xl shadow-xs">
            <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#14110E]">
                  Finished Look Pairs ({data.slides.length})
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Each pair matches a raw fabric swatch with a tailored finished preview on a model.
                </p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={openAddModal}
                icon={<Plus className="h-3.5 w-3.5" />}
              >
                Add Look
              </Button>
            </div>

            {data.slides.length === 0 ? (
              <EmptyState
                icon={<Sparkles className="h-10 w-10 text-[#9E774C]" />}
                title="No Finished Looks yet"
                description="Upload fabric swatches and tailored model looks to showcase custom craftsmanship."
                action={
                  <Button onClick={openAddModal} icon={<Plus className="h-4 w-4" />}>
                    Add your first look
                  </Button>
                }
              />
            ) : (
              <TableWrap>
                <thead>
                  <tr>
                    <Th className="w-14">Order</Th>
                    <Th className="w-56">Visual Pair (Fabric → Tailored)</Th>
                    <Th>Details &amp; Title</Th>
                    <Th className="w-24 text-center">Status</Th>
                    <Th className="w-32 text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {data.slides.map((slide, index) => {
                    const isActive = slide.active !== false;
                    return (
                      <tr key={slide.id || index} className="hover:bg-[#F9FAFB]/75 transition-colors">
                        {/* Order Reordering */}
                        <Td>
                          <div className="flex flex-col gap-1 items-center">
                            <IconButton
                              label="Move up"
                              disabled={index === 0}
                              onClick={() => moveSlide(index, -1)}
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </IconButton>
                            <IconButton
                              label="Move down"
                              disabled={index === data.slides.length - 1}
                              onClick={() => moveSlide(index, 1)}
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </IconButton>
                          </div>
                        </Td>

                        {/* Visual Pair */}
                        <Td>
                          <div className="flex items-center gap-2">
                            {/* Raw Fabric Swatch */}
                            <div className="relative group">
                              <MediaPreview
                                src={slide.fabricImage}
                                className="h-14 w-14 rounded-lg object-cover border border-[#E5E7EB]"
                              />
                              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#14110E] text-[9px] text-white font-medium px-1.5 py-0.2 rounded-sm shadow-xs whitespace-nowrap">
                                Swatch
                              </span>
                            </div>

                            <ArrowRight className="h-4 w-4 text-[#9CA3AF] shrink-0" />

                            {/* Finished Look */}
                            <div className="relative group">
                              <MediaPreview
                                src={slide.lookImage}
                                className="h-14 w-14 rounded-lg object-cover border border-[#E5E7EB]"
                              />
                              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#9E774C] text-[9px] text-white font-medium px-1.5 py-0.2 rounded-sm shadow-xs whitespace-nowrap">
                                Look
                              </span>
                            </div>
                          </div>
                        </Td>

                        {/* Details */}
                        <Td>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-[#14110E]">
                                {slide.title || "Untitled Look"}
                              </span>
                              {slide.fabricName && (
                                <Badge tone="bronze" className="text-[10px]">
                                  {slide.fabricName}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-[#6B7280] line-clamp-1">
                              {slide.description}
                            </p>
                          </div>
                        </Td>

                        {/* Status Toggle */}
                        <Td className="text-center">
                          <button
                            type="button"
                            onClick={() => toggleActive(index)}
                            className="cursor-pointer"
                            title="Click to toggle status"
                          >
                            <Badge tone={isActive ? "green" : "neutral"}>
                              {isActive ? "Active" : "Hidden"}
                            </Badge>
                          </button>
                        </Td>

                        {/* Actions */}
                        <Td className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <IconButton
                              label="Edit look"
                              onClick={() => openEditModal(slide, index)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </IconButton>
                            <IconButton
                              label="Delete look"
                              onClick={() => handleDeleteSlide(index)}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-500" />
                            </IconButton>
                          </div>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </TableWrap>
            )}
          </Card>

          {/* Floating Save Reminder when dirty */}
          {isDirty && (
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#14110E] text-white px-5 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4">
              <span className="text-xs font-medium">You have unsaved changes</span>
              <Button
                size="sm"
                variant="bronze"
                onClick={() => handleSave()}
                loading={saving}
                icon={<Save className="h-3.5 w-3.5" />}
              >
                Save Live
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Look Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingIndex !== null ? "Edit Finished Look Pair" : "Add Finished Look Pair"}
        description="Pair a raw fabric swatch with a tailored model photo to show customers the finished look."
        size="lg"
      >
        <form onSubmit={handleModalSubmit} className="space-y-5">
          {/* Visual Images Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
            {/* Raw Fabric Swatch Field */}
            <div>
              <ImageField
                label="1. Raw Fabric Swatch"
                value={form.fabricImage}
                onChange={(url) => {
                  setForm((f) => ({ ...f, fabricImage: url }));
                  if (formErrors.fabricImage) {
                    setFormErrors((prev) => ({ ...prev, fabricImage: undefined }));
                  }
                }}
                error={formErrors.fabricImage}
                hint="Upload or pick fabric texture photo"
              />
            </div>

            {/* Finished Look Preview Field */}
            <div>
              <ImageField
                label="2. Tailored Finished Look"
                value={form.lookImage}
                onChange={(url) => {
                  setForm((f) => ({ ...f, lookImage: url }));
                  if (formErrors.lookImage) {
                    setFormErrors((prev) => ({ ...prev, lookImage: undefined }));
                  }
                }}
                error={formErrors.lookImage}
                hint="Upload or pick shirt / suit model photo"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => {
                setForm((f) => ({ ...f, title: e.target.value }));
                if (formErrors.title) {
                  setFormErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              error={formErrors.title}
              placeholder="Fabric to bespoke Italian natural linen shirt"
              hint="Shown at the bottom of the card on the storefront"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Shown to you in minutes, in store & online"
              />

              <TextField
                label="Fabric Name / Material (Optional)"
                value={form.fabricName || ""}
                onChange={(e) => setForm((f) => ({ ...f, fabricName: e.target.value }))}
                placeholder="Beige Textured Linen Cotton"
              />
            </div>

            <Toggle
              label="Active Status"
              description="Make this finished look visible to visitors in the carousel"
              checked={form.active !== false}
              onChange={(checked) => setForm((f) => ({ ...f, active: checked }))}
            />
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-2 pt-4 border-t border-[#E5E7EB]">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="bronze"
            >
              {editingIndex !== null ? "Update Look" : "Add Look"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
