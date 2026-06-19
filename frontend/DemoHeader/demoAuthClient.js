const DEFAULT_API_BASE_URL = "https://auth.sjw-project.site";

const request = async (url, options) => {
  const response = await fetch(url, {
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    throw new Error("demo auth request failed");
  }

  return response;
};

export const createDemoAuthClient = (apiBaseUrl = DEFAULT_API_BASE_URL) => {
  const normalizedApiBaseUrl = apiBaseUrl.replace(/\/+$/, "");

  return {
    async fetchMe() {
      const response = await request(`${normalizedApiBaseUrl}/api/me`);
      return response.json();
    },
    async fetchProjects() {
      const response = await request(`${normalizedApiBaseUrl}/api/projects`);
      const data = await response.json();
      return Array.isArray(data.projects) ? data.projects : [];
    },
    async login() {
      await request(`${normalizedApiBaseUrl}/api/demo-login`, {
        method: "POST",
      });
    },
    async logout() {
      await request(`${normalizedApiBaseUrl}/api/logout`, {
        method: "POST",
      });
    },
  };
};
