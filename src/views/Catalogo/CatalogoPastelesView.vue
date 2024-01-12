<template>
  <div class="catalogo-pasteles-view">
    <CatalogoPasteles />
  </div>
</template>

<script>
// @ is an alias to /src
import CatalogoPasteles from "@/components/Catalogo/CatalogoPasteles.vue";

export default {
  name: "CatalogoPastelesView",
  components: {
    CatalogoPasteles,
  },
  methods: {},
};
</script>
