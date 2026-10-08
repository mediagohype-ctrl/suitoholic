"use client";

import { useState, type FormEvent } from "react";
import { KeyRound } from "lucide-react";
import { useAdminApi } from "@/lib/admin/api";
import { useAdminAuth } from "@/lib/admin/auth";
import { errorMessage, fieldErrors } from "@/lib/admin/format";
import { useToast } from "@/components/admin/feedback";
import { TextField } from "@/components/admin/fields";
import { Badge, Button, Card, CardHeader, Notice, PageHeader } from "@/components/admin/ui";

export default function AccountPage() {
  const { user } = useAdminAuth();
  const request = useAdminApi();
  const toast = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const local: Record<string, string> = {};
    if (!current) local.currentPassword = "Enter your current password";
    if (next.length < 8) local.newPassword = "Password must be at least 8 characters";
    if (next !== confirmPw) local.confirm = "Passwords don't match";
    if (Object.keys(local).length) {
      setErrors(local);
      return;
    }
    setSaving(true);
    setErrors({});
    try {
      await request("/auth/password", { method: "POST", body: { currentPassword: current, newPassword: next } });
      setCurrent("");
      setNext("");
      setConfirmPw("");
      toast.success("Password changed");
    } catch (err) {
      const fe = fieldErrors(err);
      setErrors(Object.keys(fe).length ? fe : { _: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="My account" description="Your profile and sign-in details." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="lg:self-start">
          <CardHeader title="Profile" description="Ask an admin to change your name, email or role." />
          <dl className="divide-y divide-[#EEF0F3] text-sm">
            <div className="flex justify-between gap-4 px-4 py-3 sm:px-5">
              <dt className="text-[#6B7280]">Name</dt>
              <dd className="font-medium">{user?.name}</dd>
            </div>
            <div className="flex justify-between gap-4 px-4 py-3 sm:px-5">
              <dt className="text-[#6B7280]">Email</dt>
              <dd className="truncate font-medium">{user?.email}</dd>
            </div>
            <div className="flex justify-between gap-4 px-4 py-3 sm:px-5">
              <dt className="text-[#6B7280]">Role</dt>
              <dd>
                <Badge tone={user?.role === "admin" ? "ink" : "bronze"}>{user?.role === "admin" ? "Admin" : "Editor"}</Badge>
              </dd>
            </div>
          </dl>
        </Card>
        <Card>
          <CardHeader title="Change password" />
          <form onSubmit={submit} className="space-y-4 p-4 sm:p-5">
            {errors._ && <Notice tone="red">{errors._}</Notice>}
            <TextField label="Current password" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} error={errors.currentPassword} />
            <TextField label="New password" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} error={errors.newPassword} hint="At least 8 characters." />
            <TextField label="Confirm new password" type="password" autoComplete="new-password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} error={errors.confirm} />
            <Button type="submit" variant="primary" loading={saving} icon={<KeyRound className="h-4 w-4" />}>
              Update password
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
