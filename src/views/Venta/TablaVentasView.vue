<template>
  <div class="tabla-ventas-view">
    <div class="row">
      <p class="col-6 fs-4 align-items-start fw-medium subtitulo"></p>
      <BarraBusqueda
        class="col-6 align-items-center"
        :placeholder="Buscar"
        @filtrarVentas="filtrarVentas"
      />
    </div>
    <div class="row">
      <p class="col-6 fs-4 align-items-start fw-medium subtitulo"></p>
      <BarraFecha
        class="col-6 align-items-center"
        :placeholder="Buscar"
        @filtrarVentasFecha="filtrarVentasFecha"
      />
    </div>
    <TablaVentas />
  </div>
</template>

<script>
// @ is an alias to /src
import TablaVentas from "@/components/Venta/TablaVentas.vue";
import BarraBusqueda from "../../components/Barras/BarraBusqueda.vue";
import BarraFecha from "../../components/Barras/BarraFecha.vue";
import { toast } from "vue3-toastify";

export default {
  name: "TablaVentasView",
  components: {
    TablaVentas,
    BarraBusqueda,
    BarraFecha,
  },
  methods: {
    notify() {
      toast("Wow so easy !", {
        autoClose: 1000,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    },
    filtrarVentas(texto) {
      this.ventasFiltradas = this.ventas.filter((venta) =>
        venta.nombre.toLowerCase().includes(texto.toLowerCase())
      );
    },
    filtrarVentasFecha(texto) {
      this.ventasFiltradas = this.ventas.filter((venta) =>
        venta.nombre.toLowerCase().includes(texto.toLowerCase())
      );
    },
  },
};
</script>
