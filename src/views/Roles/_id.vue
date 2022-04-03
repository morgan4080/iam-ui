<script setup lang="ts">
  import { getRole } from '@/modules/all'
  import { useRoute } from "vue-router"
  import {ref} from "vue";
  const route = useRoute()

  const role:any = ref()
  getRole(route.params.id).then((r) => {
    role.value = r
  })
</script>
  <template>
   <div>
     <nav class="mt-0 flex px-5 bg-white lg:px-8" aria-label="Breadcrumb">
       <ol role="list" class="flex items-center space-x-4">

         <li>
           <div class="flex items-center">
             <router-link :to="`/admin/roles/`" class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate" style="color: #9e9e9e">User Profile</router-link>
           </div>
         </li>

         <li>
           <div class="flex items-center">
             <svg class="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
               <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
             </svg>
             <h1 class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate">
               Role
             </h1>
           </div>
         </li>
       </ol>
     </nav>
     <div class="bg-white pt-16 w-full pb-20 px-4 sm:px-6 lg:pt-4 lg:pb-28 lg:px-8">
       <div class="relative max-w-lg mx-auto divide-y-2 divide-gray-200 lg:max-w-7xl">
         <div class="max-w-6xl">
           <h2 class="text-2xl tracking-tight font-extrabold text-gray-900 sm:text-2xl">Role Description</h2>
           <div class="flex justify-around pb-3">
             <div class="min-w-0 flex-1">
               <h3 class="text-base font-medium text-gray-900">
                  <span class="rounded-sm focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <a href="#" class="focus:outline-none">
                      <span class="absolute inset-0" aria-hidden="true" />
                      Name
                    </a>
                  </span>
               </h3>
               <p class="text-base text-gray-500">{{ role.name }}</p>
             </div>
             <div class="min-w-0 flex-1">
               <h3 class="text-base font-medium text-gray-900">
                  <span class="rounded-sm focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <a href="#" class="focus:outline-none">
                      <span class="absolute inset-0" aria-hidden="true" />
                      Role Type
                    </a>
                  </span>
               </h3>
               <p class="text-base text-gray-500">{{ role.roleType }}</p>
             </div>
           </div>
         </div>
         <div v-if="role.services">
           <h2 class="text-3xl tracking-tight pt-4 font-extrabold text-gray-900 sm:text-xl">Permissions</h2>
           <div class="mt-2 grid gap-16 pt-4 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
             <div class="border border-gray-300 rounded-md p-2" v-for="post in role.services" :key="post.id">
               <div>
               </div>
               <p class="text-xl font-semibold text-gray-900">
                 {{ post.clientId }}
               </p>
               <div v-for="permision in post.permissions">
                 <div class="flex justify-between ">
                   <p class="mt-3 text-xs text-gray-800">
                     name
                   </p>
                   <p class="mt-3 mx-2 text-xs text-gray-500">
                     {{ permision.name }}
                   </p>
                 </div>
                 <div class="flex justify-between">
                   <p class="mt-3 text-xs text-gray-800">
                     Role Type
                   </p>
                   <p class="mt-3 mx-2 text-xs text-gray-500">
                     {{ permision.roleType }}
                   </p>
                 </div>
                 <div class="flex justify-between">
                   <p class="mt-3 text-xs text-gray-800">
                     description
                   </p>
                   <p class="mt-3 text-xs text-gray-500">
                     {{ permision.description }}
                   </p>
                 </div>
               </div>

             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
  </template>

