<script setup lang="ts">
import { ref } from 'vue'
import { FileUp } from 'lucide-vue-next'

const emits = defineEmits<{
  fileUploaded: [file: File]
}>()
const file = ref<HTMLInputElement | null>(null)
function handleFileUpload() {
  if (file.value?.files)
    emits('fileUploaded', file.value.files[0])
}
</script>

<template>
  <div h-5rem w-full flex border="~ dashed" rounded-md>
    <label for="file" h-full w-full flex cursor-pointer items-center justify-center text-sm text-secondary-foreground>
      <input id="file" ref="file" type="file" hidden @change="handleFileUpload">
      <div flex gap-2>
        <FileUp class="h-5 w-5" />
        <span>Upload Your Dataset</span>
      </div>
    </label>
  </div>
</template>

<style scoped></style>
