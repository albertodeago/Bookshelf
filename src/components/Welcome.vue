<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'Welcome',
})
</script>

<template>
  <div class="greetings">
    <h1 class="green">Welcome to Bookshelf!</h1>
    <h3>
      Here you can create an ephemeral (i) book and share it with other people.
      <br />
      To create a book, click <RouterLink to="/create" class="green">here</RouterLink>.
    </h3>
  </div>
</template>

<style scoped>
</style>
