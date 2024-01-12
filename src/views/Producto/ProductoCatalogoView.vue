<template>
  <div class="produto-catalogo-view">
    <ProductoCatalogo />
  </div>
</template>

<script>
// @ is an alias to /src
import ProductoCatalogo from "@/components/Producto/ProductoCatalogo.vue";

export default {
  name: "ProductoCatalogoView",
  components: {
    ProductoCatalogo,
  },
  methods: {},
};
</script>
