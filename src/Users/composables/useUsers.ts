import { computed, reactive, ref } from "vue";
import { EnableUserPayload, User } from "@/Users/types";
import { Pageables } from "@/types";
import { useQueryParams } from "@/composables/useQueryParams";
import { useFetch } from "@vueuse/core";
import { useAuthStore } from "@/store/auth-store";
import axios from "axios";
import { defineStore } from "pinia";

export const useUsers = defineStore("users", () => {
  const authStore = useAuthStore();
  const user = ref<User | null>(null);
  const users = ref<User[] | null>(null);
  const isLoading = ref(false);
  const error = ref<null | unknown>(null);
  const labels = ref<{ name: string; value: string }[]>([]);
  const pageables = reactive({
    recordsPerPage: 5,
    totalRecords: 0,
    totalPages: 0,
    currentPage: 0,
    sort: "firstName",
    order: "ASC",
    searchTerm: undefined,
    startDate: null,
    endDate: null,
    group: undefined,
    appId: undefined,
    isEnabled: undefined,
    accessType: undefined,
    keycloakRoleId: undefined,
  }) as Pageables & {
    group: string | undefined;
    appId: string | undefined;
    isEnabled: boolean | undefined;
    accessType: string | undefined;
    keycloakRoleId: string | undefined;
  };

  const { params, generateParams } = useQueryParams(pageables);

  const headers = ref([
    {
      title: "User",
      key: "user",
      align: "start",
      sortable: false,
      visible: true,
    },
    {
      title: "Username/USSD",
      key: "username",
      align: "start",
      sortable: false,
      visible: true,
    },
    {
      title: "Access",
      key: "access",
      align: "start",
      sortable: false,
      visible: true,
    },
    {
      title: "Label",
      key: "userLabel",
      align: "start",
      sortable: false,
      visible: true,
    },
    {
      title: "Status",
      key: "status",
      align: "start",
      sortable: false,
      visible: true,
    },
    {
      title: "Actions",
      key: "actions",
      align: "start",
      sortable: false,
      visible: true,
    },
  ]);

  const accessTypes = ref([
    {
      name: "Web",
      value: "WEB",
    },
    {
      name: "Mobile",
      value: "USSD",
    },
  ]);

  const statusTypes = ref([
    {
      name: "Enabled",
      value: true,
    },
    {
      name: "Disabled",
      value: false,
    },
  ]);

  const selectedLabel = ref<{ name: string; value: string } | undefined>(
    undefined
  );
  const selectedStatus = ref<{ name: string; value: boolean } | undefined>(
    undefined
  );
  const selectedAccessType = ref<{ name: string; value: string } | undefined>(
    undefined
  );

  const setLabel = (group: typeof selectedLabel.value) => {
    selectedLabel.value = group;
    pageables.group = group?.value;
  };

  const setAccessType = (access: typeof selectedAccessType.value) => {
    selectedAccessType.value = access;
    pageables.accessType = access?.value;
  };

  const setSelectedStatus = (status: typeof selectedStatus.value) => {
    selectedStatus.value = status;
    pageables.isEnabled = status?.value;
  };

  async function fetchUser(userRefId: string) {
    isLoading.value = true;
    error.value = null;
    return await fetch(
      `${
        import.meta.env.VITE_APP_ROOT_AUTH
      }/users-admin/api/users/${userRefId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async response => {
        if (response.ok) {
          return await response.json();
        }
        const txt = await response.text();
        authStore.addAlerts("error", txt);
      })
      .then(async data => {
        user.value = {
          ...data.user,
          accessTypes: data.accessTypes,
          requiredActions: data.requiredActions,
        };
        return {
          ...data.user,
          accessTypes: data.accessTypes,
          requiredActions: data.requiredActions,
        };
      })
      .catch(async err => {
        authStore.addAlerts("error", err);
      })
      .finally(() => (isLoading.value = false));
  }

  async function fetchUsers() {
    isLoading.value = true;
    error.value = null;
    await generateParams();
    return await fetch(
      `${import.meta.env.VITE_APP_ROOT_AUTH}/users-admin/api/v1/users/list?${
        params.value
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async response => {
        if (!response.ok) {
          const txt = await response.text();
          authStore.addAlerts("error", txt);
          return;
        }
        const data = await response.json();
        users.value = data.records;
        pageables.totalRecords = data.totalRecords;
        pageables.totalPages = data.totalPages;
        pageables.currentPage = data.currentPage;
        return;
      })
      .catch(async err => {
        authStore.addAlerts("error", err);
      })
      .finally(() => (isLoading.value = false));
  }

  async function syncUser(userRefId: string) {
    isLoading.value = true;
    error.value = null;
    return await fetch(
      `${
        import.meta.env.VITE_APP_ROOT_AUTH
      }/users-admin/api/v1/roles/users/${userRefId}/sync`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async response => {
        if (response.ok) {
          authStore.addAlerts("success", "User Sync Successful");
          return await response.json();
        }
        const txt = await response.text();
        authStore.addAlerts("error", txt);
      })
      .catch(async err => {
        authStore.addAlerts("error", err);
      })
      .finally(() => (isLoading.value = false));
  }

  async function syncUsers() {
    isLoading.value = true;
    error.value = null;

    const payload = {
      syncAllUsers: true,
    };

    if (
      confirm(
        "You are about to synchronize users. This operation might take a while. Proceed?"
      )
    ) {
      return await fetch(
        `${
          import.meta.env.VITE_APP_ROOT_AUTH
        }/users-admin/api/users/sync-users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      )
        .then(async response => {
          if (!response.ok) {
            const txt = await response.text();
            authStore.addAlerts("error", txt);
            return;
          }
          authStore.addAlerts("success", `Users synced successfully`);
          pageables.currentPage = 0;
          await fetchUsers();
          return;
        })
        .catch(err => {
          error.value = err;
          throw new Error(err);
        })
        .finally(() => (isLoading.value = false));
    } else {
      pageables.currentPage = 0;
      return fetchUsers().finally(() => (isLoading.value = false));
    }
  }

  async function enableOrDisableUser(payload: EnableUserPayload) {
    isLoading.value = true;
    error.value = null;
    return await fetch(
      `${import.meta.env.VITE_APP_ROOT_AUTH}/users-admin/api/v1/users`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
  }

  const editUser = async (payload: any) => {
    try {
      isLoading.value = true;

      const response = await axios.put(`/users-admin/api/v1/users`, {
        ...payload,
      });

      if (response.statusText == "OK" && response.status == 200) {
        if (response?.data?.messages[0]?.message) {
          authStore.addAlerts("success", response?.data?.messages[0]?.message);
        } else {
          authStore.addAlerts("success", "User Edited Successfully");
        }

        return response.data;
      } else {
        authStore.addAlerts(
          "error",
          response.status + ": " + "User Creation Failed"
        );
        return response.data;
      }
    } catch (e: any) {
      authStore.addAlerts("error", JSON.stringify(e));
    } finally {
      isLoading.value = false;
    }
  };

  async function deleteUser(user: User) {
    if (
      !confirm(
        `Are you sure you want to delete ${user.firstName} ${user.lastName}`
      )
    )
      return;

    isLoading.value = true;
    error.value = null;

    await fetch(
      `${
        import.meta.env.VITE_APP_ROOT_AUTH
      }/users-admin/api/v1/users?keycloakId=${user.keycloakId}&force=false`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async response => {
        if (response.ok) {
          authStore.addAlerts("error", "User deleted successfully");
          await fetchUsers();
        } else {
          const data = await response.text();
          authStore.addAlerts("error", data);
        }
      })
      .catch(error => {
        error.value = error;
        throw new Error(error);
      })
      .finally(() => {
        isLoading.value = false;
      });
  }

  async function resetWebPassword(payload: {
    username: string;
    userRefId: string;
    tenantId: string;
  }) {
    const url = `${
      import.meta.env.VITE_APP_ROOT_AUTH
    }/users-admin/api/users/reset-password`;
    const { isFetching, error, data } = await useFetch(url)
      .post(payload)
      .json();
    isFetching.value = isLoading.value;
    if (data.value) {
      return data.value;
    }
    if (error.value) {
      authStore.addAlerts("error", error.value);
    }
  }

  async function verifyUnique(params: string) {
    isLoading.value = true;
    error.value = null;
    return await fetch(
      `${
        import.meta.env.VITE_APP_ROOT_AUTH
      }/users-admin/api/v1/users/by-identifier/${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async response => {
        if (!response.ok) return "not-unique";
        if (response.status === 204) return "unique";
      })
      .catch(async err => {
        authStore.addAlerts("error", err);
      })
      .finally(() => (isLoading.value = false));
  }

  const createUser = async (payload: any): Promise<any> => {
    try {
      isLoading.value = true;

      const response = await axios.post(`/users-admin/api/v1/users`, {
        ...payload,
      });

      if (response.statusText == "OK" && response.status == 200) {
        authStore.addAlerts("success", "User Created Successfully");
        return response.data;
      } else {
        authStore.addAlerts(
          "error",
          response.status + ": " + "User Creation Failed"
        );
        return response.data;
      }
    } catch (e: any) {
      authStore.addAlerts("error", JSON.stringify(e));
    } finally {
      isLoading.value = false;
    }
  };

  async function canEditUsername() {
    try {
      isLoading.value = true;
      const response = await axios.get(
        `/users-admin/api/v1/realm-settings/edit-username`
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    } finally {
      isLoading.value = false;
    }
  }

  const clearPageables = () => {
    selectedLabel.value = undefined;
    selectedStatus.value = undefined;
    selectedAccessType.value = undefined;

    pageables.recordsPerPage = 5;
    pageables.totalRecords = 0;
    pageables.totalPages = 0;
    pageables.currentPage = 0;
    pageables.sort = "firstName";
    pageables.order = "ASC";
    pageables.searchTerm = undefined;
    pageables.startDate = null;
    pageables.endDate = null;
    pageables.group = undefined;
    pageables.appId = undefined;
    pageables.isEnabled = undefined;
    pageables.accessType = undefined;
    pageables.keycloakRoleId = undefined;
  };

  const changeVisibility = (key: string) => {
    headers.value.forEach(header => {
      if (header.key === key) {
        header.visible = !header.visible;
        header.align = header.align === " d-none" ? " start" : " d-none";
      }
    });
  };

  const getLabels = async () => {
    try {
      isLoading.value = true;
      const response = await axios.get(`/users-admin/api/v1/users/labels`);
      const l: { name: string; value: string }[] = [];
      for (const [key, value] of Object.entries(response.data)) {
        l.push({
          name: `${value}`,
          value: `${key}`,
        });
      }
      labels.value = l;
    } catch (e: any) {
      authStore.addAlerts("error", e.message);
    } finally {
      isLoading.value = false;
    }
  };

  const updateWebUsername = async (userRefId: string, username: string) => {
    try {
      isLoading.value = true;
      const response = await axios.put(
        `/users-admin/api/v1/users/${userRefId}?userName=${username}`
      );
      return response.data;
    } catch (e: any) {
      authStore.addAlerts("warning", e.message);
      return Promise.resolve("Exists");
    } finally {
      isLoading.value = false;
    }
  };

  const countries = ref([
    {
      name: "Afghanistan",
      code: "93",
      alpha2Code: "AF",
      numericCode: "004",
    },
    {
      name: "Åland Islands",
      code: "358",
      alpha2Code: "AX",
      numericCode: "248",
    },
    {
      name: "Albania",
      code: "355",
      alpha2Code: "AL",
      numericCode: "008",
    },
    {
      name: "Algeria",
      code: "213",
      alpha2Code: "DZ",
      numericCode: "012",
    },
    {
      name: "American Samoa",
      code: "1684",
      alpha2Code: "AS",
      numericCode: "016",
    },
    {
      name: "Andorra",
      code: "376",
      alpha2Code: "AD",
      numericCode: "020",
    },
    {
      name: "Angola",
      code: "244",
      alpha2Code: "AO",
      numericCode: "024",
    },
    {
      name: "Anguilla",
      code: "1264",
      alpha2Code: "AI",
      numericCode: "660",
    },
    {
      name: "Antarctica",
      code: "672",
      alpha2Code: "AQ",
      numericCode: "010",
    },
    {
      name: "Antigua and Barbuda",
      code: "1268",
      alpha2Code: "AG",
      numericCode: "028",
    },
    {
      name: "Argentina",
      code: "54",
      alpha2Code: "AR",
      numericCode: "032",
    },
    {
      name: "Armenia",
      code: "374",
      alpha2Code: "AM",
      numericCode: "051",
    },
    {
      name: "Aruba",
      code: "297",
      alpha2Code: "AW",
      numericCode: "533",
    },
    {
      name: "Australia",
      code: "61",
      alpha2Code: "AU",
      numericCode: "036",
    },
    {
      name: "Austria",
      code: "43",
      alpha2Code: "AT",
      numericCode: "040",
    },
    {
      name: "Azerbaijan",
      code: "994",
      alpha2Code: "AZ",
      numericCode: "031",
    },
    {
      name: "Bahamas",
      code: "1242",
      alpha2Code: "BS",
      numericCode: "044",
    },
    {
      name: "Bahrain",
      code: "973",
      alpha2Code: "BH",
      numericCode: "048",
    },
    {
      name: "Bangladesh",
      code: "880",
      alpha2Code: "BD",
      numericCode: "050",
    },
    {
      name: "Barbados",
      code: "1246",
      alpha2Code: "BB",
      numericCode: "052",
    },
    {
      name: "Belarus",
      code: "375",
      alpha2Code: "BY",
      numericCode: "112",
    },
    {
      name: "Belgium",
      code: "32",
      alpha2Code: "BE",
      numericCode: "056",
    },
    {
      name: "Belize",
      code: "501",
      alpha2Code: "BZ",
      numericCode: "084",
    },
    {
      name: "Benin",
      code: "229",
      alpha2Code: "BJ",
      numericCode: "204",
    },
    {
      name: "Bermuda",
      code: "1441",
      alpha2Code: "BM",
      numericCode: "060",
    },
    {
      name: "Bhutan",
      code: "975",
      alpha2Code: "BT",
      numericCode: "064",
    },
    {
      name: "Bolivia (Plurinational State of)",
      code: "591",
      alpha2Code: "BO",
      numericCode: "068",
    },
    {
      name: "Bonaire, Sint Eustatius and Saba",
      code: "5997",
      alpha2Code: "BQ",
      numericCode: "535",
    },
    {
      name: "Bosnia and Herzegovina",
      code: "387",
      alpha2Code: "BA",
      numericCode: "070",
    },
    {
      name: "Botswana",
      code: "267",
      alpha2Code: "BW",
      numericCode: "072",
    },
    {
      name: "Brazil",
      code: "55",
      alpha2Code: "BR",
      numericCode: "076",
    },
    {
      name: "British Indian Ocean Territory",
      code: "246",
      alpha2Code: "IO",
      numericCode: "086",
    },
    {
      name: "Virgin Islands (British)",
      code: "1284",
      alpha2Code: "VG",
      numericCode: "092",
    },
    {
      name: "Virgin Islands (U.S.)",
      code: "1 340",
      alpha2Code: "VI",
      numericCode: "850",
    },
    {
      name: "Brunei Darussalam",
      code: "673",
      alpha2Code: "BN",
      numericCode: "096",
    },
    {
      name: "Bulgaria",
      code: "359",
      alpha2Code: "BG",
      numericCode: "100",
    },
    {
      name: "Burkina Faso",
      code: "226",
      alpha2Code: "BF",
      numericCode: "854",
    },
    {
      name: "Burundi",
      code: "257",
      alpha2Code: "BI",
      numericCode: "108",
    },
    {
      name: "Cambodia",
      code: "855",
      alpha2Code: "KH",
      numericCode: "116",
    },
    {
      name: "Cameroon",
      code: "237",
      alpha2Code: "CM",
      numericCode: "120",
    },
    {
      name: "Canada",
      code: "1",
      alpha2Code: "CA",
      numericCode: "124",
    },
    {
      name: "Cabo Verde",
      code: "238",
      alpha2Code: "CV",
      numericCode: "132",
    },
    {
      name: "Cayman Islands",
      code: "1345",
      alpha2Code: "KY",
      numericCode: "136",
    },
    {
      name: "Central African Republic",
      code: "236",
      alpha2Code: "CF",
      numericCode: "140",
    },
    {
      name: "Chad",
      code: "235",
      alpha2Code: "TD",
      numericCode: "148",
    },
    {
      name: "Chile",
      code: "56",
      alpha2Code: "CL",
      numericCode: "152",
    },
    {
      name: "China",
      code: "86",
      alpha2Code: "CN",
      numericCode: "156",
    },
    {
      name: "Christmas Island",
      code: "61",
      alpha2Code: "CX",
      numericCode: "162",
    },
    {
      name: "Cocos (Keeling) Islands",
      code: "61",
      alpha2Code: "CC",
      numericCode: "166",
    },
    {
      name: "Colombia",
      code: "57",
      alpha2Code: "CO",
      numericCode: "170",
    },
    {
      name: "Comoros",
      code: "269",
      alpha2Code: "KM",
      numericCode: "174",
    },
    {
      name: "Congo",
      code: "242",
      alpha2Code: "CG",
      numericCode: "178",
    },
    {
      name: "Congo (Democratic Republic of the)",
      code: "243",
      alpha2Code: "CD",
      numericCode: "180",
    },
    {
      name: "Cook Islands",
      code: "682",
      alpha2Code: "CK",
      numericCode: "184",
    },
    {
      name: "Costa Rica",
      code: "506",
      alpha2Code: "CR",
      numericCode: "188",
    },
    {
      name: "Croatia",
      code: "385",
      alpha2Code: "HR",
      numericCode: "191",
    },
    {
      name: "Cuba",
      code: "53",
      alpha2Code: "CU",
      numericCode: "192",
    },
    {
      name: "Curaçao",
      code: "599",
      alpha2Code: "CW",
      numericCode: "531",
    },
    {
      name: "Cyprus",
      code: "357",
      alpha2Code: "CY",
      numericCode: "196",
    },
    {
      name: "Czech Republic",
      code: "420",
      alpha2Code: "CZ",
      numericCode: "203",
    },
    {
      name: "Denmark",
      code: "45",
      alpha2Code: "DK",
      numericCode: "208",
    },
    {
      name: "Djibouti",
      code: "253",
      alpha2Code: "DJ",
      numericCode: "262",
    },
    {
      name: "Dominica",
      code: "1767",
      alpha2Code: "DM",
      numericCode: "212",
    },
    {
      name: "Dominican Republic",
      code: "1809",
      alpha2Code: "DO",
      numericCode: "214",
    },
    {
      name: "Ecuador",
      code: "593",
      alpha2Code: "EC",
      numericCode: "218",
    },
    {
      name: "Egypt",
      code: "20",
      alpha2Code: "EG",
      numericCode: "818",
    },
    {
      name: "El Salvador",
      code: "503",
      alpha2Code: "SV",
      numericCode: "222",
    },
    {
      name: "Equatorial Guinea",
      code: "240",
      alpha2Code: "GQ",
      numericCode: "226",
    },
    {
      name: "Eritrea",
      code: "291",
      alpha2Code: "ER",
      numericCode: "232",
    },
    {
      name: "Estonia",
      code: "372",
      alpha2Code: "EE",
      numericCode: "233",
    },
    {
      name: "Ethiopia",
      code: "251",
      alpha2Code: "ET",
      numericCode: "231",
    },
    {
      name: "Falkland Islands (Malvinas)",
      code: "500",
      alpha2Code: "FK",
      numericCode: "238",
    },
    {
      name: "Faroe Islands",
      code: "298",
      alpha2Code: "FO",
      numericCode: "234",
    },
    {
      name: "Fiji",
      code: "679",
      alpha2Code: "FJ",
      numericCode: "242",
    },
    {
      name: "Finland",
      code: "358",
      alpha2Code: "FI",
      numericCode: "246",
    },
    {
      name: "France",
      code: "33",
      alpha2Code: "FR",
      numericCode: "250",
    },
    {
      name: "French Guiana",
      code: "594",
      alpha2Code: "GF",
      numericCode: "254",
    },
    {
      name: "French Polynesia",
      code: "689",
      alpha2Code: "PF",
      numericCode: "258",
    },
    {
      name: "Gabon",
      code: "241",
      alpha2Code: "GA",
      numericCode: "266",
    },
    {
      name: "Gambia",
      code: "220",
      alpha2Code: "GM",
      numericCode: "270",
    },
    {
      name: "Georgia",
      code: "995",
      alpha2Code: "GE",
      numericCode: "268",
    },
    {
      name: "Germany",
      code: "49",
      alpha2Code: "DE",
      numericCode: "276",
    },
    {
      name: "Ghana",
      code: "233",
      alpha2Code: "GH",
      numericCode: "288",
    },
    {
      name: "Gibraltar",
      code: "350",
      alpha2Code: "GI",
      numericCode: "292",
    },
    {
      name: "Greece",
      code: "30",
      alpha2Code: "GR",
      numericCode: "300",
    },
    {
      name: "Greenland",
      code: "299",
      alpha2Code: "GL",
      numericCode: "304",
    },
    {
      name: "Grenada",
      code: "1473",
      alpha2Code: "GD",
      numericCode: "308",
    },
    {
      name: "Guadeloupe",
      code: "590",
      alpha2Code: "GP",
      numericCode: "312",
    },
    {
      name: "Guam",
      code: "1671",
      alpha2Code: "GU",
      numericCode: "316",
    },
    {
      name: "Guatemala",
      code: "502",
      alpha2Code: "GT",
      numericCode: "320",
    },
    {
      name: "Guernsey",
      code: "44",
      alpha2Code: "GG",
      numericCode: "831",
    },
    {
      name: "Guinea",
      code: "224",
      alpha2Code: "GN",
      numericCode: "324",
    },
    {
      name: "Guinea-Bissau",
      code: "245",
      alpha2Code: "GW",
      numericCode: "624",
    },
    {
      name: "Guyana",
      code: "592",
      alpha2Code: "GY",
      numericCode: "328",
    },
    {
      name: "Haiti",
      code: "509",
      alpha2Code: "HT",
      numericCode: "332",
    },
    {
      name: "Holy See",
      code: "379",
      alpha2Code: "VA",
      numericCode: "336",
    },
    {
      name: "Honduras",
      code: "504",
      alpha2Code: "HN",
      numericCode: "340",
    },
    {
      name: "Hong Kong",
      code: "852",
      alpha2Code: "HK",
      numericCode: "344",
    },
    {
      name: "Hungary",
      code: "36",
      alpha2Code: "HU",
      numericCode: "348",
    },
    {
      name: "Iceland",
      code: "354",
      alpha2Code: "IS",
      numericCode: "352",
    },
    {
      name: "India",
      code: "91",
      alpha2Code: "IN",
      numericCode: "356",
    },
    {
      name: "Indonesia",
      code: "62",
      alpha2Code: "ID",
      numericCode: "360",
    },
    {
      name: "Côte d'Ivoire",
      code: "225",
      alpha2Code: "CI",
      numericCode: "384",
    },
    {
      name: "Iran (Islamic Republic of)",
      code: "98",
      alpha2Code: "IR",
      numericCode: "364",
    },
    {
      name: "Iraq",
      code: "964",
      alpha2Code: "IQ",
      numericCode: "368",
    },
    {
      name: "Ireland",
      code: "353",
      alpha2Code: "IE",
      numericCode: "372",
    },
    {
      name: "Isle of Man",
      code: "44",
      alpha2Code: "IM",
      numericCode: "833",
    },
    {
      name: "Israel",
      code: "972",
      alpha2Code: "IL",
      numericCode: "376",
    },
    {
      name: "Italy",
      code: "39",
      alpha2Code: "IT",
      numericCode: "380",
    },
    {
      name: "Jamaica",
      code: "1876",
      alpha2Code: "JM",
      numericCode: "388",
    },
    {
      name: "Japan",
      code: "81",
      alpha2Code: "JP",
      numericCode: "392",
    },
    {
      name: "Jersey",
      code: "44",
      alpha2Code: "JE",
      numericCode: "832",
    },
    {
      name: "Jordan",
      code: "962",
      alpha2Code: "JO",
      numericCode: "400",
    },
    {
      name: "Kazakhstan",
      code: "76",
      alpha2Code: "KZ",
      numericCode: "398",
    },
    {
      name: "Kenya",
      code: "254",
      alpha2Code: "KE",
      numericCode: "404",
    },
    {
      name: "Kiribati",
      code: "686",
      alpha2Code: "KI",
      numericCode: "296",
    },
    {
      name: "Kuwait",
      code: "965",
      alpha2Code: "KW",
      numericCode: "414",
    },
    {
      name: "Kyrgyzstan",
      code: "996",
      alpha2Code: "KG",
      numericCode: "417",
    },
    {
      name: "Lao People's Democratic Republic",
      code: "856",
      alpha2Code: "LA",
      numericCode: "418",
    },
    {
      name: "Latvia",
      code: "371",
      alpha2Code: "LV",
      numericCode: "428",
    },
    {
      name: "Lebanon",
      code: "961",
      alpha2Code: "LB",
      numericCode: "422",
    },
    {
      name: "Lesotho",
      code: "266",
      alpha2Code: "LS",
      numericCode: "426",
    },
    {
      name: "Liberia",
      code: "231",
      alpha2Code: "LR",
      numericCode: "430",
    },
    {
      name: "Libya",
      code: "218",
      alpha2Code: "LY",
      numericCode: "434",
    },
    {
      name: "Liechtenstein",
      code: "423",
      alpha2Code: "LI",
      numericCode: "438",
    },
    {
      name: "Lithuania",
      code: "370",
      alpha2Code: "LT",
      numericCode: "440",
    },
    {
      name: "Luxembourg",
      code: "352",
      alpha2Code: "LU",
      numericCode: "442",
    },
    {
      name: "Macao",
      code: "853",
      alpha2Code: "MO",
      numericCode: "446",
    },
    {
      name: "Macedonia (the former Yugoslav Republic of)",
      code: "389",
      alpha2Code: "MK",
      numericCode: "807",
    },
    {
      name: "Madagascar",
      code: "261",
      alpha2Code: "MG",
      numericCode: "450",
    },
    {
      name: "Malawi",
      code: "265",
      alpha2Code: "MW",
      numericCode: "454",
    },
    {
      name: "Malaysia",
      code: "60",
      alpha2Code: "MY",
      numericCode: "458",
    },
    {
      name: "Maldives",
      code: "960",
      alpha2Code: "MV",
      numericCode: "462",
    },
    {
      name: "Mali",
      code: "223",
      alpha2Code: "ML",
      numericCode: "466",
    },
    {
      name: "Malta",
      code: "356",
      alpha2Code: "MT",
      numericCode: "470",
    },
    {
      name: "Marshall Islands",
      code: "692",
      alpha2Code: "MH",
      numericCode: "584",
    },
    {
      name: "Martinique",
      code: "596",
      alpha2Code: "MQ",
      numericCode: "474",
    },
    {
      name: "Mauritania",
      code: "222",
      alpha2Code: "MR",
      numericCode: "478",
    },
    {
      name: "Mauritius",
      code: "230",
      alpha2Code: "MU",
      numericCode: "480",
    },
    {
      name: "Mayotte",
      code: "262",
      alpha2Code: "YT",
      numericCode: "175",
    },
    {
      name: "Mexico",
      code: "52",
      alpha2Code: "MX",
      numericCode: "484",
    },
    {
      name: "Micronesia (Federated States of)",
      code: "691",
      alpha2Code: "FM",
      numericCode: "583",
    },
    {
      name: "Moldova (Republic of)",
      code: "373",
      alpha2Code: "MD",
      numericCode: "498",
    },
    {
      name: "Monaco",
      code: "377",
      alpha2Code: "MC",
      numericCode: "492",
    },
    {
      name: "Mongolia",
      code: "976",
      alpha2Code: "MN",
      numericCode: "496",
    },
    {
      name: "Montenegro",
      code: "382",
      alpha2Code: "ME",
      numericCode: "499",
    },
    {
      name: "Montserrat",
      code: "1664",
      alpha2Code: "MS",
      numericCode: "500",
    },
    {
      name: "Morocco",
      code: "212",
      alpha2Code: "MA",
      numericCode: "504",
    },
    {
      name: "Mozambique",
      code: "258",
      alpha2Code: "MZ",
      numericCode: "508",
    },
    {
      name: "Myanmar",
      code: "95",
      alpha2Code: "MM",
      numericCode: "104",
    },
    {
      name: "Namibia",
      code: "264",
      alpha2Code: "NA",
      numericCode: "516",
    },
    {
      name: "Nauru",
      code: "674",
      alpha2Code: "NR",
      numericCode: "520",
    },
    {
      name: "Nepal",
      code: "977",
      alpha2Code: "NP",
      numericCode: "524",
    },
    {
      name: "Netherlands",
      code: "31",
      alpha2Code: "NL",
      numericCode: "528",
    },
    {
      name: "New Caledonia",
      code: "687",
      alpha2Code: "NC",
      numericCode: "540",
    },
    {
      name: "New Zealand",
      code: "64",
      alpha2Code: "NZ",
      numericCode: "554",
    },
    {
      name: "Nicaragua",
      code: "505",
      alpha2Code: "NI",
      numericCode: "558",
    },
    {
      name: "Niger",
      code: "227",
      alpha2Code: "NE",
      numericCode: "562",
    },
    {
      name: "Nigeria",
      code: "234",
      alpha2Code: "NG",
      numericCode: "566",
    },
    {
      name: "Niue",
      code: "683",
      alpha2Code: "NU",
      numericCode: "570",
    },
    {
      name: "Norfolk Island",
      code: "672",
      alpha2Code: "NF",
      numericCode: "574",
    },
    {
      name: "Korea (Democratic People's Republic of)",
      code: "850",
      alpha2Code: "KP",
      numericCode: "408",
    },
    {
      name: "Northern Mariana Islands",
      code: "1670",
      alpha2Code: "MP",
      numericCode: "580",
    },
    {
      name: "Norway",
      code: "47",
      alpha2Code: "NO",
      numericCode: "578",
    },
    {
      name: "Oman",
      code: "968",
      alpha2Code: "OM",
      numericCode: "512",
    },
    {
      name: "Pakistan",
      code: "92",
      alpha2Code: "PK",
      numericCode: "586",
    },
    {
      name: "Palau",
      code: "680",
      alpha2Code: "PW",
      numericCode: "585",
    },
    {
      name: "Palestine, State of",
      code: "970",
      alpha2Code: "PS",
      numericCode: "275",
    },
    {
      name: "Panama",
      code: "507",
      alpha2Code: "PA",
      numericCode: "591",
    },
    {
      name: "Papua New Guinea",
      code: "675",
      alpha2Code: "PG",
      numericCode: "598",
    },
    {
      name: "Paraguay",
      code: "595",
      alpha2Code: "PY",
      numericCode: "600",
    },
    {
      name: "Peru",
      code: "51",
      alpha2Code: "PE",
      numericCode: "604",
    },
    {
      name: "Philippines",
      code: "63",
      alpha2Code: "PH",
      numericCode: "608",
    },
    {
      name: "Pitcairn",
      code: "64",
      alpha2Code: "PN",
      numericCode: "612",
    },
    {
      name: "Poland",
      code: "48",
      alpha2Code: "PL",
      numericCode: "616",
    },
    {
      name: "Portugal",
      code: "351",
      alpha2Code: "PT",
      numericCode: "620",
    },
    {
      name: "Puerto Rico",
      code: "1787",
      alpha2Code: "PR",
      numericCode: "630",
    },
    {
      name: "Qatar",
      code: "974",
      alpha2Code: "QA",
      numericCode: "634",
    },
    {
      name: "Réunion",
      code: "262",
      alpha2Code: "RE",
      numericCode: "638",
    },
    {
      name: "Romania",
      code: "40",
      alpha2Code: "RO",
      numericCode: "642",
    },
    {
      name: "Russian Federation",
      code: "7",
      alpha2Code: "RU",
      numericCode: "643",
    },
    {
      name: "Rwanda",
      code: "250",
      alpha2Code: "RW",
      numericCode: "646",
    },
    {
      name: "Saint Barthélemy",
      code: "590",
      alpha2Code: "BL",
      numericCode: "652",
    },
    {
      name: "Saint Helena, Ascension and Tristan da Cunha",
      code: "290",
      alpha2Code: "SH",
      numericCode: "654",
    },
    {
      name: "Saint Kitts and Nevis",
      code: "1869",
      alpha2Code: "KN",
      numericCode: "659",
    },
    {
      name: "Saint Lucia",
      code: "1758",
      alpha2Code: "LC",
      numericCode: "662",
    },
    {
      name: "Saint Martin (French part)",
      code: "590",
      alpha2Code: "MF",
      numericCode: "663",
    },
    {
      name: "Saint Pierre and Miquelon",
      code: "508",
      alpha2Code: "PM",
      numericCode: "666",
    },
    {
      name: "Saint Vincent and the Grenadines",
      code: "1784",
      alpha2Code: "VC",
      numericCode: "670",
    },
    {
      name: "Samoa",
      code: "685",
      alpha2Code: "WS",
      numericCode: "882",
    },
    {
      name: "San Marino",
      code: "378",
      alpha2Code: "SM",
      numericCode: "674",
    },
    {
      name: "Sao Tome and Principe",
      code: "239",
      alpha2Code: "ST",
      numericCode: "678",
    },
    {
      name: "Saudi Arabia",
      code: "966",
      alpha2Code: "SA",
      numericCode: "682",
    },
    {
      name: "Senegal",
      code: "221",
      alpha2Code: "SN",
      numericCode: "686",
    },
    {
      name: "Serbia",
      code: "381",
      alpha2Code: "RS",
      numericCode: "688",
    },
    {
      name: "Seychelles",
      code: "248",
      alpha2Code: "SC",
      numericCode: "690",
    },
    {
      name: "Sierra Leone",
      code: "232",
      alpha2Code: "SL",
      numericCode: "694",
    },
    {
      name: "Singapore",
      code: "65",
      alpha2Code: "SG",
      numericCode: "702",
    },
    {
      name: "Sint Maarten (Dutch part)",
      code: "1721",
      alpha2Code: "SX",
      numericCode: "534",
    },
    {
      name: "Slovakia",
      code: "421",
      alpha2Code: "SK",
      numericCode: "703",
    },
    {
      name: "Slovenia",
      code: "386",
      alpha2Code: "SI",
      numericCode: "705",
    },
    {
      name: "Solomon Islands",
      code: "677",
      alpha2Code: "SB",
      numericCode: "090",
    },
    {
      name: "Somalia",
      code: "252",
      alpha2Code: "SO",
      numericCode: "706",
    },
    {
      name: "South Africa",
      code: "27",
      alpha2Code: "ZA",
      numericCode: "710",
    },
    {
      name: "South Georgia and the South Sandwich Islands",
      code: "500",
      alpha2Code: "GS",
      numericCode: "239",
    },
    {
      name: "Korea (Republic of)",
      code: "82",
      alpha2Code: "KR",
      numericCode: "410",
    },
    {
      name: "South Sudan",
      code: "211",
      alpha2Code: "SS",
      numericCode: "728",
    },
    {
      name: "Spain",
      code: "34",
      alpha2Code: "ES",
      numericCode: "724",
    },
    {
      name: "Sri Lanka",
      code: "94",
      alpha2Code: "LK",
      numericCode: "144",
    },
    {
      name: "Sudan",
      code: "249",
      alpha2Code: "SD",
      numericCode: "729",
    },
    {
      name: "Suriname",
      code: "597",
      alpha2Code: "SR",
      numericCode: "740",
    },
    {
      name: "Svalbard and Jan Mayen",
      code: "4779",
      alpha2Code: "SJ",
      numericCode: "744",
    },
    {
      name: "Swaziland",
      code: "268",
      alpha2Code: "SZ",
      numericCode: "748",
    },
    {
      name: "Sweden",
      code: "46",
      alpha2Code: "SE",
      numericCode: "752",
    },
    {
      name: "Switzerland",
      code: "41",
      alpha2Code: "CH",
      numericCode: "756",
    },
    {
      name: "Syrian Arab Republic",
      code: "963",
      alpha2Code: "SY",
      numericCode: "760",
    },
    {
      name: "Taiwan",
      code: "886",
      alpha2Code: "TW",
      numericCode: "158",
    },
    {
      name: "Tajikistan",
      code: "992",
      alpha2Code: "TJ",
      numericCode: "762",
    },
    {
      name: "Tanzania, United Republic of",
      code: "255",
      alpha2Code: "TZ",
      numericCode: "834",
    },
    {
      name: "Thailand",
      code: "66",
      alpha2Code: "TH",
      numericCode: "764",
    },
    {
      name: "Timor-Leste",
      code: "670",
      alpha2Code: "TL",
      numericCode: "626",
    },
    {
      name: "Togo",
      code: "228",
      alpha2Code: "TG",
      numericCode: "768",
    },
    {
      name: "Tokelau",
      code: "690",
      alpha2Code: "TK",
      numericCode: "772",
    },
    {
      name: "Tonga",
      code: "676",
      alpha2Code: "TO",
      numericCode: "776",
    },
    {
      name: "Trinidad and Tobago",
      code: "1868",
      alpha2Code: "TT",
      numericCode: "780",
    },
    {
      name: "Tunisia",
      code: "216",
      alpha2Code: "TN",
      numericCode: "788",
    },
    {
      name: "Turkey",
      code: "90",
      alpha2Code: "TR",
      numericCode: "792",
    },
    {
      name: "Turkmenistan",
      code: "993",
      alpha2Code: "TM",
      numericCode: "795",
    },
    {
      name: "Turks and Caicos Islands",
      code: "1649",
      alpha2Code: "TC",
      numericCode: "796",
    },
    {
      name: "Tuvalu",
      code: "688",
      alpha2Code: "TV",
      numericCode: "798",
    },
    {
      name: "Uganda",
      code: "256",
      alpha2Code: "UG",
      numericCode: "800",
    },
    {
      name: "Ukraine",
      code: "380",
      alpha2Code: "UA",
      numericCode: "804",
    },
    {
      name: "United Arab Emirates",
      code: "971",
      alpha2Code: "AE",
      numericCode: "784",
    },
    {
      name: "United Kingdom of Great Britain and Northern Ireland",
      code: "44",
      alpha2Code: "GB",
      numericCode: "826",
    },
    {
      name: "United States of America",
      code: "1",
      alpha2Code: "US",
      numericCode: "840",
    },
    {
      name: "Uruguay",
      code: "598",
      alpha2Code: "UY",
      numericCode: "858",
    },
    {
      name: "Uzbekistan",
      code: "998",
      alpha2Code: "UZ",
      numericCode: "860",
    },
    {
      name: "Vanuatu",
      code: "678",
      alpha2Code: "VU",
      numericCode: "548",
    },
    {
      name: "Venezuela (Bolivarian Republic of)",
      code: "58",
      alpha2Code: "VE",
      numericCode: "862",
    },
    {
      name: "Viet Nam",
      code: "84",
      alpha2Code: "VN",
      numericCode: "704",
    },
    {
      name: "Wallis and Futuna",
      code: "681",
      alpha2Code: "WF",
      numericCode: "876",
    },
    {
      name: "Western Sahara",
      code: "212",
      alpha2Code: "EH",
      numericCode: "732",
    },
    {
      name: "Yemen",
      code: "967",
      alpha2Code: "YE",
      numericCode: "887",
    },
    {
      name: "Zambia",
      code: "260",
      alpha2Code: "ZM",
      numericCode: "894",
    },
    {
      name: "Zimbabwe",
      code: "263",
      alpha2Code: "ZW",
      numericCode: "716",
    },
  ]);

  const countrySelected = ref<any>("KE");

  return {
    user,
    pageables,
    users,
    isLoading,
    error,
    syncUser,
    syncUsers,
    enableOrDisableUser,
    fetchUser,
    editUser,
    fetchUsers,
    deleteUser,
    verifyUnique,
    resetWebPassword,
    createUser,
    clearPageables,
    headers,
    changeVisibility,
    accessTypes,
    statusTypes,
    labels,
    setLabel,
    setSelectedStatus,
    setAccessType,
    selectedAccessType,
    selectedLabel,
    selectedStatus,
    getLabels,
    countries,
    countrySelected,
    canEditUsername,
    updateWebUsername,
  };
});
