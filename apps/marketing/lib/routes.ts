/**
 * App route paths. API paths for auth live in `@gorro/api/endpoints`.
 */
export const routes = {
  home: "/",
  cgas: {
    list: "/cgas",
    detail: (userId: string) => `/cgas/${encodeURIComponent(userId)}`,
  },
  analytics: "/analytics",
  targets: "/targets",
  campaigns: {
    list: "/campaigns",
    detail: (id: string) => `/campaigns/${encodeURIComponent(id)}`,
  },
  communities: {
    list: "/communities",
  },
  segments: {
    list: "/segments",
    detail: (key: string) => `/segments/${encodeURIComponent(key)}`,
  },
  export: "/export",
  org: {
    territories: "/territories",
    teamLeads: "/team-leads",
  },
  public: {
    login: "/login",
  },
  api: {
    sessionClear: "/api/auth/logout",
  },
  protected: {
    base: "/",
  },
} as const
