import { useEffect } from "react";

export default function usePersistData() {
  useEffect(() => {
    window.addEventListener("beforeunload", persistData);

    return () => {
      window.removeEventListener("beforeunload", persistData);
    };
  }, []);

  const persistData = function () {
    console.log("persist data works");
  };
}
