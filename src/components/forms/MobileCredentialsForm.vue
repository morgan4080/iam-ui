<script setup lang="ts">
import { computed, reactive, toRef } from "vue";
import useVuelidate from "@vuelidate/core";
import { User } from "@users/types";
import { getCurrentInstance } from "vue";
import { useUsers } from "@users/composables/useUsers";
import { storeToRefs } from "pinia";
import { helpers, numeric, required } from "@vuelidate/validators";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";

const { countries } = useUsers();
const { countrySelected } = storeToRefs(useUsers());

const props = defineProps<{
  user: User | null;
}>();

const emit = defineEmits(["setQuery", "updated", "isError"]);
const instance = getCurrentInstance();

const user = toRef(props, "user");

const initialState = computed(() => {
  return {
    phoneNumber: user.value ? user.value.ussdPhoneNumber : "",
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
  return parsePhoneNumber(phoneNo, countrySelected.value);
};

const phoneChanged = async () => {
  if (v$.value.phoneNumber.$errors.length == 0) {
    emit("updated", {
      ...state,
    });
  }
};

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
  <form
    action=""
    class="grid grid-cols-1 gap-4 pb-4"
  >
    <div class="flex-col">
      <div class="text-subtitle-1 text-sm-caption font-weight-bold py-2">
        Mobile Phone Number
      </div>
      <v-text-field
        v-model="state.phoneNumber"
        color="primary"
        :error-messages="v$.phoneNumber.$errors.map(e => e.$message) as any"
        placeholder="Phone no."
        required
        variant="outlined"
        density="compact"
        hide-details="auto"
        @input="phoneChanged"
        @blur="v$.phoneNumber.$touch"
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
    </div>
  </form>
</template>

<style scoped></style>
