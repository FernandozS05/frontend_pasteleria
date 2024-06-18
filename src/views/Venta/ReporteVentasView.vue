<template>
  <div class="row">
    <BarraNavegacion @cerrarSesion="cerrarSesion" />
  </div>
  <div class="row ms-4">
    <ReporteVentas v-bind:ventas="this.ventasFiltradas" />
  </div>
  <div class="row ms-4">
    <TablaVentas v-bind:ventas="this.ventasFiltradas" />
  </div>
</template>

<script>
// @ is an alias to /src
import BarraNavegacion from "@/components/Barras/BarraNavegacion.vue";
import ReporteVentas from "@/components/Venta/ReporteVentas.vue";
import TablaVentas from "@/components/Venta/TablaVentas.vue";
export default {
  name: "ReporteVentasView",
  components: {
    ReporteVentas,
    BarraNavegacion,
    TablaVentas
  },
  data() {
    return {
      ventas: [],
      ventasFiltradas: []
    }
  },
  methods: {
    formatearFechas() {
      this.ventas.forEach(venta => venta.fechaVenta = venta.fechaVenta.slice(0, 10));
      this.ventasFiltradas = this.ventas;
    }
    ,
    filtrarVentas(texto) {
      this.ventasFiltradas = this.ventas.filter((venta) =>
        venta.nombre.toLowerCase().includes(texto.toLowerCase())
      );
    },
    filtrarVentasFecha(fechas) {
      console.log(fechas);
      // Convertir las fechas de rango1 y rango2 a objetos Date
      const fechaInicio = new Date(fechas.inicio);
      const fechaFin = new Date(fechas.fin);

      // Filtrar las ventas que estén dentro del rango de fechas
      this.ventasFiltradas = this.ventas.filter((venta) => {
        const fechaVenta = new Date(venta.fechaVenta);
        return fechaVenta >= fechaInicio && fechaVenta <= fechaFin;
      });

      console.log(this.ventasFiltradas);
    }

  },
  mounted() {
  }
};
</script>
