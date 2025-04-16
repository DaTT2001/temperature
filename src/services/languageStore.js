import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLanguageStore = create(
  persist(
    (set) => ({
      language: "en", // Mặc định là tiếng Anh
      setLanguage: (lang) => set({ language: lang }),
    }),
    { name: "language-storage" } // Lưu vào localStorage
  )
);

export default useLanguageStore;
