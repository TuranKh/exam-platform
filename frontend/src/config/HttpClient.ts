import axios from "axios";
import config from "../../../env.ts";
import toast from "react-hot-toast";

export const httpClient = axios.create({
  baseURL: config.backend.url,
});

httpClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    toast.error(error?.response?.data?.message || "Xəta baş verdi");
    return Promise.reject(error);
  },
);
