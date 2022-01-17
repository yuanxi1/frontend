import authHeader from './auth-header';
import axios from 'axios';

const API_URL = "http://localhost:8000/api/v1/";

export default function getTasks()  {
  return axios.get(API_URL + "tasks", { headers: authHeader() });
};
