<script setup lang="ts">
import { computed, reactive, toRef } from "vue";
import { required, email } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { User } from "@users/types";

const props = defineProps<{
  user: User | null;
}>();

const user = toRef(props, "user");

const initialState = computed(() => {
  return {
    username: user.value ? user.value.username : "",
    email: user.value ? user.value.email : "",
  };
});

const state = reactive({
  ...initialState.value,
});

const rules = {
  username: { required },
  email: { email, required },
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
        Web Username
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
        @input="v$.username.$touch"
        @blur="v$.username.$touch"
      ></v-text-field>
    </div>

    <div class="flex-col">
      <div class="text-subtitle-1 text-sm-caption font-weight-bold py-2">
        Email
      </div>
      <v-text-field
        v-model="state.email"
        color="primary"
        :error-messages="v$.email.$errors.map(e => e.$message) as any"
        placeholder="Email address"
        required
        variant="outlined"
        density="compact"
        hide-details="auto"
        @input="v$.email.$touch"
        @blur="v$.email.$touch"
      ></v-text-field>
    </div>
  </form>
</template>

<style scoped></style>
