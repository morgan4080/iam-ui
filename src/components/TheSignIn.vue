<template>
  <form class="space-y-6" @submit.prevent="$router.push('/dashboard')">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-200">
        Email address
      </label>
      <div class="mt-1">
        <input id="email" type="email" autocomplete="email" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
      </div>
    </div>
    <div>
      <label for="email" class="block text-sm font-medium text-gray-200">
        Password
      </label>
      <div class="mt-1">
        <input id="password" type="password" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
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
        <router-link to="/password/reset" class="font-medium text-blue-600 hover:text-blue-500">
          Forgot your password?
        </router-link>
      </div>
    </div>

    <div>
      <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500">
        Sign in
      </button>
    </div>
  </form>
</template>
