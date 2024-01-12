<template>
  <div class="produto-catalogo-view">
    <ProductoCatalogo />
  </div>
</template>

<script>
// @ is an alias to /src
import ProductoCatalogo from "@/components/Producto/ProductoCatalogo.vue";
import { toast } from "vue3-toastify";

export default {
  name: "ProductoCatalogoView",
  components: {
    ProductoCatalogo,
  },
  methods: {
    notify() {
      toast("Wow so easy !", {
        autoClose: 1000,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    },
  },
};
</script>
