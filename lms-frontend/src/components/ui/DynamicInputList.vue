<template>
  <div class="space-y-3">
    <div 
      v-for="(item, index) in modelValue" 
      :key="index"
      class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
    >
      <!-- Correct Answer Indicator (Radio for single choice, Checkbox for multiple) -->
      <button 
        @click="markCorrect(index)"
        type="button"
        class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
        :class="item.is_correct ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-white'"
      >
        <span v-if="item.is_correct" class="material-symbols-outlined text-[14px]">check</span>
      </button>

      <!-- Input Field -->
      <input 
        v-model="item.text"
        type="text" 
        class="flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm"
        :placeholder="`Opsi ${String.fromCharCode(65 + index)}`"
      />

      <!-- Remove Button -->
      <button 
        v-if="modelValue.length > 2"
        @click="removeOption(index)"
        type="button"
        class="text-gray-400 hover:text-red-500 transition-colors p-1"
      >
        <span class="material-symbols-outlined text-[20px]">close</span>
      </button>
    </div>

    <button 
      @click="addOption"
      type="button"
      class="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 mt-2"
    >
      <span class="material-symbols-outlined text-[18px]">add</span>
      Tambah Opsi
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

export interface OptionItem {
  text: string
  is_correct: boolean
}

const props = defineProps<{
  modelValue: OptionItem[]
  type?: 'MULTIPLE_CHOICE' | 'MULTIPLE_ANSWER' | 'TRUE_FALSE'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: OptionItem[]): void
}>()

const updateValue = (newValue: OptionItem[]) => {
  emit('update:modelValue', newValue)
}

const markCorrect = (index: number) => {
  const newOptions = [...props.modelValue]
  
  if (props.type === 'MULTIPLE_CHOICE' || props.type === 'TRUE_FALSE') {
    // Single answer mode: uncheck others
    newOptions.forEach((opt, i) => {
      opt.is_correct = i === index
    })
  } else {
    // Multiple answer mode: toggle
    newOptions[index].is_correct = !newOptions[index].is_correct
  }
  
  updateValue(newOptions)
}

const removeOption = (index: number) => {
  const newOptions = props.modelValue.filter((_, i) => i !== index)
  updateValue(newOptions)
}

const addOption = () => {
  updateValue([...props.modelValue, { text: '', is_correct: false }])
}
</script>
