import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import pg from "pg";

const base = process.argv[2] || "http://localhost:8083";
const email = `halo-test-${randomUUID()}@example.com`;
const password = `Halo-test-${randomUUID()}`;
const userIds = [];
async function request(path, { body, cookie, origin = base } = {}) {
  return fetch(`${base}${path}`, {
    method: body ? "POST" : "GET",
    redirect: "manual",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}
const cookieFrom = (r) =>
  r.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
try {
  const anonymous = await request("/clinic");
  assert.equal(anonymous.status, 307);
  assert.equal(anonymous.headers.get("location"), "/login");
  const signup = await request("/api/auth/sign-up/email", {
    body: { name: "Halo test user", email, password },
  });
  assert.equal(signup.status, 200, await signup.clone().text());
  const user = (await signup.json()).user;
  userIds.push(user.id);
  const cookie = cookieFrom(signup);
  assert.ok(cookie.includes("session_token="));
  const session = await request("/api/auth/get-session", { cookie });
  assert.equal((await session.json()).user.id, user.id);
  const denied = await request("/clinic", { cookie });
  assert.equal(denied.status, 404);
  assert.ok(!(await denied.text()).includes("Halton briefing"));
  const crossOrigin = await request("/api/auth/sign-in/email", {
    origin: "https://untrusted.example",
    body: { email, password },
  });
  assert.equal(crossOrigin.status, 403);
  const wrong = await request("/api/auth/sign-in/email", {
    body: { email, password: `${password}-wrong` },
  });
  assert.equal(wrong.status, 401);
  const logout = await request("/api/auth/sign-out", { cookie, body: {} });
  assert.equal(logout.status, 200);
  assert.ok(
    logout.headers
      .getSetCookie()
      .some((value) => value.includes("session_token=") && value.includes("Max-Age=0")),
  );
  const ended = await request("/api/auth/get-session?disableCookieCache=true", { cookie });
  assert.equal(await ended.json(), null);
  const login = await request("/api/auth/sign-in/email", { body: { email, password } });
  assert.equal(login.status, 200);
  assert.equal((await login.json()).user.id, user.id);
  console.log(
    "PASS: registration, persistent login, invalid password, logout, cross-origin rejection, guest and regular-user Clinic denial.",
  );
} finally {
  if (userIds.length && process.env.DATABASE_URL) {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    await pool.query('DELETE FROM "user" WHERE id = ANY($1::text[]) AND email = $2', [
      userIds,
      email,
    ]);
    await pool.end();
  }
}
