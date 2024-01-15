<template>
  <div class="reporte-ventas-view">
    <ReporteVentas />
  </div>
</template>

<script>
// @ is an alias to /src
import ReporteVentas from "@/components/Venta/ReporteVentas.vue";
import { toast } from "vue3-toastify";

export default {
  name: "ReporteVentasView",
  components: {
    ReporteVentas,
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
