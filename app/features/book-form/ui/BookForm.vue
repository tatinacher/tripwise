<script setup lang="ts">
import { useBooks, type BookDraft, type BookStatus } from '~/entities/book'
import { ScannerModal } from '~/features/scan-book'
import { lookupBookByIsbn } from '~/shared/api'
import { UiButton } from '~/shared/ui'

const props = defineProps<{ id?: string }>()

const router = useRouter()
const route = useRoute()
const { getById, addBook, updateBook, ready } = useBooks()

const isEdit = computed(() => Boolean(props.id))

const form = reactive<BookDraft>({
  title: '',
  author: '',
  isbn: '',
  description: '',
  status: 'unread',
})

const showScanner = ref(false)
const isLookingUp = ref(false)
const lookupError = ref<string | null>(null)

// Populate the form when editing an existing item.
watchEffect(() => {
  if (!isEdit.value || !ready.value || !props.id) return
  const book = getById(props.id)
  if (book) {
    form.title = book.title
    form.author = book.author
    form.isbn = book.isbn
    form.description = book.description
    form.status = book.status
  }
})

// Arriving via the "Scan" home action opens the scanner right away.
onMounted(() => {
  if (route.query.scan === '1') showScanner.value = true
})

const canSave = computed(() => form.title.trim().length > 0)

function setStatus(status: BookStatus) {
  form.status = status
}

async function onDetected(isbn: string) {
  showScanner.value = false
  form.isbn = isbn
  lookupError.value = null
  isLookingUp.value = true
  try {
    const result = await lookupBookByIsbn(isbn)
    if (!result) {
      lookupError.value = 'No book found for this ISBN. Fill in the details manually.'
      return
    }
    if (result.title) form.title = result.title
    if (result.author) form.author = result.author
    if (result.description && !form.description) form.description = result.description
  } finally {
    isLookingUp.value = false
  }
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
        Author <em class="not-italic font-normal">(optional)</em>
      </span>
      <input
        v-model="form.author"
        :class="inputClass"
        type="text"
        placeholder="e.g. David Thomas"
        enterkeyhint="next"
      />
    </label>

    <div class="flex flex-col gap-2">
      <span :class="labelClass">
        ISBN <em class="not-italic font-normal">(optional)</em>
      </span>
      <div class="flex gap-2">
        <input
          v-model="form.isbn"
          :class="[inputClass, 'grow']"
          type="text"
          inputmode="numeric"
          placeholder="e.g. 9780135957059"
          enterkeyhint="done"
        />
        <UiButton type="button" variant="ghost" @click="showScanner = true">📷 Scan</UiButton>
      </div>
      <p v-if="isLookingUp" class="text-[13px] text-muted">Looking up book details…</p>
      <p v-else-if="lookupError" class="text-[13px] text-danger">{{ lookupError }}</p>
    </div>

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

  <ScannerModal v-if="showScanner" @detected="onDetected" @close="showScanner = false" />
</template>
