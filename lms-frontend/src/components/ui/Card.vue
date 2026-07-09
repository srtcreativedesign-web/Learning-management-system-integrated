<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div v-if="$slots.header" class="mb-4 pb-4 border-b border-gray-50 flex justify-between items-center">
      <slot name="header"></slot>
    </div>
    
    <div>
      <slot></slot>
    </div>

    <div v-if="$slots.footer" class="mt-6 pt-4 border-t border-gray-50 flex justify-end gap-3">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// Dumb UI Component: Card container
</script>
