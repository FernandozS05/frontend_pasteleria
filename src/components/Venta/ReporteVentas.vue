<template>
  <div class="container position-absolute">
    <div class="row mb-25 mt-20">
      <div class="col-md-4">
        <GraficaBarras />
      </div>
      <div class="col-md-4">
        <GraficaLineas />
      </div>
      <div class="col-md-4">
        <GraficaCircular />
      </div>
    </div>

    <div class="row m-4 border border-4 rounded-4">
      <div  id="reporteVentas" class="col-md-12 aligh-items-center">
        <p class="fs-2 mt-1">Detalles de Ventas</p>
        <p class="fs-5">{{ `Total de ventas: $${this.totalVentas}` }}</p>
        <table  class="table table-bordered table-hover">
          <thead>
            <tr>
              <th>
                <p class="fs-6 fw-medium align-self-end">ID de la venta</p>
              </th>
              <th>
                <p class="fs-6 fw-medium align-self-end">Fecha</p>
              </th>
              <th>
                <p class="fs-6 fw-medium align-self-end">Estado</p>
              </th>
              <th>
                <p class="fs-6 fw-medium align-self-end">Total</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(venta, index) in ventas" :key="index">
              <td class="d-flex align-items-center">
                <img style="width:30px; height:30px" class="img-fluid mx-2" src="../../assets/cake-solid-24.png" alt="Icono de Venta" />
                <p class="fs-7 pt-2 lh-1" :title="venta.idVenta">
                  {{ venta.idVenta }}
                </p>
              </td>
              <td>
                <p class="fs-7">{{ venta.fechaVenta }}</p>
              </td>
              <td>
                <p class="fs-7">{{ venta.Pedido.estado }}</p>
              </td>
              <td>
                <p class="fs-7">{{ `$${venta.Pedido.total}` }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="row justify-content-center">
          <a class="col-6 btn btn-generar-reporte" href="#" role="button" @click="descargarPDF">Descargar reporte</a>
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
  name: "TablaVentas",
  props: {
    ventas: Array,
  },
  components: {
    GraficaBarras,
    GraficaLineas,
    GraficaCircular,
  },
  data() {
    return {
      detallesVenta: [],
      totalVentas: 0
    };
  },
  methods: {

    calcularTotal(){
      let total= 0;
      this.ventas.forEach( venta => total += parseInt(venta.Pedido.total));
      this.totalVentas = total;
    },
    descargarPDF() {
      const resumenVisitas = document.getElementById('reporteVentas');
      // Configuración de opciones para html2pdf
      const opciones = {
        margin: 0,
        filename: 'reporte_ventas.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
      };

      // Usar html2pdf para generar y descargar el PDF
      html2pdf(resumenVisitas, opciones);
      console.log("descargando datos...");
    },

    acortarTitulo(titulo, longitudMaxima) {
      if (titulo.length > longitudMaxima) {
        return titulo.slice(0, longitudMaxima) + "...";
      }
      return titulo;
    },
    filtrarPorNombreID(texto) {
      console.log("Filtrar por nombre o ID:", texto);
    },
    filtrarPorFecha(fecha) {
      console.log("Filtrar por fecha:", fecha);
    },
  },
  mounted(){
    this.calcularTotal()
  },
  watch :{
    ventas : "calcularTotal"
  }
};
</script>

<style scoped>
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
  width: 50%;
}

.btn-generar-reporte:hover {
  background-color: #f685ab;
  border-color: #f685ab;
}

.table {
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
}

.table th,
.table td {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}

.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
}

.table tbody+tbody {
  border-top: 2px solid #dee2e6;
}

.table .table {
  background-color: #fff;
}

.table .thead-dark th {
  color: #fff;
  background-color: #343a40;
  border-color: #454d55;
}

.table .thead-light th {
  color: #495057;
  background-color: #e9ecef;
  border-color: #dee2e6;
}

.btn-generar-reporte {
  background-color: #fe8092;
  border-color: #fe8092;
  color: #ffffff;
}

.btn-generar-reporte:hover {
  background-color: #f685ab;
  border-color: #f685ab;
}
</style>
