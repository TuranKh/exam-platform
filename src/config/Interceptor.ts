import toast from "react-hot-toast";

export default function applyInterceptor() {
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    console.log("executed");
    try {
      const response = await originalFetch(...args);

      if (response.ok) {
        // toast
        // showSnackbar("Request succeeded!", "success");
      } else {
        const error = await response.json();
        toast.error("Xəta baş verdi!");
        // showSnackbar(`Error: ${error.message || "Request failed"}`, "error");
      }

      return response;
    } catch (error) {
      toast.error("Xəta baş verdi!");
      throw error;
    }
  };
}
