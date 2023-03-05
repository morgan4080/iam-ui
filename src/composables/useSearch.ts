import { Pageables } from "@/types";

export const useSearch = (pageables: Pageables, callback: () => void) => {
  async function search() {
    if (pageables.searchTerm?.length === 0) pageables.searchTerm = null;
    pageables.currentPage = 0;

    await callback();
  }

  return { search };
};
