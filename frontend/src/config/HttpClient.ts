import axios from "axios";
import { config } from "../../env";

export const httpClient = axios.create({
  baseURL: config.backend.url,
});
