<template>
  <div>
    <button class="btn btn-primary btn-generar-reporte" @click="generarReporte">
      Generar Reporte
    </button>
  </div>
  <div>
    <table class="table table-bordered table-hover">
      <thead>
        <tr>
          <th>
            <p class="fs-5 fw-medium align-self-end">Nombre/ID de la venta</p>
          </th>
          <th>
            <p class="fs-5 fw-medium align-self-end">Fecha de Venta</p>
          </th>
          <th>
            <p class="fs-5 fw-medium align-self-end">Cantidad</p>
          </th>
          <th>
            <p class="fs-5 fw-medium align-self-end">Precio Total</p>
          </th>
          <th>
            <p class="fs-5 fw-medium align-self-end">Tipo de Entrega</p>
          </th>
          <th>
            <p class="fs-5 fw-medium align-self-end">Estado de la Venta</p>
          </th>
          <th>
            <p class="fs-5 fw-medium align-self-end">Información Adicional</p>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(venta, index) in ventas" :key="index">
          <td class="d-flex align-items-center">
            <img
              class="img-fluid mx-2"
              src="../../assets/icono-pedido.png"
              alt="Icono de Venta"
            />
            <p class="fs-5" :title="venta.titulo">
              {{ acortarTitulo(venta.titulo, 20) }}
            </p>
          </td>
          <td>
            <p class="fs-5">{{ venta.fechaVenta }}</p>
          </td>
          <td>
            <p class="fs-5">{{ venta.cantidad }}</p>
          </td>
          <td>
            <p class="fs-5">{{ venta.precioTotal }}</p>
          </td>
          <td>
            <p class="fs-5">{{ venta.tipoEntrega }}</p>
          </td>
          <td>
            <p class="fs-5">{{ venta.estadoVenta }}</p>
          </td>
          <td>
            <p class="fs-5">{{ venta.informacionAdicional }}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "TablaVentas",
  props: {
    ventas: Array,
  },
  data() {
    return {};
  },
  methods: {
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
    generarReporte() {
      console.log("Generar Reporte");
      this.$router.push("/reportes");
    },
  },
};
</script>

<style scoped>
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

.table tbody + tbody {
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
