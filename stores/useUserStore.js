/*
import { create } from "zustand";
import { persist } from "zustand/middleware";
const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      setUser: (userData) => set({ user: userData }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user", // localStorage key
    }
  )
);
export default useUserStore;
*/
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      users: null,      

      setUser: (userData) => set({ user: userData }),
      clearUser: () => set({ user: null }),

      can: (key) => {
        const user = get().user;
        if (!key) return false;
        if (user?.role > 1) {
          const permissions = user?.permissions ?? [];
          return permissions.includes(key);
        }
        return true;
      },
    }),
    {
      name: "user", // localStorage key
    }
  )
);

export default useUserStore;
