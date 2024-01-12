<template>
  <div class="catalogo-pasteles-view">
    <CatalogoPasteles />
  </div>
</template>

<script>
// @ is an alias to /src
import CatalogoPasteles from "@/components/Catalogo/CatalogoPasteles.vue";
import { toast } from "vue3-toastify";

export default {
  name: "CatalogoPastelesView",
  components: {
    CatalogoPasteles,
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
