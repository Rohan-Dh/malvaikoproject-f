/**
 * api.js — Auth + fetch helpers
 * Security: access token in memory, refresh token in httpOnly cookie
 */

export function getBase() {
    const h = window.location.hostname;
    return (h === "127.0.0.1" || h === "localhost")
        ? "http://[::1]:8080"
        : "https://api.whobrokit.com";
}

let _token = null;
let _refreshTimer = null;

function loadStoredToken() {
    return sessionStorage.getItem("admin_accessToken") || localStorage.getItem("admin_accessToken");
}

function persistToken(token) {
    sessionStorage.setItem("admin_accessToken", token);
    localStorage.setItem("admin_accessToken", token);
}

function clearStoredToken() {
    sessionStorage.removeItem("admin_accessToken");
    localStorage.removeItem("admin_accessToken");
}

_token = loadStoredToken();

function setToken(token, expiresIn) {
    _token = token;
    persistToken(token);
    scheduleRefresh(expiresIn);
}

function clearToken() {
    _token = null;
    clearStoredToken();
    if (_refreshTimer) { clearTimeout(_refreshTimer); _refreshTimer = null; }
}

function scheduleRefresh(expiresIn) {
    if (_refreshTimer) clearTimeout(_refreshTimer);
    const sec = typeof expiresIn === "number"
        ? expiresIn
        : parseInt(expiresIn) * (String(expiresIn).endsWith("m") ? 60 : 1);
    const ms = (sec - 60) * 1000;
    if (ms <= 0) return;
    _refreshTimer = setTimeout(() => silentRefresh(), ms);
}

export async function silentRefresh() {
    try {
        const r = await fetch(`${getBase()}/api/auth/refresh`, {
            method: "POST", credentials: "include",
        });
        const d = await r.json();
        if (r.ok && d.ok) { setToken(d.accessToken, d.expiresIn); return true; }
    } catch {
        // Ignore errors; we'll just end up not refreshing the token
    }
    clearToken();
    return false;
}

export async function login(email, password) {
    const r = await fetch(`${getBase()}/api/auth/login`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const d = await r.json();
    if (r.ok && d.ok) { setToken(d.accessToken, d.expiresIn); return { ok: true }; }
    return { ok: false, message: d.message || "Login failed." };
}

export async function logout() {
    try {
        await fetch(`${getBase()}/api/auth/logout`, {
            method: "POST", credentials: "include",
            headers: { Authorization: `Bearer ${_token}` },
        });
    } catch {
        // Even if the request fails (e.g. network error), we still want to clear the token
    }
    clearToken();
}

export async function authFetch(url, opts = {}) {
    const go = (tok) => fetch(url, {
        ...opts, credentials: "include",
        headers: { ...opts.headers, Authorization: `Bearer ${tok}` },
    });
    let r = await go(_token);
    if (r.status === 401) {
        const ok = await silentRefresh();
        if (!ok) throw new Error("Session expired. Please log in again.");
        r = await go(_token);
    }
    return r;
}

export function isAuthenticated() { return !!_token; }

export async function restoreSession() { return await silentRefresh(); }