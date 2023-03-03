<script setup lang="ts">
import { getRoles, getUsers } from "@/modules/all";
import { ref, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
// defineProps<{ user: object }>()

const user = computed(() => {
  return store.state.user ? store.state.user : null;
});

const userCount = ref(0);

const roleCount = ref(0);

const query = ref(<string>"?order=ASC&sort=ASC&pageSize=1");

getUsers(query.value)
  .then((data: { totalRecords: number }) => {
    userCount.value = data.totalRecords;
  })
  .catch((e: any) => {
    alert(e.message);
  });

getRoles()
  .then(({ totalRecords }) => {
    roleCount.value = totalRecords;
  })
  .catch((e: any) => {
    alert(e.message);
  });
</script>
<template>
  <div
    class="flex-col h-screen w-full overflow-y-auto pb-28"
    style="min-height: 640px"
  >
    <div class="px-4 sm:px-6 lg:mx-auto lg:px-8">
      <div
        class="py-3 md:flex md:justify-between lg:border-t lg:border-gray-200"
      >
        <div class="flex-1 min-w-0">
          <div class="ml-3 flex items-center border-b border-gray-200">
            <h1
              class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate"
            >
              IAM Resources
            </h1>
          </div>
          <div class="ml-3 mt-4 text-sm block">
            <div class="text-xs opacity-75 flex space-x-16">
              <router-link
                to="/users"
                class="flex text-blue-600"
                ><span class="pr-3">Users:</span> {{ userCount }}</router-link
              >
              <router-link
                to="/roles"
                class="flex text-blue-600"
                ><span class="pr-3">Roles:</span> {{ roleCount }}</router-link
              >
            </div>
          </div>
          <div class="ml-3 mt-4 text-sm block hidden">
            <div class="font-normal border-b border-gray-200 py-2">
              Best practices
            </div>
            <div class="text-xs pt-3 opacity-75 flex space-x-16">
              <ul
                class="space-y-1 list-disc list-inside"
                role="list"
              >
                <li>Quis elit egestas venenatis mattis dignissim.</li>
                <li>
                  Cras cras lobortis vitae vivamus ultricies facilisis tempus.
                </li>
                <li>Orci in sit morbi dignissim metus diam arcu pretium.</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="flex-1 min-w-0 pt-6 sm:pt-0 max-w-xs md:pl-8">
          <div class="ml-3 flex items-center border-b border-gray-200">
            <h1
              class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate"
            >
              Additional information
            </h1>
          </div>
          <div class="ml-3 text-sm block">
            <div class="text-xs pt-3 opacity-75 space-y-2">
              <a
                href="https://support.presta.co.ke/portal/en/home"
                rel="noopener noreferrer"
                target="_blank"
                class="flex text-blue-600"
                >IAM documentation</a
              >
              <a
                href="https://support.presta.co.ke/portal/en/home"
                rel="noopener noreferrer"
                target="_blank"
                class="flex text-blue-600"
                >Additional resources</a
              >
            </div>
          </div>
          <div class="ml-3 mt-4 text-sm block">
            <div class="font-normal border-b border-gray-200 py-2">
              Quick links
            </div>
            <div class="text-xs pt-2 opacity-75 flex flex-col space-y-2">
              <a
                href="https://www.presta.co.ke/contact-us"
                rel="noopener noreferrer"
                target="_blank"
                class="flex text-blue-600"
                >Contact us</a
              >
              <a
                href="https://support.presta.co.ke/portal/en/home"
                rel="noopener noreferrer"
                target="_blank"
                class="flex text-blue-600"
                >Support</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
