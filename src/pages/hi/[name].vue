<script setup>
const router = useRouter()
const route = useRoute()
</script>

<template>
  <div>
    <div text-4xl>
      <div inline-block />
    </div>
    <p>
      {{ route.params.name }}
    </p>

    <div>
      <button
        m="3 t6" text-sm btn
        @click="router.back()"
      >
        back
      </button>
    </div>
  </div>
</template>
