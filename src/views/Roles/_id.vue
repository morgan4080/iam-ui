<script setup lang="ts">
  import { getRole } from '@/modules/all'
  import { useRoute } from "vue-router"
  import {ref} from "vue";
  const posts = [
    {
      title: 'Boost your conversion rate',
      href: '#',
      category: { name: 'Article', href: '#', color: 'bg-indigo-100 text-indigo-800' },
      description:
          'Nullam risus blandit ac aliquam justo ipsum. Quam mauris volutpat massa dictumst amet. Sapien tortor lacus arcu.',
      date: 'Mar 16, 2020',
      datetime: '2020-03-16',
      author: {
        name: 'Paul York',
        href: '#',
        imageUrl:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      readingTime: '6 min',
    },
    {
      title: 'How to use search engine optimization to drive sales',
      href: '#',
      category: { name: 'Video', href: '#', color: 'bg-pink-100 text-pink-800' },
      description:
          'Nullam risus blandit ac aliquam justo ipsum. Quam mauris volutpat massa dictumst amet. Sapien tortor lacus arcu.',
      date: 'Mar 10, 2020',
      datetime: '2020-03-10',
      author: {
        name: 'Dessie Ryan',
        href: '#',
        imageUrl:
            'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      readingTime: '4 min',
    },
    {
      title: 'Improve your customer experience',
      href: '#',
      category: { name: 'Case Study', href: '#', color: 'bg-green-100 text-green-800' },
      description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ab iure iusto fugiat commodi sequi.',
      date: 'Feb 12, 2020',
      datetime: '2020-02-12',
      author: {
        name: 'Easer Collins',
        href: '#',
        imageUrl:
            'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      readingTime: '11 min',
    },
  ]
  const route = useRoute()

  const role = ref()
  getRole(route.params.id).then((r) => {
    role.value = r
  })
</script>
<!--<template>
  <div class="w-full">
    <div class="flex-col h-screen w-full overflow-y-auto pb-28" style="min-height: 640px;">
      <div class="px-4 sm:px-6 lg:mx-auto lg:px-8">
        <div class="py-3 md:flex md:justify-between lg:border-t lg:border-gray-200">
          <div class="flex-1 min-w-0">
            <div class="ml-3 flex items-center border-b border-gray-200">
              <h1 class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                Role Description
              </h1>
            </div>

            <div class="m-3">
              {{ JSON.stringify(role) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>-->

  <!-- This example requires Tailwind CSS v2.0+ -->
  <template>
    <div class="bg-white pt-16 w-full pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
      <div class="relative max-w-lg mx-auto divide-y-2 divide-gray-200 lg:max-w-7xl">
        <div class="max-w-6xl">
          <h2 class="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">Role Description</h2>
          <div class="flex justify-around">
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
          <h2 class="text-3xl tracking-tight pt-4 font-extrabold text-gray-900 sm:text-2xl">Permissions</h2>
          <div class="mt-2 grid gap-16 pt-4 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
            <div v-for="post in role.services" :key="post.id">
              <div>
              <span class='inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium'>
                {{ post.name }}
              </span>
              </div>
              <a :href="post.href" class="block mt-4">
                <p class="text-xl font-semibold text-gray-900">
                  {{ post.title }}
                </p>
                <p class="mt-3 text-base text-gray-500">
                  {{ post.description }}
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

