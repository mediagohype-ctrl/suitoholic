import bcrypt from "bcryptjs";
import { many, one, query } from "../db/pool.js";
import { ApiError } from "../utils/ApiError.js";

const PUBLIC_COLUMNS = `id, name, email, role, active, last_login_at AS "lastLoginAt", created_at AS "createdAt"`;

export const hashPassword = (pw) => bcrypt.hash(pw, 12);

let dummyHash;

export async function authenticate(email, password) {
  const user = await one("SELECT * FROM admin_users WHERE email = lower($1)", [email]);
  // Compare against a dummy hash when the user is missing so timing doesn't reveal valid emails.
  dummyHash ??= await hashPassword("not-a-real-password");
  const ok = await bcrypt.compare(password, user?.password_hash ?? dummyHash);
  if (!user || !ok) throw ApiError.unauthorized("Invalid email or password");
  if (!user.active) throw ApiError.unauthorized("This account is disabled");
  await query("UPDATE admin_users SET last_login_at = now() WHERE id = $1", [user.id]);
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function changePassword(userId, currentPassword, newPassword) {
  const user = await one("SELECT password_hash FROM admin_users WHERE id = $1", [userId]);
  if (!user || !(await bcrypt.compare(currentPassword, user.password_hash))) {
    throw ApiError.badRequest("Current password is incorrect");
  }
  await query("UPDATE admin_users SET password_hash = $1 WHERE id = $2", [await hashPassword(newPassword), userId]);
}

export const listUsers = () => many(`SELECT ${PUBLIC_COLUMNS} FROM admin_users ORDER BY id`);

export async function createUser({ name, email, password, role }) {
  return one(
    `INSERT INTO admin_users (name, email, password_hash, role) VALUES ($1, lower($2), $3, $4) RETURNING ${PUBLIC_COLUMNS}`,
    [name, email, await hashPassword(password), role],
  );
}

async function countOtherActiveAdmins(id) {
  return (await one("SELECT count(*) FROM admin_users WHERE role = 'admin' AND active AND id <> $1", [id])).count;
}

export async function updateUser(id, { name, email, role, active, password }, actingUserId) {
  const existing = await one("SELECT * FROM admin_users WHERE id = $1", [id]);
  if (!existing) throw ApiError.notFound("User not found");
  const demoting = (role && role !== "admin") || active === false;
  if (existing.role === "admin" && demoting && (await countOtherActiveAdmins(id)) === 0) {
    throw ApiError.conflict("There must be at least one active admin");
  }
  if (id === actingUserId && active === false) throw ApiError.conflict("You cannot disable your own account");

  return one(
    `UPDATE admin_users SET
       name = coalesce($2, name),
       email = coalesce(lower($3), email),
       role = coalesce($4, role),
       active = coalesce($5, active),
       password_hash = coalesce($6, password_hash)
     WHERE id = $1 RETURNING ${PUBLIC_COLUMNS}`,
    [id, name ?? null, email ?? null, role ?? null, active ?? null, password ? await hashPassword(password) : null],
  );
}

export async function deleteUser(id, actingUserId) {
  if (id === actingUserId) throw ApiError.conflict("You cannot delete your own account");
  const existing = await one("SELECT role FROM admin_users WHERE id = $1", [id]);
  if (!existing) throw ApiError.notFound("User not found");
  if (existing.role === "admin" && (await countOtherActiveAdmins(id)) === 0) {
    throw ApiError.conflict("There must be at least one active admin");
  }
  await query("DELETE FROM admin_users WHERE id = $1", [id]);
}
