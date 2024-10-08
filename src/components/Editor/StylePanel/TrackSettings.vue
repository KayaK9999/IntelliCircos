<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useMouseInElement } from '@vueuse/core'
import type { MaybeElementRef } from '@vueuse/core'
import SettingsPanel from './SettingsPanel.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { hexColorSchema } from '@/lib/zodSchema'

import { useInteractionStore } from '@/stores/interaction'

// Form data
const props = defineProps<{
  trackTitle: string
  trackId: string
  r0: number
  r1: number
}>()

const isOpen = ref(false)
const trackSettingSchema = toTypedSchema(z.object({
  trackTitle: z.string().default(props.trackTitle),
  c0: z.number().min(0).step(1).max(100).default(props.r0),
  c1: z.number().min(0).step(1).max(100).default(props.r1),
  stroke: z.number().min(0).step(1).max(5).default(1),
  fill: hexColorSchema.default('#000000'),
}))
const form = useForm({
  validationSchema: trackSettingSchema,
})
const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
})

// interactions
const panelRef = ref<MaybeElementRef>(null)
const { isOutside } = useMouseInElement(panelRef)
const interactionStore = useInteractionStore()

let lineId: null | string = null
watchEffect(() => {
  if (!isOutside.value) {
    interactionStore.setActiveTrackId(props.trackId)
    if (panelRef.value === null)
      return
    const svgElement = document.querySelector(`[data-track-id="${props.trackId}"]`) as HTMLElement
    if (svgElement)
      lineId = interactionStore.addGuideLineFromElement(svgElement, panelRef)
  }
  else {
    interactionStore.removeActiveTrackId(props.trackId)
    if (lineId !== null) {
      interactionStore.removeGuideLine(lineId)
      lineId = null
    }
  }
})
</script>

<template>
  <SettingsPanel
    ref="panelRef" v-model:open="isOpen" :panel-title="`Track ${props.trackTitle}`" class="rounded-md"
    :class="{
      // 'outline outline-border': !isOutside,
    }"
  >
    <form class="space-y-2" @submit.prevent="onSubmit">
      <FormField v-slot="{ componentField }" name="trackTitle">
        <FormItem>
          <FormLabel>Track title</FormLabel>
          <FormControl>
            <Input v-bind="componentField" type="text" />
          </FormControl>
          <FormDescription>
            The title of the track
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="c0">
        <FormItem>
          <FormLabel>Start</FormLabel>
          <FormControl>
            <Input v-bind="componentField" type="number" />
          </FormControl>
          <FormDescription>
            The start of the track in percentage
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="c1">
        <FormItem>
          <FormLabel>End</FormLabel>
          <FormControl>
            <Input v-bind="componentField" type="number" />
          </FormControl>
          <FormDescription>
            The end of the track in percentage
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="stroke">
        <FormItem>
          <FormLabel>Stroke</FormLabel>
          <FormControl>
            <Input v-bind="componentField" type="number" />
          </FormControl>
          <FormDescription>
            The stroke of the track
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="fill">
        <FormItem>
          <FormLabel>Fill</FormLabel>
          <FormControl>
            <Input v-bind="componentField" type="color" />
          </FormControl>
          <FormDescription>
            The fill of the track
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <div flex="~ wrap" gap-2>
        <Button type="submit" size="sm" flex-1>
          Save
        </Button>
        <Button variant="destructive" size="sm" flex-1>
          Remove
        </Button>
      </div>
    </form>
  </SettingsPanel>
</template>
