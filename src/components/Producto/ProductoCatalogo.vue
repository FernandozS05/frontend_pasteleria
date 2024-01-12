<template>
  <div class="producto">
    <img :src="imagen" :alt="nombre" />
    <h3>{{ nombre }}</h3>
    <p>Precio: {{ precio }}</p>
    <button @click="comprar">Comprar</button>
  </div>
</template>

<script>
export default {
  props: {
    nombre: {
      type: String,
      default: "",
    },
    imagen: {
      type: String,
      default: "",
    },
    precio: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    comprar() {
      this.$emit("comprarClick");
    },
  },
};
</script>

<style scoped>

</style>