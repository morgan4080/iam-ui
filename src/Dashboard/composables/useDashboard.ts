import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import axios from "@/utils/axiosGlobal";
import { Pageables } from "@/types";
import { useQueryParams } from "@/composables/useQueryParams";

export type Activity = {
  id: string;
  userKeycloakId: string;
  created: string;
  createdBy: string;
  description: string;
  activityType: string;
};

export const useDashboard = defineStore("dashboard", () => {
  const pageables = reactive({
    recordsPerPage: 5,
    totalRecords: 0,
    totalPages: 0,
    currentPage: 0,
    sort: "ASC",
    order: "ASC",
    searchTerm: null,
    startDate: null,
    endDate: null,
  }) as Pageables;
  const { params, generateParams } = useQueryParams(pageables);
  const activityList = ref<Activity[]>([]);
  const labels = ref([]);
  const activityTypes = ref([]);
  const loading = ref(false);
  const headers = ref([
    {
      title: "User",
      key: "createdBy",
      align: "start",
      sortable: false,
      visible: true,
    },
    {
      title: "Activity",
      key: "activityType",
      align: "start",
      sortable: false,
      visible: true,
    },
    {
      title: "Description",
      key: "description",
      align: "start",
      sortable: false,
      visible: true,
    },
    {
      title: "Date & Time",
      key: "created",
      align: "start",
      sortable: false,
      visible: true,
    },
  ]);
  const selectedLabel = ref(null);
  const selectedActivityType = ref(null);
  const changeVisibility = (key: string) => {
    headers.value.forEach(header => {
      if (header.key === key) {
        header.visible = !header.visible;
        header.align = header.align === " d-none" ? " start" : " d-none";
      }
    });
  };
  const setLabel = (group: typeof selectedLabel.value) => {
    selectedLabel.value = group;
  };
  const setActivityType = (activity: typeof selectedActivityType.value) => {
    selectedActivityType.value = activity;
  };
  const fetchActivityList = async () => {
    loading.value = true;
    await generateParams();
    const response = await axios.get(
      `/users-admin/api/v1/activity?${params.value}`
    );
    activityList.value = response.data.records;
    pageables.totalRecords = response.data.totalRecords;
    pageables.totalPages = response.data.totalPages;
    pageables.currentPage = response.data.currentPage;
    loading.value = false;
  };
  return {
    activityList,
    fetchActivityList,
    pageables,
    labels,
    activityTypes,
    selectedLabel,
    selectedActivityType,
    headers,
    changeVisibility,
    setGroup: setLabel,
    setActivityType,
    loading,
  };
});
