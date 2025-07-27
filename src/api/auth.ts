import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export const signUp = async (data: {
  username: string;
  name: string;
  password: string;
  email: string;
  class_code: number;
}) => {
  return axios.post(`${BASE_URL}/auth/signup`, data);
};

export const login = async (data: { username: string; password: string }) => {
  return axios.post(`${BASE_URL}/auth/login`, data);
};
