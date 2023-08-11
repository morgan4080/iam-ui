<script setup lang="ts">
import { reactive, toRef, watch, computed, getCurrentInstance } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { email, helpers, required, numeric } from "@vuelidate/validators";
import { isValidNumberForRegion, parsePhoneNumber } from "libphonenumber-js";

const emit = defineEmits(["setQuery", "updated", "isError"]);

const validPhone = (value: number) => isValidNumberForRegion(`${value}`, "KE");
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

const rules = {
  firstName: { required },
  lastName: { required },
  email: { required, email },
  phoneNumber: {
    required,
    numeric,
    validPhone: helpers.withMessage(
      "Please provide a valid number",
      validPhone
    ),
  },
};

const v$ = useVuelidate(rules, state, { $lazy: true, $autoDirty: true });

const parseNumber = (phoneNo: string) => {
  return parsePhoneNumber(phoneNo, "KE");
};

const phoneChanged = async () => {
  if (v$.value.phoneNumber.$errors.length == 0) {
    const phone = parseNumber(state.phoneNumber);
    emit("setQuery", {
      value: `${phone?.countryCallingCode}${phone?.nationalNumber}`,
      context: "phone-number",
    });
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
      emit("updated", {
        ...state,
        phoneNumber: `${phone?.countryCallingCode}${phone?.nationalNumber}`,
      });
      emit("isError", false);
    } else {
      emit("isError", true);
    }
  })();
}
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
      placeholder="254*********"
      required
      variant="outlined"
      density="compact"
      hide-details="auto"
      @input="v$.phoneNumber.$touch"
      @blur="v$.phoneNumber.$touch"
      @change="phoneChanged"
    ></v-text-field>

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
