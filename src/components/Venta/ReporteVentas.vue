<template>
  <div id="reporteVentas">
    <div class="reporte-ventas">
      <div class="graficas" ref="graficas">
        <GraficaBarras />
        <GraficaLineas />
        <GraficaCircular />
      </div>
      <div class="detalles-venta">
        <h2>Detalles de Ventas</h2>
        <table id="detallesVentaTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detalle in detallesVenta" :key="detalle.id">
              <td>{{ detalle.id }}</td>
              <td>{{ detalle.producto }}</td>
              <td>{{ detalle.cantidad }}</td>
              <td>{{ detalle.precioUnitario }}</td>
              <td>{{ detalle.total }}</td>
            </tr>
          </tbody>
        </table>

        <button
          @click="descargarPDF"
          class="btn btn-primary btn-generar-reporte"
        >
          Descargar PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import GraficaBarras from "@/components/Venta/GraficaBarras.vue";
import GraficaLineas from "@/components/Venta/GraficaLineas.vue";
import GraficaCircular from "@/components/Venta/GraficaCircular.vue";
import html2pdf from "html2pdf.js";

export default {
  components: {
    GraficaBarras,
    GraficaLineas,
    GraficaCircular,
  },
  data() {
    return {
      detallesVenta: [],
    };
  },
  methods: {
    descargarPDF() {
      var element = document.getElementById("reporteVentas");
      html2pdf(element);
      var opt = {
        margin: 1,
        filename: "reporteVentas.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      html2pdf().from(element).set(opt).save();
    },
  },
};
</script>

<style scoped>
.reporte-ventas {
  display: flex;
  justify-content: space-between;
}

.graficas {
  width: 50%;
}

.detalles-venta {
  width: 50%;
  margin-top: 10px;
  padding-right: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.btn-generar-reporte {
  background-color: #fe8092;
  border-color: #fe8092;
  color: #ffffff;
  cursor: pointer;
  padding: 10px;
}

.btn-generar-reporte:hover {
  background-color: #f685ab;
  border-color: #f685ab;
}
</style>
