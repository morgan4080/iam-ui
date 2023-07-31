<script setup lang="ts">
import { reactive, toRef, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { User } from "@users/types";

const emit = defineEmits(["clear"]);

const props = defineProps<{
  loading: boolean;
  user: User | null;
}>();

const user = toRef(props, "user");

const loading = toRef(props, "loading");

const initialState = {
  firstName: user.value ? user.value.firstName : "",
  lastName: user.value ? user.value.lastName : "",
  email: user.value ? user.value.email : "",
  phoneNumber: user.value ? user.value.phoneNumber : "",
};

const state = reactive({
  ...initialState,
});

const rules = {
  firstName: { required },
  lastName: { required },
  email: { required, email },
  phoneNumber: { required },
};

const v$ = useVuelidate(rules, state, { $lazy: true, $autoDirty: true });

const clear = () => {
  v$.value.$reset();

  for (const [key, value] of Object.entries(initialState)) {
    state[key as keyof typeof initialState] = value;
  }
};

watch(loading, async () => {
  if (loading.value) {
    v$.value.$touch();
    const result = await v$.value.$validate();
    if (result) {
      console.log("submit state", state);
      clear();
    } else {
      setTimeout(() => {
        emit("clear");
      }, 1000);
    }
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
      placeholder="+254*********"
      required
      variant="outlined"
      density="compact"
      hide-details="auto"
      @input="v$.phoneNumber.$touch"
      @blur="v$.phoneNumber.$touch"
    ></v-text-field>

    <div class="text-subtitle-1 text-sm-caption font-weight-bold py-2">
      Email phoneNumber
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
    ></v-text-field>
  </form>
</template>

<style scoped></style>
