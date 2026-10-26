const SESSION_KEY = "datasmart_admin_session";

const ADMIN_USERNAME = import.meta.env["VITE_ADMIN_USERNAME"] ?? "datasmart";
const ADMIN_PASSWORD = import.meta.env["VITE_ADMIN_PASSWORD"] ?? "datasmart";

export function loginAdmin(username: string, password: string): boolean {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "1");
    return true;
  }
  return false;
}

export function logoutAdmin() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAdminLoggedIn(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "1";
}
