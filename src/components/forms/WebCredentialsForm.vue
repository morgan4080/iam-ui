<script setup lang="ts">
import { computed, reactive, toRef, watch, getCurrentInstance } from "vue";
import { required, email } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const emit = defineEmits(["setQuery", "updated", "isError"]);
const instance = getCurrentInstance();

const props = defineProps<{
  username?: string;
  password?: string;
}>();

const username = toRef(props, "username");
const password = toRef(props, "password");

const initialState = computed(() => {
  return {
    username: username.value ? username.value : "",
    password: password.value ? password.value : "",
  };
});

const state = reactive({
  ...initialState.value,
});

const rules = {
  username: { email, required },
  password: {},
};

const v$ = useVuelidate(rules, state, { $lazy: true, $autoDirty: true });

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
      emit("updated", {
        ...state,
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
    class="grid grid-cols-2 gap-4 pb-4"
  >
    <div
      class="flex-col"
      :class="{ 'col-span-2': props.password === undefined }"
    >
      <div class="text-subtitle-1 text-sm-caption font-weight-bold py-2">
        Web Username
        <span
          v-if="v$.username.required"
          class="text-red"
          >*</span
        >
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
        type="email"
        @input="v$.username.$touch"
        @blur="v$.username.$touch"
        @change="
          emit('updated', {
            ...state,
          })
        "
      ></v-text-field>
    </div>

    <div
      v-if="props.password !== undefined"
      class="flex-col"
    >
      <div class="text-subtitle-1 text-sm-caption font-weight-bold py-2">
        Password
      </div>
      <v-text-field
        v-model="state.password"
        color="primary"
        placeholder="Password"
        required
        variant="outlined"
        density="compact"
        hide-details="auto"
        type="password"
        @change="
          emit('updated', {
            ...state,
          })
        "
      ></v-text-field>
    </div>
  </form>
</template>

<style scoped></style>
