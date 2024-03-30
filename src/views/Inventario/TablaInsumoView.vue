<template>
  <div class="tabla-insumo-view">
    <TablaInsumo />
  </div>
</template>

<script>
// @ is an alias to /src
import TablaInsumo from "../../components/Inventario/TablaInsumo.vue";
import { toast } from "vue3-toastify";

export default {
  name: "TablaInsumoView",
  components: {
    TablaInsumo,
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
