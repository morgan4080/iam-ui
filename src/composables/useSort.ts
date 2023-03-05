import { Pageables } from "@/types";

export const useSort = (pageables: Pageables, callback: () => void) => {
  async function sort() {
    pageables.sort =
      pageables.sort === "ASC"
        ? (pageables.sort = "DESC")
        : (pageables.sort = "ASC");
    pageables.currentPage = 0;

    await callback();
  }

  return { sort };
};
