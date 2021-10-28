<template>
  <form class="space-y-6" @submit.prevent="$router.push('/dashboard')">
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
      <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500">
        Sign in
      </button>
    </div>
  </form>
</template>
