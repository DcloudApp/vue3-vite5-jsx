<script setup>
const router = useRouter()
const name = ref(222)
function go() {
  if (name.value)
    router.push(`/hi/${encodeURIComponent(name.value)}`)
}
</script>

<template>
  <div>
    <main>
      222331231
      <div>
        <button
          btn m-3 text-sm
          :disabled="!name"
          @click="go"
        >
          go
        </button>
      </div>
    </main>
  </div>
</template>
