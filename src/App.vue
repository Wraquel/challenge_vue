<template>
  <div id="app">
    <NextEvents />
  </div>
</template>

<script>
import NextEvents from "./components/NextEvents.vue";

export default {
  name: "App",
  components: {
    NextEvents,
  },
  mounted() {
    this.$store.dispatch("getEvents");
  },
};
</script>

<style>
#app {
  font-family: "Roboto", sans-serif;
  margin-top: 60px;
  text-align: center;
  padding: 0;
}
</style>
