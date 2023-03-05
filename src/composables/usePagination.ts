import { Pageables } from "@/types";

export const usePagination = (pageables: Pageables, callback: () => void) => {
  async function next() {
    if (
      pageables.currentPage <= 1 ||
      pageables.currentPage === pageables.totalPages
    )
      return;
    pageables.currentPage -= 1;
    await callback();
  }

  async function previous() {
    if (
      pageables.currentPage === 1 ||
      pageables.currentPage > pageables.totalPages
    )
      return;
    pageables.currentPage -= 1;
    await callback();
  }

  return {
    next,
    previous,
  };
};
