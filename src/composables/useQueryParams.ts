import { ref } from "vue";
import { Pageables } from "@/types";

export const useQueryParams = (
  pageables: Pageables & {
    group: string | undefined;
    appId: string | undefined;
  }
) => {
  const params = ref("");

  async function generateParams() {
    const queryParams = new URLSearchParams();
    if (pageables.searchTerm)
      queryParams.set("searchTerm", pageables.searchTerm);
    if (pageables.group) queryParams.set("group", pageables.group);
    if (pageables.appId) queryParams.set("appId", pageables.appId);
    if (pageables.startDate) queryParams.set("startDate", pageables.startDate);
    if (pageables.endDate) queryParams.set("endDate", pageables.endDate);
    queryParams.set("order", pageables.order);
    queryParams.set("sort", pageables.sort);
    queryParams.set("pageSize", pageables.recordsPerPage.toString());
    queryParams.set("pageIndex", pageables.currentPage.toString());
    params.value = queryParams.toString();
    return queryParams;
  }

  return { params, generateParams };
};
