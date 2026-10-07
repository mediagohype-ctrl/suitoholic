"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { useAdminApi, useAdminQuery } from "@/lib/admin/api";
import { useAdminAuth } from "@/lib/admin/auth";
import { errorMessage, fieldErrors, formatDate } from "@/lib/admin/format";
import type { AdminRole, AdminUser } from "@/lib/admin/types";
import { Modal, useConfirm, useToast } from "@/components/admin/feedback";
import { SelectField, TextField, Toggle } from "@/components/admin/fields";
import { AdminOnly } from "@/components/admin/guards";
import { Badge, Button, Card, EmptyState, ErrorState, IconButton, Notice, PageHeader, SkeletonRows, TableWrap, Td, Th } from "@/components/admin/ui";

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin — full access" },
  { value: "editor", label: "Editor — catalog, orders & content" },
];

export default function UsersPage() {
  return (
    <>
      <PageHeader title="Team" description="People who can sign in to this admin. Editors can't change settings, manage users or delete subscribers." />
      <AdminOnly>
        <UsersTable />
      </AdminOnly>
    </>
  );
}

function UsersTable() {
  const request = useAdminApi();
  const toast = useToast();
  const confirm = useConfirm();
  const { user: me } = useAdminAuth();
  const { data, error, reload, setData } = useAdminQuery<AdminUser[]>("/users");
  const [editing, setEditing] = useState<{ user: AdminUser | null } | null>(null);

  const remove = async (u: AdminUser) => {
    const ok = await confirm({ title: `Remove ${u.name}?`, message: `${u.email} will no longer be able to sign in.`, confirmLabel: "Remove user", danger: true });
    if (!ok) return;
    try {
      await request(`/users/${u.id}`, { method: "DELETE" });
      setData((list) => (list ?? []).filter((x) => x.id !== u.id));
      toast.success("User removed");
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => setEditing({ user: null })}>
          Add user
        </Button>
      </div>
      <Card>
        {error && !data ? (
          <ErrorState message={error.message} onRetry={reload} />
        ) : !data ? (
          <SkeletonRows rows={4} />
        ) : data.length === 0 ? (
          <EmptyState icon={<Users className="h-5 w-5" />} title="No users" />
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>User</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Last sign-in</Th>
                <Th>Added</Th>
                <Th className="text-right" />
              </tr>
            </thead>
            <tbody>
              {data.map((u) => (
                <tr key={u.id} className="hover:bg-[#FCF9F5]">
                  <Td>
                    <p className="font-medium">
                      {u.name} {u.id === me?.id && <span className="text-xs font-normal text-[#9E774C]">(you)</span>}
                    </p>
                    <p className="text-xs text-[#8a7a6a]">{u.email}</p>
                  </Td>
                  <Td>
                    <Badge tone={u.role === "admin" ? "ink" : "bronze"}>{u.role === "admin" ? "Admin" : "Editor"}</Badge>
                  </Td>
                  <Td>{u.active ? <Badge tone="green">Active</Badge> : <Badge tone="red">Disabled</Badge>}</Td>
                  <Td className="text-xs text-[#665749]">{u.lastLoginAt ? formatDate(u.lastLoginAt, true) : "Never"}</Td>
                  <Td className="text-xs text-[#665749]">{formatDate(u.createdAt)}</Td>
                  <Td className="text-right">
                    <div className="flex justify-end">
                      <IconButton label="Edit" onClick={() => setEditing({ user: u })}>
                        <Pencil className="h-4 w-4" />
                      </IconButton>
                      <IconButton label="Remove" disabled={u.id === me?.id} onClick={() => void remove(u)} className="hover:bg-[#FBE9E6] hover:text-[#B4402F]">
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </Card>
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.user ? `Edit ${editing.user.name}` : "Add user"} size="md">
        {editing && (
          <UserForm
            key={editing.user?.id ?? "new"}
            user={editing.user}
            isSelf={editing.user?.id === me?.id}
            onClose={() => setEditing(null)}
            onSaved={(u, created) => {
              setData((list) => (created ? [...(list ?? []), u] : (list ?? []).map((x) => (x.id === u.id ? { ...x, ...u } : x))));
              setEditing(null);
            }}
          />
        )}
      </Modal>
    </>
  );
}

function UserForm({ user, isSelf, onClose, onSaved }: { user: AdminUser | null; isSelf: boolean; onClose: () => void; onSaved: (u: AdminUser, created: boolean) => void }) {
  const request = useAdminApi();
  const toast = useToast();
  const { setUser } = useAdminAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState<AdminRole>(user?.role ?? "editor");
  const [active, setActive] = useState(user?.active ?? true);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const local: Record<string, string> = {};
    if (!name.trim()) local.name = "Name is required";
    if (!email.trim()) local.email = "Email is required";
    if (!user && password.length < 8) local.password = "Password must be at least 8 characters";
    if (user && password && password.length < 8) local.password = "Password must be at least 8 characters";
    if (Object.keys(local).length) {
      setErrors(local);
      return;
    }
    setSaving(true);
    setErrors({});
    try {
      let saved: AdminUser;
      if (user) {
        const body: Record<string, unknown> = {};
        if (name.trim() !== user.name) body.name = name.trim();
        if (email.trim() !== user.email) body.email = email.trim();
        if (role !== user.role) body.role = role;
        if (active !== user.active) body.active = active;
        if (password) body.password = password;
        saved = Object.keys(body).length ? await request<AdminUser>(`/users/${user.id}`, { method: "PATCH", body }) : user;
        if (isSelf) setUser({ ...user, ...saved });
      } else {
        saved = await request<AdminUser>("/users", { method: "POST", body: { name: name.trim(), email: email.trim(), password, role } });
      }
      toast.success(user ? "User updated" : "User added");
      onSaved(saved, !user);
    } catch (err) {
      const fe = fieldErrors(err);
      setErrors(Object.keys(fe).length ? fe : { _: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {errors._ && <Notice tone="red">{errors._}</Notice>}
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} autoComplete="off" />
      <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} autoComplete="off" />
      <SelectField label="Role" value={role} onChange={(e) => setRole(e.target.value as AdminRole)} options={ROLE_OPTIONS} error={errors.role} disabled={isSelf} hint={isSelf ? "You can't change your own role." : undefined} />
      <TextField
        label={user ? "Reset password" : "Password"}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        autoComplete="new-password"
        hint={user ? "Leave empty to keep the current password. At least 8 characters." : "At least 8 characters. Share it securely."}
      />
      {user && <Toggle checked={active} onChange={setActive} disabled={isSelf} label="Active" description={isSelf ? "You can't disable your own account." : "Disabled users can't sign in."} />}
      <div className="flex justify-end gap-2 border-t border-[#EFE5D8] pt-4">
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="primary" loading={saving} onClick={() => void save()}>
          {user ? "Save changes" : "Add user"}
        </Button>
      </div>
    </div>
  );
}
