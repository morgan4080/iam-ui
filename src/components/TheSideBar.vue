<script setup lang="ts">

import {ref} from "vue";

const open = ref(true)
const open0 = ref(true)
const setWidth = ref(true)
</script>

<template>
  <div :class="{ 'transition duration-500 ease-in-out w-64': setWidth, 'transition duration-500 ease-in-out w-0': !setWidth }" class="flex flex-col transform bg-white">
    <div class="ml-4 mt-3 border-r text-base relative font-bold tracking-tight text-gray-900">
      <div v-if="setWidth">
        <h1>Identity and Access</h1>
        <h1>Management (IAM)</h1>
      </div>
      <div class="pb-2 border-b mr-4"></div>
      <button v-if="setWidth" @click="setWidth = !setWidth" type="button" class="absolute rounded px-1 border-b border-l border-r rotate-90 -right-3 top-2 bg-white" style="background: white;">
        <svg class="rotate-90 flex-shrink-0 h-5 w-5 transform hover:text-gray-900 transition-colors ease-in-out duration-150 text-gray-500" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M6 6L14 10L6 14V6Z" fill="currentColor"></path>
        </svg>
      </button>
      <button v-if="!setWidth" @click="setWidth = !setWidth" type="button" class="absolute rounded px-1 border-b border-l border-r rotate-270 -right-3 top-2 bg-white" style="background: white;">
        <svg class="rotate-90 flex-shrink-0 h-5 w-5 transform hover:text-gray-900 transition-colors ease-in-out duration-150 text-gray-500" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M6 6L14 10L6 14V6Z" fill="currentColor"></path>
        </svg>
      </button>
    </div>
    <div class="flex flex-col flex-grow border-r border-gray-200 pt-5 pb-4 bg-white overflow-y-auto">

      <div class="flex-grow flex flex-col">

        <nav class="flex-1 px-2 space-y-1 bg-white" aria-label="Sidebar">
          <div>
            <router-link to="/dashboard" class="text-gray-900 group w-full flex items-center pl-7 pr-2 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-gray-900" >
              Dashboard
            </router-link>
          </div>
          <div class="space-y-1">
            <button type="button" class="bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 group w-full flex items-center pr-2 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-controls="sub-menu-1" @click="open0 = !open0" aria-expanded="false">
              <svg class="mr-2 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150 text-gray-300" viewBox="0 0 20 20" aria-hidden="true" :class="{ 'text-gray-400 rotate-90': open0, 'text-gray-300': !(open0) }">
                <path d="M6 6L14 10L6 14V6Z" fill="currentColor"></path>
              </svg>
              Access management
            </button>
            <div :class="{'block' : open0, 'hidden' : !open0 }" class="space-y-1" id="sub-menu-1" >

              <router-link to="/users" class="group w-full flex items-center pl-10 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
                Users
              </router-link>

              <router-link to="/roles" class="group w-full flex items-center pl-10 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
                Roles
              </router-link>

            </div>
          </div>
          <div class="space-y-1 hidden">
            <button type="button" class="bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 group w-full flex items-center pr-2 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-controls="sub-menu-1" @click="open = !open" aria-expanded="false">
              <svg class="mr-2 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150 text-gray-300" viewBox="0 0 20 20" aria-hidden="true" :class="{ 'text-gray-400 rotate-90': open, 'text-gray-300': !(open) }">
                <path d="M6 6L14 10L6 14V6Z" fill="currentColor"></path>
              </svg>
              Management reports
            </button>
            <div :class="{'block' : open, 'hidden' : !open }" class="space-y-1" id="sub-menu-2" >

              <a href="#" class="group w-full flex items-center pl-10 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
                Overview
              </a>

              <a href="#" class="group w-full flex items-center pl-10 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
                Members
              </a>

              <a href="#" class="group w-full flex items-center pl-10 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
                Calendar
              </a>

              <a href="#" class="group w-full flex items-center pl-10 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
                Settings
              </a>

            </div>
          </div>
          <div class="space-y-1 hidden">
            <a href="#" class="text-gray-900 group w-full flex items-center pl-7 pr-2 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-gray-900" >
              Organisation activity
            </a>
          </div>
        </nav>
      </div>
    </div>

  </div>
</template>
