import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const apiKeyHeader = {
  "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
};

async function request(pathname, method, data, providedHeaders) {
  let headers = { ...providedHeaders, ...apiKeyHeader };
  switch (method) {
    case "GET":
      const getRes = await axios.get(`${API_URL}${pathname}`, { headers });
      return getRes.data;
    case "POST":
      const postRes = await axios.post(`${API_URL}${pathname}`, data, {
        headers,
      });
      return postRes.data;
    case "DELETE":
      const deleteRes = await axios.delete(`${API_URL}${pathname}`, {
        headers,
      });
      return deleteRes.data;
    case "PATCH":
      const patchRes = await axios.patch(`${API_URL}${pathname}`, data, {
        headers,
      });
      return patchRes.data;
  }
}

export const userRequests = {
  // Sync User
  syncUser: async (token) => {
    return await request(
      "/general/users/sync",
      "GET",
      {},
      { Authorization: `Bearer ${token}` }
    );
  },
  // Get User Object
  getUserObject: async (token) => {
    return await request(
      "/general/users/object",
      "GET",
      {},
      { Authorization: `Bearer ${token}` }
    );
  },
  // Register Request
  registerRequest: async (email, password, classNumber, fullName, code) => {
    return await request(
      "/general/users/auth/register",
      "POST",
      { email, password, classNumber, fullName, superSecret: code },
      {}
    );
  },
  // Login Request
  loginRequest: async (email, password) => {
    return await request(
      "/general/users/auth/login",
      "POST",
      {
        email,
        password,
      },
      {}
    );
  },
  // Get all Users
  getAllUsers: async () => {
    return await request("/general/users/", "GET", {}, {});
  },
  // Logout
  logout: async (rTokenId, token) => {
    return await request(
      "/general/users/auth/logout",
      "POST",
      { rTokenId },
      { Authorization: `Bearer ${token}` }
    );
  },
};

export const articleRequests = {
  createArticle: async (token, title, text, cover, summary) => {
    return await request(
      "/general/articles/create",
      "POST",
      { title, text, cover, summary },
      { Authorization: `Bearer ${token}` }
    );
  },
  updateArticle: async (updatedArticle, id, token) => {
    return await request(
      `/general/articles/patch/${id}`,
      "PATCH",
      { ...updatedArticle },
      { Authorization: `Bearer ${token}` }
    );
  },
  getAllArticles: async () => {
    return await request("/general/articles/", "GET", {}, {});
  },
  getArticleById: async (id) => {
    return await request(`/general/articles/get/${id}`, "GET", {}, {});
  },
  search: async (query) => {
    return await request(`/general/articles/search/${query}`, "GET", {}, {});
  },
};
