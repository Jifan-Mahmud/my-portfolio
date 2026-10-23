const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getAuthToken() {
  if (typeof window === "undefined") return null;
  const lsToken = localStorage.getItem("portfolio_admin_token");
  if (lsToken) return lsToken;
  try {
    const match = document.cookie.match(new RegExp("(?:^|; )portfolio_admin_token=([^;]+)"));
    if (match) {
      const cookieToken = decodeURIComponent(match[1]);
      // Also sync back to localStorage
      try { localStorage.setItem("portfolio_admin_token", cookieToken); } catch (_) {}
      return cookieToken;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

export function setAuthToken(token) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("portfolio_admin_token", token);
  } else {
    localStorage.removeItem("portfolio_admin_token");
  }
}

export async function fetchAPI(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Convenience methods
export const api = {
  // Public & Profile
  getProfile: () => fetchAPI("/profile"),
  updateProfile: (body) => fetchAPI("/profile", { method: "PUT", body: JSON.stringify(body) }),

  // Projects
  getProjects: (featured) => fetchAPI(`/projects${featured ? "?featured=true" : ""}`),
  getProjectById: (id) => fetchAPI(`/projects/${id}`),
  createProject: (body) => fetchAPI("/projects", { method: "POST", body: JSON.stringify(body) }),
  updateProject: (id, body) => fetchAPI(`/projects/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteProject: (id) => fetchAPI(`/projects/${id}`, { method: "DELETE" }),

  // Skills
  getSkills: () => fetchAPI("/skills"),
  createSkill: (body) => fetchAPI("/skills", { method: "POST", body: JSON.stringify(body) }),
  updateSkill: (id, body) => fetchAPI(`/skills/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteSkill: (id) => fetchAPI(`/skills/${id}`, { method: "DELETE" }),

  // Experiences & Education
  getExperiences: () => fetchAPI("/experiences"),
  createExperience: (body) => fetchAPI("/experiences", { method: "POST", body: JSON.stringify(body) }),
  updateExperience: (id, body) => fetchAPI(`/experiences/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteExperience: (id) => fetchAPI(`/experiences/${id}`, { method: "DELETE" }),

  // Services
  getServices: () => fetchAPI("/services"),
  createService: (body) => fetchAPI("/services", { method: "POST", body: JSON.stringify(body) }),
  updateService: (id, body) => fetchAPI(`/services/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteService: (id) => fetchAPI(`/services/${id}`, { method: "DELETE" }),

  // Testimonials
  getTestimonials: () => fetchAPI("/testimonials"),
  createTestimonial: (body) => fetchAPI("/testimonials", { method: "POST", body: JSON.stringify(body) }),
  updateTestimonial: (id, body) => fetchAPI(`/testimonials/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteTestimonial: (id) => fetchAPI(`/testimonials/${id}`, { method: "DELETE" }),

  // Certificates
  getCertificates: () => fetchAPI("/certificates"),
  createCertificate: (body) => fetchAPI("/certificates", { method: "POST", body: JSON.stringify(body) }),
  updateCertificate: (id, body) => fetchAPI(`/certificates/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteCertificate: (id) => fetchAPI(`/certificates/${id}`, { method: "DELETE" }),

  // Messages
  sendMessage: (body) => fetchAPI("/messages", { method: "POST", body: JSON.stringify(body) }),
  getMessages: () => fetchAPI("/messages"),
  markMessageRead: (id) => fetchAPI(`/messages/${id}/read`, { method: "PATCH" }),
  deleteMessage: (id) => fetchAPI(`/messages/${id}`, { method: "DELETE" }),

  // Admin Dashboard
  getStats: () => fetchAPI("/dashboard/stats"),

  // Direct Express Auth
  adminLogin: (body) => fetchAPI("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  getMe: () => fetchAPI("/auth/me"),
};
