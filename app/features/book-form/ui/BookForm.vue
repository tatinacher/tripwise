<script setup lang="ts">
import { useBooks, type BookDraft, type BookStatus } from '~/entities/book'
import { UiButton } from '~/shared/ui'

const props = defineProps<{ id?: string }>()

const router = useRouter()
const { getById, addBook, updateBook, ready } = useBooks()

const isEdit = computed(() => Boolean(props.id))

const form = reactive<BookDraft>({
  title: '',
  description: '',
  status: 'unread',
})

// Populate the form when editing an existing item.
watchEffect(() => {
  if (!isEdit.value || !ready.value || !props.id) return
  const book = getById(props.id)
  if (book) {
    form.title = book.title
    form.description = book.description
    form.status = book.status
  }
})

const canSave = computed(() => form.title.trim().length > 0)

function setStatus(status: BookStatus) {
  form.status = status
}

function onSubmit() {
  if (!canSave.value) return
  if (isEdit.value && props.id) updateBook(props.id, { ...form })
  else addBook({ ...form })
  router.push('/')
}

const inputClass =
  'w-full px-4 py-3.5 text-[17px] text-content bg-surface border border-line rounded-card outline-none focus:border-primary'
const labelClass = 'text-[15px] font-semibold text-muted'
const segBase = 'min-h-12 rounded-xl text-base font-semibold'
</script>

<template>
  <form class="flex flex-col gap-5" @submit.prevent="onSubmit">
    <label class="flex flex-col gap-2">
      <span :class="labelClass">Title</span>
      <input
        v-model="form.title"
        :class="inputClass"
        type="text"
        placeholder="e.g. The Pragmatic Programmer"
        autofocus
        enterkeyhint="done"
      />
    </label>

    <label class="flex flex-col gap-2">
      <span :class="labelClass">
        Description <em class="not-italic font-normal">(optional)</em>
      </span>
      <textarea
        v-model="form.description"
        :class="[inputClass, 'min-h-24 resize-y']"
        rows="4"
        placeholder="A short note…"
      />
    </label>

    <div class="flex flex-col gap-2">
      <span :class="labelClass">Status</span>
      <div class="grid grid-cols-2 gap-2 p-1.5 bg-surface border border-line rounded-card">
        <button
          type="button"
          :class="[segBase, form.status === 'unread' ? 'bg-primary text-primary-ink' : 'bg-transparent text-muted']"
          @click="setStatus('unread')"
        >
          Not read
        </button>
        <button
          type="button"
          :class="[segBase, form.status === 'read' ? 'bg-primary text-primary-ink' : 'bg-transparent text-muted']"
          @click="setStatus('read')"
        >
          Read
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-2.5 mt-2">
      <UiButton type="submit" variant="primary" block :disabled="!canSave">
        {{ isEdit ? 'Save changes' : 'Add to shelf' }}
      </UiButton>
      <UiButton to="/" variant="ghost" block>Cancel</UiButton>
    </div>
  </form>
</template>
