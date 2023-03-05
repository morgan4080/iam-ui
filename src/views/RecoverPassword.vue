<script setup lang="ts">
import TheLogo from "../components/TheLogo.vue";
import { reactive } from "vue";
const resetForm = reactive({
  email: null,
});

function resetPassword() {
  console.log("submission data", resetForm);
}
</script>
<template>
  <main
    class="relative z-10 flex-auto flex items-center justify-center text-sm text-center text-gray-600 pb-16 px-4 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-sm">
      <div
        class="flex flex-col justify-center items-center space-y-2 font-bold text-2xl mx-auto mb-4 space-x-1 text-gray-900"
      >
        <TheLogo class="w-16 text-blue-600 hover:text-blue-900" />
        <h1>Presta Capital</h1>
      </div>
      <p class="text-center text-sm mb-8">
        Enter your email and we'll send you a link to reset your password.
      </p>

      <form
        method="POST"
        @submit.prevent="resetPassword"
      >
        <div class="relative">
          <label
            for="email-address"
            class="sr-only"
          >Email address</label>
          <input
            id="email-address"
            v-model="resetForm.email"
            type="email"
            class="text-gray-900 ring-gray-900 ring-opacity-5 placeholder-gray-400 appearance-none bg-white rounded-md block w-full px-3 py-2 border border-transparent shadow ring-1 sm:text-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
            placeholder="Email address"
          >
        </div>

        <button
          type="submit"
          class="block w-full py-2 px-3 border border-transparent rounded-md text-white font-medium bg-gray-700 shadow-sm sm:text-sm mt-4 hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
        >
          Reset your password
        </button>
      </form>
    </div>
  </main>
  <img
    src="/beams-corner-light.jpg"
    alt=""
    class="absolute bottom-0 right-0 w-[45.875rem]"
  >
</template>
