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
    if (pageables.startDate) queryParams.set("startDate", pageables.startDate);
    if (pageables.endDate) queryParams.set("endDate", pageables.endDate);
    queryParams.set("sort", pageables.sort);
    queryParams.set("order", pageables.order);

    params.value = queryParams.toString();
    return queryParams;
  }

  return { params, generateParams };
};
