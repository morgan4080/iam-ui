<template>
  <v-navigation-drawer
    v-model="drawer"
    style="background-color: hsla(210, 33%, 25%, 1)"
    class="text-white"
    location="left"
    width="230"
    :permanent="true"
  >
    <v-col>
      <!--      <v-img
        width="150"
        src="@/assets/presta-white-logo-full.png"
      />-->
      <h1 class="text-h6 pa-5 font-weight-regular">IAM</h1>
    </v-col>

    <v-spacer></v-spacer>

    <v-list
      :lines="false"
      :nav="true"
      class="px-4"
    >
      <template
        v-for="(item, i) in items"
        :key="i"
      >
        <v-list-group
          v-if="item.subItems.length > 0"
          :value="item"
          color="background"
          expand-icon="mdi:mdi-chevron-down"
          collapse-icon="mdi:mdi-chevron-up"
        >
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :value="item"
              color="background"
              :href="item.href"
              :prepend-icon="item.icon"
            >
              <v-list-item-title class="px-2">
                <span class="font-bold text-sm">{{ item.text }}</span>
              </v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item
            v-for="(it, index) in item.subItems"
            :key="index"
            :value="it"
            color="background"
            class="subItems"
            :to="it.href"
          >
            <v-list-item-title>
              <span class="font-normal text-sm">{{ it.text }}</span>
            </v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-item
          v-else
          :key="i"
          :value="item"
          color="background"
          :href="item.href"
          :prepend-icon="item.icon"
        >
          <v-list-item-title class="px-2">{{ item.text }}</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
  <v-app-bar
    prominent
    :elevation="0"
    color="surface"
    class="appBar"
  >
    <v-app-bar-nav-icon
      variant="text"
      style="color: #337ab7"
      @click.stop="drawer = !drawer"
    ></v-app-bar-nav-icon>

    <v-spacer></v-spacer>

    <v-menu transition="slide-y-transition">
      <template #activator="{ props }">
        <v-btn
          class="text-medium-emphasis v-btn--size-default text-body-2 px-3 text-capitalize"
          density="default"
          prepend-icon="mdi:mdi-account-circle-outline"
          append-icon="mdi:mdi-chevron-down"
          v-bind="props"
        >
          {{
            authStore.getLoggedInUser
              ? authStore.getLoggedInUser.companyName
              : "loading ..."
          }}
        </v-btn>
      </template>
      <v-sheet
        border
        rounded
      >
        <v-list
          :nav="true"
          density="compact"
          role="listbox"
        >
          <!--            <v-list-item
                        link
                        href="https://accounts.presta.co.ke/"
                        density="compact"
                      >
                        <template v-slot:prepend>
                          <v-icon icon="mdi:mdi-plus"></v-icon>
                        </template>
                        <v-list-item-title>Create Organisation</v-list-item-title>
                      </v-list-item>-->
        </v-list>
      </v-sheet>
    </v-menu>

    <v-menu transition="slide-y-transition">
      <template #activator="{ props }">
        <v-btn
          class="text-medium-emphasis v-btn--size-default text-body-2 px-3 text-capitalize"
          density="default"
          prepend-icon="mdi:mdi-account-circle-outline"
          append-icon="mdi:mdi-chevron-down"
          v-bind="props"
        >
          {{
            authStore.getLoggedInUser
              ? `${authStore.getLoggedInUser.firstName} ${authStore.getLoggedInUser.lastName}`
              : "loading.."
          }}
        </v-btn>
      </template>
      <v-sheet
        border
        rounded
      >
        <v-list
          :nav="true"
          density="compact"
          role="listbox"
        >
          <v-list-subheader
            title="ACCOUNT"
            class="text-high-emphasis text-uppercase font-weight-black"
          />
          <v-list-item
            :link="true"
            href="https://accounts.presta.co.ke/"
            title="Approval Requests"
            density="compact"
          >
          </v-list-item>
          <v-list-item
            :link="true"
            href="https://accounts.presta.co.ke/"
            title="Profile"
            density="compact"
          >
          </v-list-item>
          <v-list-item
            :link="true"
            href="https://accounts.presta.co.ke/"
            :title="
              authStore.getLoggedInUser
                ? `Account No. ${authStore.getLoggedInUser.tenantId}`
                : 'loading..'
            "
            density="compact"
          >
          </v-list-item>
          <v-list-item
            :link="true"
            href="https://accounts.presta.co.ke/"
            title="Version (Staging)"
            density="compact"
          >
          </v-list-item>

          <v-divider class="my-3 mb-4" />

          <v-list-item
            :link="true"
            href="https://accounts.presta.co.ke/"
            density="compact"
          >
            <template #append>
              <v-icon icon="mdi:mdi-logout-variant"></v-icon>
            </template>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-menu>

    <v-menu>
      <template #activator="{ props: menu }">
        <v-tooltip location="bottom">
          <template #activator="{ props: tooltip }">
            <v-btn
              icon="mdi:mdi-dots-grid"
              v-bind="mergeProps(menu, tooltip)"
            >
              <v-icon />
            </v-btn>
          </template>
          <span>Presta Applications</span>
        </v-tooltip>
      </template>
      <v-sheet
        border
        rounded
      >
        <v-list
          :nav="true"
          density="compact"
          role="listbox"
        >
          <v-list-subheader
            title="Presta Applications"
            class="text-high-emphasis text-uppercase font-weight-black"
          />

          <v-list-item
            :link="true"
            href="https://accounts.presta.co.ke/"
            title="Account Home"
            density="compact"
          >
            <template #append>
              <v-icon icon="mdi:mdi-account-arrow-left"></v-icon>
            </template>
          </v-list-item>

          <v-list-item
            :link="true"
            href="https://accounts.presta.co.ke/"
            title="Presta Pay"
            density="compact"
          >
            <template #append>
              <v-icon icon="mdi:mdi-cash-sync"></v-icon>
            </template>
          </v-list-item>

          <v-list-item
            :link="true"
            href="https://accounts.presta.co.ke/"
            title="Appraisal"
            density="compact"
          >
            <template #append>
              <v-icon icon="mdi:mdi-text-box-check"></v-icon>
            </template>
          </v-list-item>

          <v-list-item
            :link="true"
            href="https://accounts.presta.co.ke/"
            title="Calculator"
            density="compact"
          >
            <template #append>
              <v-icon icon="mdi:mdi-calculator"></v-icon>
            </template>
          </v-list-item>

          <v-list-item
            :link="true"
            href="https://accounts.presta.co.ke/"
            title="IAM"
            density="compact"
          >
            <template #append>
              <v-icon icon="mdi:mdi-account-cog"></v-icon>
            </template>
          </v-list-item>

          <v-list-item
            :link="true"
            href="https://accounts.presta.co.ke/"
            title="Analytics"
            density="compact"
          >
            <template #append>
              <v-icon icon="mdi:mdi-chart-bar-stacked"></v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-menu>
  </v-app-bar>
  <v-overlay
    v-model="authStore.getAuthPrompt"
    :contained="true"
    class="pt-16 align-start justify-center"
    scroll-strategy="block"
  >
    <v-card
      class="pa-2 mt-8"
      width="550"
    >
      <v-card-title class="text-subtitle-2"
        >Please Login To Continue</v-card-title
      >
      <v-card-text>
        <v-divider></v-divider>
        <v-img
          class="pa-12 mx-auto"
          width="150"
          src="@/assets/presta_logo.png"
        />
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn
          class="bg-green-lighten-1 w-100"
          @click="redirectAuth"
          >Click here to login</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>

<script lang="ts" setup>
import { mergeProps, ref } from "vue";
import { useBreakpoints } from "@vueuse/core";
import { useAuthStore } from "@/store/auth-store";

const appRoot = import.meta.env.VITE_APP_ROOT;

const authStore = useAuthStore();

const breakpoints = useBreakpoints({
  mobile: 320,
  tablet: 600,
  laptop: 960,
  desktop: 1280,
  large_desktop: 1920,
  extra_large_desktop: 2560,
});

const mobile = breakpoints.between("mobile", "tablet");

const drawer = ref(!mobile.value);

const items = ref<
  {
    text: string;
    href: string;
    icon: string;
    subItems: { text: string; href: string }[];
  }[]
>([
  {
    text: "Home",
    icon: "",
    href: "#",
    subItems: [
      {
        text: "Dashboard",
        href: "/",
      },
      {
        text: "Activity Log",
        href: "/dashboard#activity-logs",
      },
    ],
  },
  {
    text: "Access Management",
    icon: "",
    href: "#",
    subItems: [
      {
        text: "Users",
        href: "/users",
      },
      {
        text: "Roles",
        href: "/roles",
      },
    ],
  },
]);

const redirectAuth = () => {
  authStore.setAuthPrompt(false);
  const currentUrl = window.location.href;
  window.location.href = `${appRoot}?redirect_url=${currentUrl}`;
};
</script>

<style scoped>
/*.subItems:before {
  background: #425668;
  bottom: auto;
  content: "";
  height: 8px;
  left: 15px;
  margin-top: 0;
  position: absolute;
  right: auto;
  width: 8px;
  z-index: 1;
  border-radius: 50%;
}

.subItems:after {
  border-left: 1px solid #425668;
  bottom: 0;
  content: "";
  left: 19px;
  height: 36px;
  position: absolute;
  top: 0;
}*/
</style>
