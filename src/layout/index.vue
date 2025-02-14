<script setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <div>
    <header className="w-full flex flex-col items-center justify-center">
      <img
        alt="Vue logo"
        className="mt-10"
        src="@/assets/logo.svg"
        width="125"
        height="125"
      >
      <div className="py-10">
        <nav>
          <RouterLink to="/">
            Home
          </RouterLink>
          <RouterLink to="/About">
            About
          </RouterLink>
        </nav>
      </div>
    </header>
    <button
      className="m-auto my-10 w-fit flex btn"
      @click="toggleDark()"
    >
      <span className="i-icon-mic h-14px w-14px" />
    </button>
    <HelloWorld />
    <RouterView />
  </div>
</template>
