<script setup lang="ts">
import Logo from '@/components/Logo.vue'
</script>

<template>
  <div class="relative bg-gray-900 min-h-screen w-full">
    <div class="relative h-56 bg-blue-600 sm:h-72 md:absolute md:left-0 md:h-full md:w-1/2">
      <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1920&amp;q=60&amp;sat=-100" alt="">
      <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-600 mix-blend-multiply"></div>
    </div>
    <div class="relative mx-auto max-w-md px-4 py-12 sm:max-w-7xl sm:px-6 sm:py-20 md:py-28 lg:px-8 lg:py-32">
      <div class="md:ml-auto md:w-1/2 md:pl-10">
        <div class="flex text-white font-bold text-lg space-x-5 items-center">
          <Logo class="w-10"/>
          <h1>PRESTA CAPITAL</h1>
        </div>
        <h2 class="text-base font-semibold uppercase tracking-wider text-white pt-6">
          identity and access management
        </h2>

        <div class="mt-6 text-gray-300">
          <form class="space-y-6" @submit.prevent="$router.push('/dashboard')">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-200">
                Email address
              </label>
              <div class="mt-1">
                <input id="email" name="email" type="email" autocomplete="email" required="" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-200">
                Password
              </label>
              <div class="mt-1">
                <input id="password" name="password" type="password" autocomplete="current-password" required="" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label for="remember-me" class="ml-2 block text-sm text-gray-200">
                  Remember me
                </label>
              </div>

              <div class="text-sm">
                <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
