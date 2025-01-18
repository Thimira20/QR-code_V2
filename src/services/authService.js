// src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const register = async (username, email, password) => {
  return axios.post(`${API_URL}/auth/register`, {
    username,
    email,
    password,
  });
};

export const login = async (email, password) => {
  // const response = await axios.post(`${API_URL}/auth/login`, {
  //   email,
  //   password,
  // });
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    //return response.data;
    if (response.data.token) {
      //localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      console.log("Storing token:", response.data.token);
      console.log("Username:", response.data.user.username);
    }
    return response.data;
  } catch (error) {
    console.error("Login API error:", error); // Log API errors for debugging
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const getUserData = async () => {
  try {
    const response = await axios.get(`${API_URL}//user-data`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // or wherever you store the token
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const createUserData = async (data) => {
  try {
    const response = await axios.post(`${API_URL}//user-data`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error creating user data:", error);
    throw error;
  }
};
