<script setup lang="ts">
// Shared button. Renders a <NuxtLink> when `to` is set, otherwise a <button>.
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost'
    block?: boolean
    type?: 'button' | 'submit'
    to?: string
    disabled?: boolean
  }>(),
  { variant: 'primary', block: false, type: 'button' },
)

const base =
  'inline-flex items-center justify-center gap-2 min-h-[52px] px-5 rounded-card text-[17px] font-semibold transition-transform active:scale-[0.97] disabled:opacity-40'

const variants = {
  primary: 'bg-primary text-primary-ink',
  ghost: 'bg-surface-2 text-content',
}

const classes = computed(() => [
  base,
  variants[props.variant],
  props.block && 'w-full',
])
</script>

<template>
  <NuxtLink v-if="to" :to="to" :class="classes">
    <slot />
  </NuxtLink>
  <button v-else :class="classes" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>
