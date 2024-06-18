<template>
  <div class="row mt-3 border rounded border-4">
    <div class="row align-items-center my-3">
      <div class="col-3">
        <p class="fs-4 fw-medium">Registros de ventas</p>
      </div>
      <div class="col-5 mt-1">
        <p class="fs-5">
          {{ !fechaFinalActual ? `Datos obtenidos del día ${formatFechaSoloFecha(fechaDesdeActual)}` : `Datos obtenidos desde ${formatFechaSoloFecha(fechaDesdeActual)} hasta ${formatFechaSoloFecha(fechaFinalActual)}` }}
        </p>
      </div>
      <div class="col-4">
        <button class="btn btn-primary btn-sm" @click="consultarFechas">Cambiar rango</button>
      </div>
    </div>
    <div class="row align-items-center my-3">
      <div class="col-12">
        <p class="fs-5 fw-medium">Total de ventas en el periodo: {{ formatMoneda(totalVentas) }}</p>
      </div>
    </div>
  </div>
  <div>
    <div class="row align-items-center my-3 mx-3">
      <table class="table table-bordered table-hover">
        <thead>
          <tr>
            <th><p class="fs-5 fw-medium align-self-end">Fecha</p></th>
            <th><p class="fs-5 fw-medium align-self-end">Concepto</p></th>
            <th><p class="fs-5 fw-medium align-self-end">ID del Pedido</p></th>
            <th><p class="fs-5 fw-medium align-self-end">Lugar</p></th>
            <th><p class="fs-5 fw-medium align-self-end">Productos</p></th>
            <th><p class="fs-5 fw-medium align-self-end">Total</p></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(venta, index) in ventas" :key="index">
            <td class="d-flex align-items-center">
              <p class="fs-5">{{ formatFecha(venta.fecha) }}</p>
            </td>
            <td>
              <p class="fs-5">{{ venta.concepto }}</p>
            </td>
            <td>
              <p class="fs-5">
                <template v-if="venta.concepto !== 'Venta en inventario.' && venta.id_pedido">
                  <router-link :to="`/elementoPedido/${venta.id_pedido}`">{{ venta.id_pedido }}</router-link>
                </template>
                <template v-else>
                  N/A
                </template>
              </p>
            </td>
            <td>
              <p class="fs-5">{{ venta.tipo }}</p>
            </td>
            <td>
              <button type="button" class="btn btn-primary btn-sm" @click="verProductos(venta)">
                Ver
              </button>
            </td>
            <td>
              <p class="fs-5">{{ formatMoneda(venta.total) }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import axios from "@/config/axios.js";
import moment from 'moment-timezone';

export default {
  name: "TablaVentas",
  data() {
    return {
      fechaDesdeActual: "2024-06-01",
      fechaFinalActual: "2024-06-30",
      fechaDesde: "2024-06-01",
      fechaFinal: "2024-06-30",
      ventas: [],
      totalVentas: 0,
    }
  },
  methods: {
    formatFecha(fecha) {
      return moment(fecha).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
    },
    formatFechaSoloFecha(fecha) {
      return moment(fecha).tz('America/Mexico_City').format('YYYY-MM-DD');
    },
    formatMoneda(valor) {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor);
    },
    async consultarFechas() {
      try {
        const { value: formValues } = await Swal.fire({
          title: 'Selecciona un rango de fechas',
          html: '<label for="swal-input1">Fecha Inicio:</label>' +
                '<input id="swal-input1" type="date" class="swal2-input">' +
                '<label for="swal-input2">Fecha Fin:</label>' +
                '<input id="swal-input2" type="date" class="swal2-input">',
          focusConfirm: false,
          confirmButtonText: 'Consultar',
          preConfirm: () => {
            const fechaInicio = document.getElementById('swal-input1').value;
            const fechaFin = document.getElementById('swal-input2').value;

            if (!fechaInicio) {
              Swal.showValidationMessage("Debes seleccionar al menos la fecha de inicio");
              return false;
            }
            return [fechaInicio, fechaFin];
          }
        });
        if (formValues) {
          this.fechaDesde = formValues[0];
          this.fechaFinal = formValues[1];
          this.fechaDesdeActual = this.fechaDesde;
          this.fechaFinalActual = this.fechaFinal;
          await this.consultarVentas();
        }
      } catch (error) {
        console.error('Error al obtener las fechas: ', error);
      }
    },
    async consultarVentas() {
      try {
        const url = `/empleado/ventas/listar?fechaInicio=${this.fechaDesde}&fechaFin=${this.fechaFinal}`;

        Swal.fire({
        title: 'Consultando...',
        text: 'Por favor, espere.',
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });

        const respuesta = await axios.get(url);

        if (respuesta.status === 200) {
          Swal.close()
          this.ventas = respuesta.data;
          this.totalVentas = this.ventas.reduce((total, venta) => total + venta.total, 0);
        }
      } catch (error) {
        Swal.close()
        console.error("Error al consultar las ventas: ", error);
        this.manejarError(error);
      }
    },
    async verProductos(venta) {
      try {
        const productosHTML = venta.productos.map(producto => `
          <tr>
            <td><p class="fs-5">${producto.nombre || "No disponible"}</p></td>
            <td><p class="fs-5">${producto.cantidad || "No disponible"}</p></td>
            <td><p class="fs-5">${this.formatMoneda(producto.precio && producto.cantidad ? (producto.precio * producto.cantidad) : 0)}</p></td>
          </tr>
        `).join('');

        await Swal.fire({
          title: "Productos",
          html: `
            <div>
              <table class="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th><p class="fs-5 fw-medium align-self-end">Nombre</p></th>
                    <th><p class="fs-5 fw-medium align-self-end">Cantidad</p></th>
                    <th><p class="fs-5 fw-medium align-self-end">Total</p></th>
                  </tr>
                </thead>
                <tbody>
                  ${productosHTML}
                </tbody>
              </table>
            </div>
          `,
          focusConfirm: false,
          showConfirmButton: false,
          showCloseButton: true,
        });
      } catch (error) {
        console.error("Error al consultar: ", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo obtener la información del producto.",
        });
      }
    },
    manejarError(error) {
      if (error.response) {
        if (error.response.status === 401) {
          this.$router.push("/login");
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: "No autorizado.",
          });
        } else if (error.response.status === 404) {
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: "Información no encontrada.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: "Error en la solicitud.",
          });
        }
      } else if (error.request) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Error de red.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Error desconocido.",
        });
      }
    },
  },
  mounted() {
    this.consultarVentas();
  }
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
