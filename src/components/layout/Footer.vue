<script setup lang="ts">
import { RouterLink } from 'vue-router'

const currentYear = new Date().getFullYear()

const footerLinks = {
  product: [
    { name: 'Browse', href: '/browse' },
    { name: 'Audio', href: '/audio' },
    { name: 'Meditate', href: '/meditate' },
    { name: 'Experts', href: '/experts' }
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/read' },
    { name: 'Support', href: '/support' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms' }
  ]
}
</script>

<template>
  <footer class="bg-gray-900 text-gray-300">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-1">
          <RouterLink to="/" class="text-xl font-bold text-white">
            Soul Shapers
          </RouterLink>
          <p class="mt-4 text-sm text-gray-400">
            Transform your mind, body, and soul with expert-led coaching and mindfulness practices.
          </p>
        </div>

        <!-- Product Links -->
        <div>
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Product
          </h3>
          <ul class="space-y-2">
            <li v-for="link in footerLinks.product" :key="link.name">
              <RouterLink
                :to="link.href"
                class="text-sm hover:text-white transition-colors"
              >
                {{ link.name }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Company Links -->
        <div>
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Company
          </h3>
          <ul class="space-y-2">
            <li v-for="link in footerLinks.company" :key="link.name">
              <RouterLink
                :to="link.href"
                class="text-sm hover:text-white transition-colors"
              >
                {{ link.name }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Legal Links -->
        <div>
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Legal
          </h3>
          <ul class="space-y-2">
            <li v-for="link in footerLinks.legal" :key="link.name">
              <RouterLink
                :to="link.href"
                class="text-sm hover:text-white transition-colors"
              >
                {{ link.name }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-12 pt-8 border-t border-gray-800">
        <p class="text-sm text-gray-400 text-center">
          &copy; {{ currentYear }} Soul Shapers Studio. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
