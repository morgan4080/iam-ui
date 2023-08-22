<script setup lang="ts">
import { computed, reactive, toRef } from "vue";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { User } from "@users/types";

const props = defineProps<{
  user: User | null;
}>();

const user = toRef(props, "user");

const initialState = computed(() => {
  return {
    username: user.value ? user.value.firstName : "",
    phoneNumber: user.value ? user.value.ussdPhoneNumber : "",
  };
});

const state = reactive({
  ...initialState.value,
});

const rules = {
  username: { required },
  phoneNumber: { required },
};

const v$ = useVuelidate(rules, state, { $lazy: true, $autoDirty: true });
</script>

<template>
  <form
    action=""
    class="grid grid-cols-2 gap-4 pb-4"
  >
    <div class="flex-col">
      <div class="text-subtitle-1 text-sm-caption font-weight-bold py-2">
        Mobile Username
      </div>
      <v-text-field
        v-model="state.username"
        color="primary"
        :error-messages="v$.username.$errors.map(e => e.$message) as any"
        placeholder="Username"
        required
        variant="outlined"
        density="compact"
        hide-details="auto"
        :disabled="true"
        @input="v$.username.$touch"
        @blur="v$.username.$touch"
      ></v-text-field>
    </div>

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
        :disabled="true"
        @input="v$.phoneNumber.$touch"
        @blur="v$.phoneNumber.$touch"
      ></v-text-field>
    </div>
  </form>
</template>

<style scoped></style>
