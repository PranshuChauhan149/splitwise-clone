import { getPrisma } from "../utils/prismaClient.js";

export const findUserByEmail = async (email) => {
  return getPrisma().user.findUnique({ where: { email } });
};

export const findUserById = async (id) => {
  return getPrisma().user.findUnique({ where: { id } });
};

export const createUser = async (userData) => {
  return getPrisma().user.create({ data: userData });
};
