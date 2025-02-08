import axios from "axios";
import config from "../../../env.ts";

export const httpClient = axios.create({
  baseURL: config.backend.url,
});
