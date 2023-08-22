<script setup lang="ts">
import {
  reactive,
  toRef,
  watch,
  computed,
  getCurrentInstance,
  onMounted,
} from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
  email,
  helpers,
  required,
  numeric,
  requiredIf,
} from "@vuelidate/validators";
import {
  AsYouType,
  isValidPhoneNumber,
  parsePhoneNumber,
} from "libphonenumber-js";
import { useUsers } from "@users/composables/useUsers";
import { storeToRefs } from "pinia";
const { countries } = useUsers();
const { countrySelected } = storeToRefs(useUsers());
const emit = defineEmits(["setQuery", "updated", "isError"]);

const instance = getCurrentInstance();

const props = defineProps<{
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  emailAddress?: string;
}>();

const firstName = toRef(props, "firstName");
const lastName = toRef(props, "lastName");
const phoneNumber = toRef(props, "phoneNumber");
const emailAddress = toRef(props, "emailAddress");

const initialState = computed(() => {
  return {
    firstName: firstName.value ? firstName.value : "",
    lastName: lastName.value ? lastName.value : "",
    email: emailAddress.value ? emailAddress.value : "",
    phoneNumber: phoneNumber.value ? phoneNumber.value : "",
  };
});

const state = reactive({
  ...initialState.value,
});

const validPhone = (value: number) => {
  if (state.phoneNumber !== "") {
    return isValidPhoneNumber(`${value}`, countrySelected.value);
  } else {
    return true;
  }
};

const rules = {
  firstName: { required },
  lastName: { required },
  email: { email },
  phoneNumber: {
    required: requiredIf(state.phoneNumber),
    numeric,
    validPhone: helpers.withMessage(
      "Please provide a valid number",
      validPhone
    ),
  },
};

const v$ = useVuelidate(rules, state, { $lazy: true, $autoDirty: true });

const parseNumber = (phoneNo: string) => {
  return parsePhoneNumber(phoneNo, countrySelected.value);
};

const phoneChanged = async () => {
  if (v$.value.phoneNumber.$errors.length == 0) {
    emit("updated", {
      ...state,
    });
  }
};

watch(state, async () => {
  const result = await v$.value.$validate();
  if (result) {
    emit("isError", false);
  } else {
    emit("isError", true);
  }
});

if (instance && instance.vnode.key) {
  (async function () {
    const result = await v$.value.$validate();
    if (result) {
      const phone = parseNumber(`${state.phoneNumber}`);
      const payload = {
        ...state,
        phoneNumber: `${phone?.countryCallingCode}${phone?.nationalNumber}`,
      };
      emit("updated", payload);
      emit("isError", false);
    } else {
      emit("isError", true);
    }
  })();
}

onMounted(() => {
  const asYouType = new AsYouType();
  asYouType.input(`+${state.phoneNumber}`);
  if (asYouType.getNumber()?.country) {
    countrySelected.value = asYouType.getNumber()?.country;
  }
});
</script>

<template>
  <form>
    <div class="grid grid-cols-2 gap-4">
      <div class="flex-col w-full">
        <div class="text-subtitle-1 text-sm-caption font-weight-bold py-2">
          First Name
          <span
            v-if="v$.firstName.required"
            class="text-red"
            >*</span
          >
        </div>
        <v-text-field
          v-model="state.firstName"
          color="primary"
          :error-messages="v$.firstName.$errors.map(e => e.$message) as any"
          placeholder="First Name"
          required
          variant="outlined"
          density="compact"
          hide-details="auto"
          @input="v$.firstName.$touch"
          @blur="v$.firstName.$touch"
          @change="
            emit('updated', {
              ...state,
            })
          "
        ></v-text-field>
      </div>
      <div class="flex-col w-full">
        <div class="text-subtitle-1 text-sm-caption font-weight-bold py-2">
          Last Name
          <span
            v-if="v$.lastName.required"
            class="text-red"
            >*</span
          >
        </div>
        <v-text-field
          v-model="state.lastName"
          color="primary"
          :error-messages="v$.lastName.$errors.map(e => e.$message) as any"
          placeholder="Last Name"
          required
          variant="outlined"
          density="compact"
          hide-details="auto"
          @input="v$.lastName.$touch"
          @blur="v$.lastName.$touch"
          @change="
            emit('updated', {
              ...state,
            })
          "
        ></v-text-field>
      </div>
    </div>

    <div class="text-subtitle-1 text-sm-caption font-weight-bold py-2">
      Phone Number
      <span
        v-if="v$.phoneNumber.required"
        class="text-red"
        >*</span
      >
    </div>
    <v-text-field
      v-model="state.phoneNumber"
      color="primary"
      :error-messages="v$.phoneNumber.$errors.map(e => e.$message) as any"
      placeholder="722000000"
      required
      variant="outlined"
      density="compact"
      hide-details="auto"
      @input="v$.phoneNumber.$touch"
      @blur="v$.phoneNumber.$touch"
      @change="phoneChanged"
    >
      <template #prepend>
        <v-autocomplete
          v-model="countrySelected"
          :items="countries"
          item-title="name"
          item-value="alpha2Code"
          variant="outlined"
          :density="'compact'"
          :hide-details="true"
          :flat="true"
          style="width: 150px"
          auto-select-first
          :chips="true"
          placeholder="Country"
        >
          <template #chip="{ props, item }">
            <v-chip
              v-bind="props"
              :prepend-avatar="`https://flagcdn.com/h40/${item?.raw?.alpha2Code.toLowerCase()}.png`"
            ></v-chip>
          </template>
          <template #item="{ props, item }">
            <v-list-item
              v-bind="props"
              :prepend-avatar="`https://flagcdn.com/h40/${item?.raw?.alpha2Code.toLowerCase()}.png`"
              :title="item?.raw?.name"
              :subtitle="item?.raw?.code"
              class="text-caption"
            />
          </template>
        </v-autocomplete>
      </template>
    </v-text-field>

    <div class="text-subtitle-1 text-sm-caption font-weight-bold py-2">
      Email
      <span
        v-if="v$.email.required"
        class="text-red"
        >*</span
      >
    </div>
    <v-text-field
      v-model="state.email"
      color="primary"
      :error-messages="v$.email.$errors.map(e => e.$message) as any"
      placeholder="Contact Email"
      required
      variant="outlined"
      density="compact"
      hide-details="auto"
      type="email"
      @input="v$.email.$touch"
      @blur="v$.email.$touch"
      @change="
        emit('setQuery', { value: state.email, context: 'email' });
        emit('updated', {
          ...state,
        });
      "
    ></v-text-field>
  </form>
</template>
