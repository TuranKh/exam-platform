import { UserDetails } from "@/service/UserService";
import { create } from "zustand";

export const useUserStore = create((set) => ({
  userDetails: null,
  setUserDetails: (details: UserDetails) => {
    console.log("inside, ", details);
    set(() => ({ userDetails: details }));
  },
}));
