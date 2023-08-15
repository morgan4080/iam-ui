import { ref } from "vue";

export const useQueryParams = (pageables: any) => {
  const params = ref("");

  async function generateParams() {
    const queryParams = new URLSearchParams();
    if (pageables.searchTerm)
      queryParams.set("searchTerm", pageables.searchTerm);
    if (pageables.group) queryParams.set("group", pageables.group);
    if (pageables.appId) queryParams.set("appId", pageables.appId);
    if (pageables.isEnabled !== undefined)
      queryParams.set("isEnabled", pageables.isEnabled);
    if (pageables.accessType)
      queryParams.set("accessType", pageables.accessType);
    if (pageables.keycloakRoleId)
      queryParams.set("keycloakRoleId", pageables.keycloakRoleId);
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
