<script setup lang="ts">
import { computed, reactive, toRef, watch, onMounted } from "vue";
import { required, email } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const emit = defineEmits(["setQuery", "updated", "isError"]);

const props = defineProps<{
  username?: string;
  emailAddress?: string;
  requestData: number;
}>();

const username = toRef(props, "username");
const emailAddress = toRef(props, "emailAddress");
const requestData = toRef(props, "requestData");

const initialState = computed(() => {
  return {
    username: username.value ? username.value : "",
    email: emailAddress.value ? emailAddress.value : "",
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

watch(state, async () => {
  const result = await v$.value.$validate();
  if (result) {
    emit("isError", false);
  } else {
    emit("isError", true);
  }
});

watch(requestData, async () => {
  const result = await v$.value.$validate();
  if (result) {
    emit("updated", {
      ...state,
    });
    emit("isError", false);
  } else {
    emit("isError", true);
  }
});

onMounted(() => {
  v$.value.$validate();
});
</script>

<template>
  <form
    action=""
    class="grid grid-cols-2 gap-4 pb-4"
  >
    <div class="flex-col">
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
        @input="v$.username.$touch"
        @blur="v$.username.$touch"
        @change="
          emit('updated', {
            ...state,
          })
        "
      ></v-text-field>
    </div>

    <div class="flex-col">
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
        placeholder="Email address"
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
            username: '',
          });
        "
      ></v-text-field>
    </div>
  </form>
</template>

<style scoped></style>
