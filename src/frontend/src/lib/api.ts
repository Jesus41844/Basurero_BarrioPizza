const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function authHeaders(token?: string | null): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options?.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Error de conexión" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

async function authRequest<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { ...authHeaders(token), ...(options?.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Error de conexión" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Public
  getBinLocations: () => request<any[]>("/api/v1/bins/locations"),

  // Client (requires JWT)
  getWallet: (token: string) => authRequest<{ usuario: any; cupones: any[] }>("/api/v1/client/wallet", token),
  getHistory: (token: string) => authRequest<any[]>("/api/v1/client/history", token),
  getAchievements: (token: string) => authRequest<any[]>("/api/v1/client/achievements", token),
  reclaim: (token: string, qrToken: string) =>
    authRequest<any>("/api/v1/client/reclaim", token, {
      method: "POST",
      body: JSON.stringify({ token: qrToken }),
    }),
  redeem: (token: string, cuponId: string) =>
    authRequest<any>("/api/v1/client/redeem", token, {
      method: "POST",
      body: JSON.stringify({ cuponId }),
    }),

  // Staff (requires JWT)
  getStaffCoupons: (token: string) => authRequest<any[]>("/api/v1/staff/coupons", token),
  createStaffCoupon: (token: string, data: any) =>
    authRequest<any>("/api/v1/staff/coupons", token, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateStaffCoupon: (token: string, id: string, data: any) =>
    authRequest<any>(`/api/v1/staff/coupons/${id}`, token, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteStaffCoupon: (token: string, id: string) =>
    authRequest<any>(`/api/v1/staff/coupons/${id}`, token, { method: "DELETE" }),
  getStaffAchievements: (token: string) => authRequest<any[]>("/api/v1/staff/achievements", token),
  createStaffAchievement: (token: string, data: any) =>
    authRequest<any>("/api/v1/staff/achievements", token, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateStaffAchievement: (token: string, id: string, data: any) =>
    authRequest<any>(`/api/v1/staff/achievements/${id}`, token, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteStaffAchievement: (token: string, id: string) =>
    authRequest<any>(`/api/v1/staff/achievements/${id}`, token, { method: "DELETE" }),
  validateCoupon: (token: string, codigo: string) =>
    authRequest<any>("/api/v1/staff/validate-coupon", token, {
      method: "POST",
      body: JSON.stringify({ codigo }),
    }),
  getStaffReports: (token: string) => authRequest<any>("/api/v1/staff/reports", token),
  getAdminBins: (token: string) => authRequest<any[]>("/api/v1/admin/bins", token),
  createAdminBin: (token: string, data: any) =>
    authRequest<any>("/api/v1/admin/bins", token, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateAdminBin: (token: string, id: string, data: any) =>
    authRequest<any>(`/api/v1/admin/bins/${id}`, token, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteAdminBin: (token: string, id: string) =>
    authRequest<any>(`/api/v1/admin/bins/${id}`, token, { method: "DELETE" }),
};
