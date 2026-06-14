import api from "../utils/axiosInstance.js";

export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (values) => api.post("/auth/register", values),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};

export const groupApi = {
  getGroups: () => api.get("/groups"),
  getGroupById: (groupId) => api.get(`/groups/${groupId}`),
  createGroup: (data) => api.post("/groups", data),
  addGroupMember: (groupId, payload) => api.post(`/groups/${groupId}/members`, payload),
  removeGroupMember: (groupId, userId) => api.delete(`/groups/${groupId}/members/${userId}`),
};

export const balanceApi = {
  getBalanceSummary: () => api.get("/balances/summary"),
  getGroupBalances: (groupId) => api.get(`/balances/group/${groupId}`),
};

export const settlementApi = {
  createSettlement: (data) => api.post("/settlements", data),
  getGroupSettlements: (groupId) => api.get(`/settlements/group/${groupId}`),
  getMySettlements: () => api.get("/settlements/me"),
};

export const expenseApi = {
  getExpenseMessages: (expenseId) => api.get(`/messages/${expenseId}`),
  getGroupExpenses: (groupId) => api.get(`/expenses/group/${groupId}`),
  createExpense: (data) => api.post("/expenses", data),
  getExpenseById: (expenseId) => api.get(`/expenses/${expenseId}`),
};

export default api;
