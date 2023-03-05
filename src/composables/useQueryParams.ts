import { ref } from "vue";
import { Pageables } from "@/types";

export const useQueryParams = (pageables: Pageables) => {
  const params = ref("");

  async function generateParams() {
    const queryParams = new URLSearchParams();
    queryParams.set("pageIndex", pageables.currentPage.toString());
    queryParams.set("pageSize", pageables.recordsPerPage.toString());
    if (pageables.searchTerm)
      queryParams.set("searchTerm", pageables.searchTerm);
    queryParams.set("sort", pageables.sort);
    queryParams.set("order", pageables.sort);

    params.value = queryParams.toString();
    return queryParams;
  }

  return { params, generateParams };
};
