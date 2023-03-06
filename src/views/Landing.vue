<script setup lang="ts">
import TheLogo from "../components/TheLogo.vue";
import TheSignIn from "../components/TheSignIn.vue";
</script>

<template>
  <div class="relative bg-gray-900 min-h-screen w-full">
    <div
      class="relative h-56 bg-blue-600 sm:h-72 md:absolute md:left-0 md:h-full md:w-1/2"
    >
      <img
        class="w-full h-full object-cover object-right"
        src="https://images.unsplash.com/photo-1573164574397-dd250bc8a598?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1920&amp;q=60&amp;sat=-100"
        alt=""
      />
      <div
        aria-hidden="true"
        class="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-600 mix-blend-multiply"
      />
    </div>
    <div
      class="relative mx-auto max-w-md px-4 py-12 sm:max-w-7xl sm:px-6 sm:py-20 md:py-28 lg:px-8 lg:py-32"
    >
      <div class="md:ml-auto md:w-1/2 md:pl-10">
        <div
          class="flex text-gray-200 font-bold text-lg space-x-5 items-center"
        >
          <TheLogo class="w-10" />
          <h1>PRESTA CAPITAL</h1>
        </div>
        <h2
          class="text-base font-semibold uppercase tracking-wider text-gray-200 pt-6"
        >
          identity and access management
        </h2>

        <div class="mt-6 text-gray-300">
          <TheSignIn />
        </div>
      </div>
    </div>
  </div>
</template>
