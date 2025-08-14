import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import config from "@/config";

const apiClient = axios.create({
  baseURL: "/api",
});

apiClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    let message = "";

    if (error.response?.status === 401) {
      toast.error("Veuillez vous connecter");
      return signIn(undefined, { callbackUrl: config.auth.callbackUrl });
    } else if (error.response?.status === 403) {
      message = "Choisissez un plan pour utiliser cette fonctionnalité";
    } else {
      message =
        error?.response?.data?.error || error.message || error.toString();
    }

    error.message =
      typeof message === "string" ? message : JSON.stringify(message);

    console.error(error.message);

    if (error.message) {
      toast.error(error.message);
    } else {
      toast.error("Une erreur s'est produite...");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
