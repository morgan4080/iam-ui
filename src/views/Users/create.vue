<script setup lang="ts">
import { ref } from "vue";
import { getPermissions, getRoles } from "@/modules/all";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { isValidNumberForRegion, parsePhoneNumber } from "libphonenumber-js";
import useVuelidate from "@vuelidate/core";
import {
  email,
  helpers,
  maxLength,
  minLength,
  numeric,
  required,
} from "@vuelidate/validators";
import { useUsers } from "@users/composables/useUsers";
const router = useRouter();

const { verifyUnique } = useUsers();

const store = useStore();

const available_roles = ref(
  <
    {
      name: string;
      roleType: string;
      keycloakRoleId: string;
      roleDescription: string;
      id: string;
    }[]
  >[]
);

const available_permissions = ref(<any[]>[]);

interface form1Interface {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  user_types: string[];
}

type PinStates = "SET" | "NOT-SET" | "TEMPORARY";

getRoles()
  .then((response: any) => {
    available_roles.value = response.records;
  })
  .catch((e: any) => {
    alert(e.message);
  });

getPermissions()
  .then((data: any) => {
    available_permissions.value = data.records;
  })
  .catch((e: any) => {
    alert(e.message);
  });

const validPhone = (value: number) => isValidNumberForRegion(`${value}`, "KE");

const formContacts = ref(<form1Interface>{
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  user_types: [],
});

const validationRulesFormContacts = {
  firstName: {
    required,
  },
  lastName: {
    required,
  },
  email: {
    required,
    email,
  },
  phoneNumber: {
    required,
    numeric,
    validPhone: helpers.withMessage(
      "Please provide a valid number",
      validPhone
    ),
  },
};

const vFormContacts$ = useVuelidate(
  validationRulesFormContacts,
  formContacts.value,
  { $lazy: true, $autoDirty: true }
);

const formWebAccess = ref(<
  { username: string; password: string; passwordConfirmation: string }
>{
  username: "",
  password: "",
  passwordConfirmation: "",
});

const validationRulesFormWebAccess = {
  username: {
    required,
  },
  password: {
    required,
  },
  passwordConfirmation: {
    required,
  },
};

const vFormWebAccess$ = useVuelidate(
  validationRulesFormWebAccess,
  formWebAccess.value,
  { $lazy: true, $autoDirty: true }
);

const formUSSDAccess = ref(<
  { phoneNumber: string; pin: string; pinConfirmation: string }
>{
  phoneNumber: "",
  pin: "",
  pinConfirmation: "",
});

const validationRulesFormUSSDAccess = {
  phoneNumber: {
    required,
    numeric,
    validPhone: helpers.withMessage(
      "Please provide a valid number",
      validPhone
    ),
  },
  pin: {
    required,
    min: minLength(4),
    max: maxLength(4),
    numeric,
  },
  pinConfirmation: {
    required,
    min: minLength(4),
    max: maxLength(4),
    numeric,
  },
};

const vFormUSSDAccess$ = useVuelidate(
  validationRulesFormUSSDAccess,
  formUSSDAccess.value,
  { $lazy: true, $autoDirty: true }
);

const formRoles = ref(<{ user_has_roles: any; user_roles: any }>{
  user_has_roles: null,
  user_roles: null,
});

const formPinStatus = ref(<PinStates>"SET");

const currentStep = ref(<number>1);

const errorUserRoles = ref(false);

const arrayFocus: {
  id: number;
  name: string;
  permissions: string;
  description: string;
}[] = [];

function setEventVal(event: any) {
  if (event.target.checked) {
    arrayFocus.push(event.target._value);
  } else {
    if (arrayFocus.length > 0) {
      console.log(arrayFocus.indexOf(event.target._value));
      const index = arrayFocus.indexOf(event.target._value);
      if (index !== -1) {
        delete arrayFocus[index];
      }
    }
  }

  const filtered: any = [];

  for (let i = 0; i < arrayFocus.length; i++) {
    if (arrayFocus[i]) {
      filtered.push(arrayFocus[i]);
    }
  }

  formRoles.value.user_roles = filtered;

  if (filtered.length > 0) {
    errorUserRoles.value = false;
  }
}

const loading = ref(false);

// const responseData = ref(<{ user: { username: string, userType: string, email: string, firstName: string, lastName: string, phoneNumber: string, id: string }, message: string }>{})

const query = ref(<string>`?`);

interface qrInterface {
  phoneNumber: string;
  email: string;
  username: string;
}

const qrObject: qrInterface = {
  phoneNumber: "",
  email: "",
  username: "",
};

function nextStep() {
  currentStep.value = currentStep.value + 1;
}

const saveUser = async (rolesPayload: string[]) => {
  let payloadOut: any;
  if (
    formContacts.value.user_types.findIndex(
      (type: string): boolean => type === "USSD"
    ) !== -1 &&
    formContacts.value.user_types.findIndex(
      (type: string): boolean => type === "WEB"
    ) !== -1
  ) {
    const phoneNumber = parsePhoneNumber(
      `${formContacts.value.phoneNumber}`,
      "KE"
    );
    const phoneNumber1 = parsePhoneNumber(
      `${formUSSDAccess.value.phoneNumber}`,
      "KE"
    );
    const payload: any = {
      firstName: formContacts.value.firstName,
      lastName: formContacts.value.lastName,
      contact: {
        email: formContacts.value.email,
        phone: `${phoneNumber?.countryCallingCode}${phoneNumber?.nationalNumber}`,
      },
      webCredentials: formWebAccess.value,
      ussdCredentials: {
        ...formUSSDAccess.value,
        phoneNumber: `${phoneNumber1?.countryCallingCode}${phoneNumber1?.nationalNumber}`,
      },
      pinStatus: formPinStatus.value,
      activateLogIn: true,
      enabled: true,
      userTypes: formContacts.value.user_types,
      userRoleIds: rolesPayload,
    };

    if (formContacts.value.email === "") {
      delete payload.contact.email;
    }

    if (formContacts.value.phoneNumber === "") {
      delete payload.contact.phone;
    }

    delete payload.webCredentials.passwordConfirmation;

    delete payload.ussdCredentials.pinConfirmation;

    payloadOut = payload;
  } else if (
    formContacts.value.user_types.findIndex(
      (type: string): boolean => type === "USSD"
    ) !== -1 &&
    formContacts.value.user_types.findIndex(
      (type: string): boolean => type === "WEB"
    ) === -1
  ) {
    const phoneNumber = parsePhoneNumber(
      `${formContacts.value.phoneNumber}`,
      "KE"
    );
    const phoneNumber1 = parsePhoneNumber(
      `${formUSSDAccess.value.phoneNumber}`,
      "KE"
    );
    const payload: any = {
      firstName: formContacts.value.firstName,
      lastName: formContacts.value.lastName,
      contact: {
        email: formContacts.value.email,
        phone: `${phoneNumber?.countryCallingCode}${phoneNumber?.nationalNumber}`,
      },
      webCredentials: {
        username: `${formUSSDAccess.value.phoneNumber}`,
        password: formUSSDAccess.value.pin,
      },
      ussdCredentials: {
        ...formUSSDAccess.value,
        phoneNumber: `${phoneNumber1?.countryCallingCode}${phoneNumber1?.nationalNumber}`,
      },
      activateLogIn: false,
      pinStatus: formPinStatus.value,
      enabled: true,
      userTypes: [...new Set(formContacts.value.user_types)],
      userRoleIds: rolesPayload,
    };

    delete payload.ussdCredentials.pinConfirmation;

    if (formContacts.value.email === "") {
      delete payload.contact.email;
    }

    if (formContacts.value.phoneNumber === "") {
      delete payload.contact.phone;
    }

    payloadOut = payload;
  } else if (
    formContacts.value.user_types.findIndex(
      (type: string): boolean => type === "USSD"
    ) === -1 &&
    formContacts.value.user_types.findIndex(
      (type: string): boolean => type === "WEB"
    ) !== -1
  ) {
    const phoneNumber = parsePhoneNumber(
      `${formContacts.value.phoneNumber}`,
      "KE"
    );
    const payload: any = {
      firstName: formContacts.value.firstName,
      lastName: formContacts.value.lastName,
      contact: {
        email: formContacts.value.email,
        phone: `${phoneNumber?.countryCallingCode}${phoneNumber?.nationalNumber}`,
      },
      webCredentials: formWebAccess.value,
      activateLogIn: false,
      enabled: true,
      pinStatus: null,
      userTypes: [...new Set(formContacts.value.user_types)],
      userRoleIds: rolesPayload,
    };
    delete payload.webCredentials.passwordConfirmation;

    if (formContacts.value.email === "") {
      delete payload.contact.email;
    }

    if (formContacts.value.phoneNumber === "") {
      delete payload.contact.phone;
    }

    payloadOut = payload;
  }

  try {
    loading.value = true;
    const response = await store.dispatch("postUser", {
      ...payloadOut,
      notifyUser: formNotificationStatus.value,
    });
    await store.dispatch("defineNotification", {
      message: "User Created Successfully",
      success: true,
    });
    await router.push("/users");
  } catch (e: any) {
    if (e) {
      await store.dispatch("defineNotification", {
        message: JSON.stringify(e),
        error: true,
      });
      return;
    }
    await store.dispatch("defineNotification", {
      message: "Error Creating User",
      error: true,
    });
    await router.push("/users");
  } finally {
    loading.value = false;
  }
};

function setUserType(e: any, payload: string) {
  if (e.target.checked) {
    formContacts.value.user_types.push(payload);
  } else {
    // remove when unchecked
    const index = formContacts.value.user_types.findIndex(
      (type: string): boolean => type === payload
    );
    formContacts.value.user_types.splice(index, 1);
  }
}

function saveRoles() {
  // alert(formRoles.value.user_roles)
  if (formRoles.value.user_roles) {
    saveUser(
      formRoles.value.user_roles.map((role: any): any => role.keycloakRoleId)
    );
  } else {
    store.dispatch("defineNotification", {
      message: `Kindly select at least one role`,
    });
  }
}

function previousStep() {
  if (currentStep.value !== 1) {
    currentStep.value = currentStep.value - 1;
  }
}

const byIdentifier = async () => {
  for (const [key, value] of Object.entries(qrObject)) {
    if (value && query.value === "?") {
      query.value += `${key}=${value}`;
    } else if (value && query.value !== "?") {
      query.value += `&${key}=${value}`;
    }
  }
  console.log(query.value);

  const response = await verifyUnique(query.value);

  query.value = `?`;

  return response === "unique";
};

const setCountryCode = (e: any, context = "contact"): void => {
  if (context === "contact") {
    if (formContacts.value.phoneNumber !== e.target.value) {
      const phoneNumber = parsePhoneNumber(
        `${formContacts.value.phoneNumber}`,
        e.target.value
      );
      formContacts.value.phoneNumber = `${phoneNumber?.countryCallingCode}${phoneNumber?.nationalNumber}`;
    }
  }
  if (context === "ussd") {
    if (formUSSDAccess.value.phoneNumber !== e.target.value) {
      const phoneNumber = parsePhoneNumber(
        `${formUSSDAccess.value.phoneNumber}`,
        e.target.value
      );
      formUSSDAccess.value.phoneNumber = `${phoneNumber?.countryCallingCode}${phoneNumber?.nationalNumber}`;
    }
  }
};

const setQuery = async (e: any) => {
  if (e.target.id === "email") {
    qrObject.phoneNumber = "";
    qrObject.email = formContacts.value.email;
    qrObject.username = "";
  }
  if (e.target.id === "phone-number") {
    const phoneNumber = parsePhoneNumber(
      `${formContacts.value.phoneNumber}`,
      "KE"
    );

    qrObject.phoneNumber = `${phoneNumber?.countryCallingCode}${phoneNumber?.nationalNumber}`;
    qrObject.email = "";
    qrObject.username = "";
  }
  if (e.target.id === "phone-number") {
    if (e.target.value.length > 12) {
      e.target.classList.add("focus:ring-red-400");
      e.target.classList.add("focus:border-red-400");
      e.target.onblur = () => {
        e.target.classList.remove("focus:ring-red-400");
        e.target.classList.remove("focus:border-red-400");
      };
      e.target.value = e.target.value.slice(0, 4);
      await store.dispatch("defineNotification", {
        message: "No more than 12 characters",
        error: true,
      });
    }
    const phoneNumber = parsePhoneNumber(
      `${formContacts.value.phoneNumber}`,
      "KE"
    );
    qrObject.phoneNumber = `${phoneNumber?.countryCallingCode}${phoneNumber?.nationalNumber}`;
    qrObject.email = "";
    qrObject.username = "";
  }
  if (e.target.id === "phonex") {
    if (e.target.value.length > 12) {
      e.target.classList.add("focus:ring-red-400");
      e.target.classList.add("focus:border-red-400");
      e.target.onblur = () => {
        e.target.classList.remove("focus:ring-red-400");
        e.target.classList.remove("focus:border-red-400");
      };
      e.target.value = e.target.value.slice(0, 4);
      await store.dispatch("defineNotification", {
        message: "No more than 12 characters",
        error: true,
      });
    }

    const phoneNumber = parsePhoneNumber(
      `${formUSSDAccess.value.phoneNumber}`,
      "KE"
    );

    const response0 = await verifyUnique(
      `?phoneNumber=${phoneNumber?.countryCallingCode}${phoneNumber?.nationalNumber}`
    );

    if (response0 !== "unique") {
      formUSSDAccess.value.phoneNumber = "";
      await store.dispatch("defineNotification", {
        message: `User with that phone number already exists`,
        error: true,
      });
    }

    return;
  }
  if (e.target.id === "username") {
    qrObject.phoneNumber = "";
    qrObject.email = "";
    qrObject.username = formWebAccess.value.username;
  }

  const response = await byIdentifier();

  if (!response) {
    for (const [key, value] of Object.entries(qrObject)) {
      if (value) {
        if (key === "email") {
          formContacts.value.email = "";
        }
        if (key === "phoneNumber") {
          formContacts.value.phoneNumber = "";
        }
        if (key === "username") {
          formWebAccess.value.username = "";
        }
        await store.dispatch("defineNotification", {
          message: `User with that ${key} already exists`,
          error: true,
        });
      }
    }
  }
};

async function setupFormContacts() {
  const result = await vFormContacts$.value.$validate();
  if (result) {
    if (formContacts.value.user_types.length > 0) {
      if (
        formContacts.value.user_types.findIndex(
          (type: string): boolean => type === "WEB"
        ) !== -1
      ) {
        nextStep();
      } else if (
        formContacts.value.user_types.findIndex(
          (type: string): boolean => type === "USSD"
        ) !== -1
      ) {
        currentStep.value = currentStep.value + 2;
      }
    } else {
      await store.dispatch("defineNotification", {
        message: "Kindly Select a user type",
        error: true,
      });
    }
  }
}

async function setupFormWebAccess() {
  const result = await vFormWebAccess$.value.$validate();
  if (result) {
    if (
      formContacts.value.user_types.findIndex(
        (type: string): boolean => type === "USSD"
      ) !== -1
    ) {
      if (
        formWebAccess.value.password ===
        formWebAccess.value.passwordConfirmation
      ) {
        nextStep();
      } else {
        await store.dispatch("defineNotification", {
          message: `Passwords don't match`,
          error: true,
        });
      }
    } else {
      if (
        formWebAccess.value.password ===
        formWebAccess.value.passwordConfirmation
      ) {
        currentStep.value = 4;
      } else {
        await store.dispatch("defineNotification", {
          message: `Passwords don't match`,
          error: true,
        });
      }
    }
  }
}

async function setupFormUSSDAccess() {
  const result = await vFormUSSDAccess$.value.$validate();
  if (result) {
    if (formUSSDAccess.value.pin === formUSSDAccess.value.pinConfirmation) {
      currentStep.value = 4;
    } else {
      await store.dispatch("defineNotification", {
        message: `Pins don't match`,
        error: true,
      });
    }
  }
}

const setPinStatus = (e: any): void => {
  if (e.target.checked) {
    formPinStatus.value = "TEMPORARY";
  } else {
    formPinStatus.value = "SET";
  }
};

const formNotificationStatus = ref(<boolean>true);

const setNotificationStatus = (e: any): void => {
  formNotificationStatus.value = !!e.target.checked;
};
</script>

<template>
  <div class="w-full">
    <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9 pb-40">
      <div class="shadow sm:overflow-hidden">
        <div class="bg-white py-6 px-4 sm:p-6">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Create User
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Setup account</p>
          </div>
          <!--            step 1-->
          <transition
            enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
            leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
            enter-from-class="transform opacity-0 translate-x-full"
            enter-to-class="transform opacity-100 translate-x-0"
            leave-from-class="transform opacity-100 translate-x-0"
            leave-to-class="transform opacity-0 translate-x-full"
          >
            <form
              v-if="currentStep === 1"
              class="flex flex-col"
              @submit.prevent="setupFormContacts"
            >
              <div
                class="grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-8 pb-8 sm:border-t sm:border-gray-200 mt-6"
              >
                <div
                  class="flex flex-col pt-5 pb-8 md:max-w-2xl space-y-2 col-span-1"
                >
                  <div
                    class="flex flex-col sm:border-b sm:border-gray-200 sm:pb-5"
                  >
                    <div class="font-medium text-lg text-gray-700">
                      <h3>User Types</h3>
                    </div>
                    <p class="text-sm text-gray-500">
                      Select USSD or Web access types
                    </p>
                  </div>
                  <div>
                    <div class="pt-3">
                      <div class="flex flex-row items-start space-x-3">
                        <input
                          id="admin"
                          autocomplete="off"
                          name="user_types"
                          class="mt-1 border-gray-400 rounded-md"
                          type="checkbox"
                          @change="setUserType($event, 'WEB')"
                        />
                        <label
                          for="admin"
                          class="text-base text-gray-700 flex flex-col"
                        >
                          <span class="block text-sm font-medium text-gray-700"
                            >Web Access</span
                          >
                          <span class="font-normal text-sm text-gray-500"
                            >Create admin user</span
                          >
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="mt-1">
                      <div class="flex flex-row items-start space-x-3">
                        <input
                          id="customer"
                          autocomplete="off"
                          name="user_types"
                          class="mt-1 border-gray-400 rounded-md"
                          type="checkbox"
                          @change="setUserType($event, 'USSD')"
                        />
                        <label
                          for="customer"
                          class="text-base text-gray-700 flex flex-col"
                        >
                          <span class="block text-sm font-medium text-gray-700"
                            >USSD Access</span
                          >
                          <span class="font-normal text-sm text-gray-500"
                            >Create customer account</span
                          >
                        </label>
                      </div>
                    </div>
                  </div>
                  <div
                    class="flex flex-col sm:border-t sm:border-gray-200 sm:pt-5"
                  >
                    <div class="flex flex-row items-start space-x-3">
                      <input
                        id="notifyUser"
                        autocomplete="off"
                        type="checkbox"
                        name="notifyUser"
                        class="mt-1 border-gray-400 rounded-md"
                        checked
                        @change="setNotificationStatus"
                      />
                      <label
                        for="notifyUser"
                        class="text-base text-gray-700 flex flex-col"
                      >
                        <span class="block text-sm font-medium text-gray-700"
                          >Notify User</span
                        >
                        <span class="font-normal text-sm text-gray-500"
                          >Created User Notified On Create</span
                        >
                      </label>
                    </div>
                  </div>
                </div>
                <div
                  class="flex flex-col pt-5 pb-8 md:max-w-2xl space-y-2 col-span-1"
                >
                  <div
                    class="flex flex-col sm:border-b sm:border-gray-200 sm:pb-5"
                  >
                    <div class="font-medium text-lg text-gray-700">
                      <h3>Set Contact details</h3>
                    </div>
                    <p class="text-sm text-gray-500">
                      All fields are required to create and manage user accounts
                    </p>
                  </div>
                  <div
                    :class="{
                      'opacity-50  cursor-not-allowed':
                        formContacts.user_types.length === 0,
                    }"
                    class="flex flex-col pt-5 cursor-not-allowed"
                  >
                    <div
                      class="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-4"
                    >
                      <div>
                        <label
                          for="first-name"
                          class="block text-sm font-medium text-gray-700"
                          >First name</label
                        >
                        <div class="mt-1">
                          <input
                            id="first-name"
                            v-model="formContacts.firstName"
                            autocomplete="off"
                            :disabled="formContacts.user_types.length === 0"
                            type="text"
                            class="py-1 px-4 block w-full shadow-sm focus:ring-black focus:border-black border-gray-300 rounded-md"
                            required
                          />
                          <div
                            v-for="(error, index) of vFormContacts$.firstName
                              .$errors"
                            :key="index"
                            class="input-errors"
                          >
                            <div class="text-xs text-red-400">
                              {{ error.$message }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label
                          for="last-name"
                          class="block text-sm font-medium text-gray-700"
                          >Last name</label
                        >
                        <div class="mt-1">
                          <input
                            id="last-name"
                            v-model="formContacts.lastName"
                            autocomplete="off"
                            :disabled="formContacts.user_types.length === 0"
                            type="text"
                            class="py-1 px-4 block w-full shadow-sm focus:ring-black focus:border-black border-gray-300 rounded-md"
                            required
                          />
                          <div
                            v-for="(error, index) of vFormContacts$.lastName
                              .$errors"
                            :key="index"
                            class="input-errors"
                          >
                            <div class="text-xs text-red-400">
                              {{ error.$message }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="sm:col-span-2">
                        <label
                          for="email"
                          class="block text-sm font-medium text-gray-700"
                          >Email</label
                        >
                        <div class="mt-1">
                          <input
                            id="email"
                            v-model.lazy="formContacts.email"
                            autocomplete="off"
                            :disabled="formContacts.user_types.length === 0"
                            type="email"
                            class="py-1 px-4 block w-full shadow-sm focus:ring-black focus:border-black border-gray-300 rounded-md"
                            @change="setQuery($event)"
                          />
                          <div
                            v-for="(error, index) of vFormContacts$.email
                              .$errors"
                            :key="index"
                            class="input-errors"
                          >
                            <div class="text-xs text-red-400">
                              {{ error.$message }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="sm:col-span-2">
                        <label
                          for="phone-number"
                          class="block text-sm font-medium text-gray-700"
                          >Phone Number</label
                        >
                        <div class="mt-1 relative rounded-md shadow-sm">
                          <div
                            class="absolute inset-y-0 left-0 flex items-center"
                          >
                            <label
                              for="country"
                              class="sr-only"
                              >Country</label
                            >
                            <select
                              id="country"
                              class="h-full py-0 pl-4 pr-8 border-transparent bg-transparent text-gray-500 focus:ring-black focus:border-black rounded-md"
                              @change="setCountryCode($event)"
                            >
                              <option value="KE">KE</option>
                            </select>
                          </div>
                          <input
                            id="phone-number"
                            v-model.lazy="formContacts.phoneNumber"
                            autocomplete="off"
                            :disabled="formContacts.user_types.length === 0"
                            type="number"
                            class="py-1 px-4 block w-full pl-20 focus:ring-black focus:border-black border-gray-300 rounded-md"
                            @change="setQuery($event)"
                          />
                        </div>
                        <div
                          v-for="(error, index) of vFormContacts$.phoneNumber
                            .$errors"
                          :key="index"
                          class="input-errors"
                        >
                          <div class="text-xs text-red-400">
                            {{ error.$message }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex">
                <div class="ml-auto py-5">
                  <div class="space-x-3">
                    <button
                      type="button"
                      class="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500"
                      @click="$router.push('/users')"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-black"
                    >
                      Next:
                      {{
                        formContacts.user_types.findIndex(
                          type => type === "WEB"
                        ) !== -1
                          ? "Web"
                          : "USSD"
                      }}
                      Credentials
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </transition>
          <!--            step 2-->
          <transition
            enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
            leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
            enter-from-class="transform opacity-0 translate-x-full"
            enter-to-class="transform opacity-100 translate-x-0"
            leave-from-class="transform opacity-100 translate-x-0"
            leave-to-class="transform opacity-0 translate-x-full"
          >
            <form
              v-if="currentStep === 2"
              class="flex flex-col sm:border-t sm:border-gray-200 mt-3"
              @submit.prevent="setupFormWebAccess"
            >
              <div class="flex flex-col pb-2 mt-6">
                <div>
                  <h3 class="text-base leading-6 font-medium text-gray-900">
                    Set Web Credentials
                  </h3>
                  <p class="mt-1 text-xs text-gray-500">
                    Credentials to access web interface.
                  </p>
                </div>
                <div class="flex flex-col mt-6 sm:mt-5 space-y-2">
                  <div
                    class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                  >
                    <label
                      for="username"
                      class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Full names
                    </label>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                      <div class="max-w-lg flex">
                        <span class="font-semibold block w-full underline">
                          {{ formContacts.firstName }}
                          {{ formContacts.lastName }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5"
                  >
                    <label
                      for="username"
                      class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Username
                    </label>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                      <div class="max-w-lg flex rounded-md shadow-sm">
                        <input
                          id="username"
                          v-model.lazy="formWebAccess.username"
                          autocomplete="off"
                          type="text"
                          name="username"
                          class="flex-1 block w-full focus:ring-black focus:border-black min-w-0 rounded-md sm:text-sm border-gray-300"
                          required
                          @change="setQuery($event)"
                        />
                      </div>
                      <div
                        v-for="(error, index) of vFormWebAccess$.username
                          .$errors"
                        :key="index"
                        class="input-errors"
                      >
                        <div class="text-xs text-red-400">
                          {{ error.$message }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-col border-b mt-4 pt-3 pb-8 space-y-2">
                <div>
                  <h3 class="text-base leading-6 font-medium text-gray-900">
                    Temporary Password
                  </h3>
                  <p class="mt-1 max-w-2xl text-xs text-gray-500">
                    Set temporary password.
                  </p>
                </div>
                <div
                  class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                >
                  <label
                    for="password"
                    class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Password
                  </label>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <div class="max-w-lg flex rounded-md shadow-sm">
                      <input
                        id="password"
                        v-model="formWebAccess.password"
                        autocomplete="off"
                        type="password"
                        name="password"
                        class="flex-1 block w-full focus:ring-black focus:border-black min-w-0 rounded-md sm:text-sm border-gray-300"
                        required
                      />
                    </div>
                    <div
                      v-for="(error, index) of vFormWebAccess$.password.$errors"
                      :key="index"
                      class="input-errors"
                    >
                      <div class="text-xs text-red-400">
                        {{ error.$message }}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5"
                >
                  <label
                    for="password-c"
                    class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Password Confirmation
                  </label>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <div class="max-w-lg flex rounded-md shadow-sm">
                      <input
                        id="password-c"
                        v-model="formWebAccess.passwordConfirmation"
                        autocomplete="off"
                        type="password"
                        name="password-c"
                        class="flex-1 block w-full focus:ring-black focus:border-black min-w-0 rounded-md sm:text-sm border-gray-300"
                        required
                      />
                    </div>
                    <div
                      v-for="(error, index) of vFormWebAccess$
                        .passwordConfirmation.$errors"
                      :key="index"
                      class="input-errors"
                    >
                      <div class="text-xs text-red-400">
                        {{ error.$message }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex">
                <div class="ml-auto py-5">
                  <div class="space-x-3">
                    <button
                      type="button"
                      class="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500"
                      @click="previousStep()"
                    >
                      Previous
                    </button>

                    <button
                      type="submit"
                      class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-black"
                    >
                      {{
                        formContacts.user_types.findIndex(
                          type => type === "USSD"
                        ) !== -1
                          ? "Next: USSD Credentials"
                          : "Save User"
                      }}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </transition>
          <!--            step 3-->
          <transition
            enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
            leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
            enter-from-class="transform opacity-0 translate-x-full"
            enter-to-class="transform opacity-100 translate-x-0"
            leave-from-class="transform opacity-100 translate-x-0"
            leave-to-class="transform opacity-0 translate-x-full"
          >
            <form
              v-if="currentStep === 3"
              class="flex flex-col min-h-screen"
              @submit.prevent="setupFormUSSDAccess"
            >
              <div class="flex flex-col pb-2 mt-6">
                <div>
                  <h3 class="text-base leading-6 font-medium text-gray-900">
                    Set USSD Credentials
                  </h3>
                  <p class="mt-1 text-xs text-gray-500">
                    Credentials to access ussd interface
                  </p>
                </div>
                <div class="flex flex-col mt-6 sm:mt-5 space-y-2">
                  <div
                    class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                  >
                    <label
                      for="username"
                      class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Full names
                    </label>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                      <div class="max-w-lg flex">
                        <span class="font-semibold block w-full underline">
                          {{ formContacts.firstName }}
                          {{ formContacts.lastName }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5"
                  >
                    <label
                      for="phonex"
                      class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Phone number
                    </label>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                      <div class="max-w-lg relative rounded-md shadow-sm">
                        <div
                          class="absolute inset-y-0 left-0 flex items-center"
                        >
                          <label
                            for="country"
                            class="sr-only"
                            >Country</label
                          >
                          <select
                            id="phone"
                            class="h-full py-0 pl-4 pr-8 border-transparent bg-transparent text-gray-500 focus:ring-black focus:border-black rounded-md"
                            @change="setCountryCode($event, 'ussd')"
                          >
                            <option value="KE">KE</option>
                          </select>
                        </div>
                        <input
                          id="phonex"
                          v-model="formUSSDAccess.phoneNumber"
                          autocomplete="off"
                          type="number"
                          class="py-1 px-4 block w-full pl-20 focus:ring-black focus:border-black border-gray-300 rounded-md"
                          required
                          @change="setQuery($event)"
                        />
                      </div>
                      <div
                        v-for="(error, index) of vFormUSSDAccess$.phoneNumber
                          .$errors"
                        :key="index"
                        class="input-errors"
                      >
                        <div class="text-xs text-red-400">
                          {{ error.$message }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-col border-b mt-4 pt-3 pb-8 space-y-2">
                <div>
                  <h3 class="text-base leading-6 font-medium text-gray-900">
                    Temporary Pin
                  </h3>
                  <p class="mt-1 max-w-2xl text-xs text-gray-500">
                    Set temporary Pin.
                  </p>
                </div>
                <div
                  class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                >
                  <div>
                    <label
                      for="pinStatus"
                      class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Pin Status
                    </label>
                    <p class="mt-2 text-xs text-gray-500">Default is SET.</p>
                  </div>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <div class="max-w-lg flex items-center">
                      <div class="flex-1 flex items-center h-12">
                        <input
                          id="pinStatus"
                          autocomplete="off"
                          type="checkbox"
                          name="pinStatus"
                          class="flex-none block w-4 focus:ring-black focus:border-black min-w-0 rounded-md sm:text-sm border-gray-300"
                          @change="setPinStatus"
                        />
                        <p class="text-xs text-gray-500 ml-2">
                          Set as temporary
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5"
                >
                  <div>
                    <label
                      for="pin"
                      class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Pin
                    </label>
                    <p class="mt-2 text-xs text-gray-500">
                      Maximum of 4 numbers
                    </p>
                  </div>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <div class="max-w-lg flex rounded-md shadow-sm">
                      <input
                        id="pin"
                        v-model="formUSSDAccess.pin"
                        autocomplete="off"
                        pattern="[0-9]{4,4}"
                        type="password"
                        name="pin"
                        class="flex-1 block w-full focus:ring-black focus:border-black min-w-0 rounded-md sm:text-sm border-gray-300"
                        required
                      />
                    </div>
                    <div
                      v-for="(error, index) of vFormUSSDAccess$.pin.$errors"
                      :key="index"
                      class="input-errors"
                    >
                      <div class="text-xs text-red-400">
                        {{ error.$message }}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5"
                >
                  <div>
                    <label
                      for="pin-c"
                      class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Pin Confirmation
                    </label>
                    <p class="mt-2 text-xs text-gray-500">
                      Ensure it matches the pin above
                    </p>
                  </div>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <div class="max-w-lg flex rounded-md shadow-sm">
                      <input
                        id="pin-c"
                        v-model="formUSSDAccess.pinConfirmation"
                        autocomplete="off"
                        pattern="[0-9]{4,4}"
                        type="password"
                        name="pin-c"
                        class="flex-1 block w-full focus:ring-black focus:border-black min-w-0 rounded-md sm:text-sm border-gray-300"
                        required
                      />
                    </div>
                    <div
                      v-for="(error, index) of vFormUSSDAccess$.pinConfirmation
                        .$errors"
                      :key="index"
                      class="input-errors"
                    >
                      <div class="text-xs text-red-400">
                        {{ error.$message }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex">
                <div class="ml-auto py-5">
                  <div class="space-x-3">
                    <button
                      type="button"
                      class="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500"
                      @click="$router.push('/users')"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-black"
                    >
                      Next: Assign Roles
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </transition>
          <!--            step 4-->
          <transition
            enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
            leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
            enter-from-class="transform opacity-0 translate-x-full"
            enter-to-class="transform opacity-100 translate-x-0"
            leave-from-class="transform opacity-100 translate-x-0"
            leave-to-class="transform opacity-0 translate-x-full"
          >
            <div
              v-if="currentStep === 4"
              class="flex flex-col pb-16"
            >
              <div>
                <h3
                  class="text-base leading-6 font-medium text-gray-900 border-t pt-4 mt-6"
                >
                  Set user roles
                </h3>
                <p class="mt-1 text-xs text-gray-500">
                  Select user access roles
                </p>
              </div>
              <div
                class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
              >
                <label
                  for="username"
                  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Full names
                </label>
                <div class="mt-1 sm:mt-0 sm:col-span-2">
                  <div class="max-w-lg flex">
                    <span class="font-semibold block w-full underline">
                      {{ formContacts.firstName }} {{ formContacts.lastName }}
                    </span>
                  </div>
                </div>
              </div>
              <form @submit.prevent="saveRoles">
                <div class="flex flex-col pt-6">
                  <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div
                      class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
                    >
                      <div
                        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
                      >
                        <table class="min-w-full divide-y divide-gray-200">
                          <thead class="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Select
                              </th>
                              <th
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Role
                              </th>
                              <th
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <!-- Odd row name: string, roleType: string, description: string, id: string -->
                            <tr
                              v-for="(role, i) in available_roles"
                              :key="role.id"
                              :class="{
                                'bg-white': i % 2 === 0,
                                'bg-gray-50': i % 2 !== 0,
                              }"
                            >
                              <td
                                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                              >
                                <input
                                  :id="'role' + i"
                                  :value="role"
                                  :name="'role' + i"
                                  class="border-gray-400 rounded-md"
                                  type="checkbox"
                                  autocomplete="off"
                                  @change="setEventVal"
                                />
                              </td>
                              <td
                                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                              >
                                {{ role.name }}
                              </td>
                              <td
                                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                              >
                                {{
                                  role.roleDescription
                                    ? role.roleDescription
                                    : "customer or admin role description"
                                }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex">
                  <div class="ml-auto py-6">
                    <div class="space-x-3">
                      <button
                        type="button"
                        class="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500"
                        @click="$router.push('/users')"
                      >
                        Cancel
                      </button>

                      <button
                        :disabled="loading"
                        type="submit"
                        class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-black"
                      >
                        <svg
                          v-if="loading"
                          class="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          />
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Save: User
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
