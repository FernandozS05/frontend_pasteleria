<template>
  <div id="app">
    <table class="table table-auto">
      <thead>
        <tr>
          <th>
            <p class="fs-5 fw-medium align-self-end">ID del pedido</p>
          </th>
          <th>
            <p class="fs-5 fw-medium align-self-end">Realizado</p>
          </th>
          <th>
            <p class="fs-5 fw-medium align-self-end">Estado del pedido</p>
          </th>
          <th>
            <p class="fs-5 fw-medium align-self-end">Fecha de entrega</p>
          </th>
          <th>
            <p class="fs-5 fw-medium align-self-end">Pagos</p>
          </th>
          <th>
            <p class="fs-5 fw-medium align-self-end">Detalles</p>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(pedido, index) in pedidos" :key="index" >
          <td :class="getRowClass(pedido)">
            <p class="fs-5 align-self-center">{{ pedido.id }}</p>
          </td>
          <td :class="getRowClass(pedido)">
            <p class="fs-5">{{ pedido.fecha_realizado.slice(0, 10) }}</p>
          </td>
          <td :class="getRowClass(pedido)">
            <p class="fs-5">{{ pedido.estado }}</p>
          </td>
          <td :class="getRowClass(pedido)">
            <p class="fs-5">{{ obtenerFechaEntrega(pedido.id_entrega) }}</p>
          </td>
          <td class="ps-5" :class="getRowClass(pedido)">
            <p v-if="pedido.id_liquidacion != null || pedido.estado == 'Cancelado'" class="fs-5">No disponible</p>
            <button v-else type="button" class="btn btn-primary btn-sm" @click="pagar(index)">
              Pagar
            </button>
          </td>
          <td :class="getRowClass(pedido)">
            <button type="button" class="btn btn-primary btn-sm" @click="verInfo(index)">
              Ver
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import apiCliente from "@/config/ServidorCliente";
import axios from "@/config/axios.js";
import Swal from "sweetalert2";

export default {
  name: "TablaPedidos",
  props: {
    pedidos: Array,
  },
  data() {
    return {
      fecha_entrega: "",
      fechasDeEntrega: {},
    };
  },
  methods: {
    acortarTitulo(titulo, longitudMaxima) {
      if (titulo.length > longitudMaxima) {
        return titulo.slice(0, longitudMaxima) + "...";
      }
      return titulo;
    },
    async consultarEntrega(idEntrega) {
      if (!idEntrega) {
        this.fechasDeEntrega[idEntrega] = "No disponible";
        return;
      }
      const url = apiCliente.detallesEntrega + idEntrega;

      try {
        const respuesta = await axios.get(url);
        this.fechasDeEntrega[idEntrega] = respuesta.data.fecha_entrega.slice(0, 10);
      } catch (error) {
        this.manejarError(error);
        this.fechasDeEntrega[idEntrega] = "Error al consultar";
      }
    },
    obtenerFechaEntrega(idEntrega) {
      return this.fechasDeEntrega[idEntrega] || "Consultando...";
    },
    pagar(index) {
      this.$emit("pagar", index);
    },
    verInfo(index) {
      console.log("ver info: " + index);
      this.$emit("info", index);
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
    cargarFechas() {
      this.pedidos.forEach((pedido) => {
        this.consultarEntrega(pedido.id_entrega);
      });
    },
    getRowClass(pedido) {
      const hoy = new Date();
      const dosDiasDespues = new Date(hoy);
      dosDiasDespues.setDate(hoy.getDate() + 2);
      const fechaEntrega = new Date(pedido.Entrega.fecha_entrega);

      if(pedido.estado == 'Pendiente'){
        return;
      }
      // Amarillo: El estado es Anticipado o Liquidado y la fecha de hoy no es mayor a la de entrega y la fecha de entrega es en menos de dos días
      if ((pedido.estado === 'Anticipado' || pedido.estado === 'Liquidado') && 
          hoy <= fechaEntrega && 
          fechaEntrega <= dosDiasDespues) {
        return 'bg-yellow';
      }

      // Rojo: Estado no es Entregado, ni No entregado ni Cancelado, y además la fecha de hoy ya es posterior a la de entrega
      if (pedido.estado !== 'Entregado' && 
          pedido.estado !== 'No entregado' && 
          pedido.estado !== 'Cancelado' && 
          hoy > fechaEntrega) {
        return 'bg-red';
      }

      // Verde: El pedido está Liquidado o Anticipado, y aún no estamos cerca de la fecha de entrega por dos días
      if ((pedido.estado === 'Liquidado' || pedido.estado === 'Anticipado') && 
          fechaEntrega > dosDiasDespues) {
        return 'bg-green';
      }

      // Azul: El pedido está Entregado, No entregado o Cancelado
      if (pedido.estado === 'Entregado' || 
          pedido.estado === 'No entregado' || 
          pedido.estado === 'Cancelado') {
        return 'bg-blue';
      }

      return '';
    },
    mostrarSimbologia() {
      Swal.fire({
        title: 'Simbología de Colores',
        html: `
          <p><span class="bg-yellow px-2 py-1">Amarillo:</span> Anticipado o Liquidado y entrega en menos de dos días.</p>
          <p><span class="bg-red px-2 py-1">Rojo:</span> No Entregado y fecha de entrega pasada.</p>
          <p><span class="bg-green px-2 py-1">Verde:</span> Liquidado o Anticipado y entrega en más de dos días.</p>
          <p><span class="bg-blue px-2 py-1">Azul:</span> Entregado, No entregado o Cancelado.</p>
        `,
        icon: 'info',
        confirmButtonText: 'Entendido'
      });
    }
  },
  mounted() {
    this.cargarFechas();
    //this.mostrarSimbologia();
  },
  watch: {
    pedidos: {
      handler: "cargarFechas",
      deep: true,
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

.table .thead-light th {
  color: #495057;
  background-color: #e9ecef;
  border-color: #dee2e6;
}

.bg-yellow {
  background-color: rgb(252, 252, 151) !important;
  color: #495057 !important;
}

.bg-green {
  background-color: rgb(181, 255, 181) !important;
  color: #495057 !important;
}

.bg-red {
  background-color: rgb(255, 139, 139) !important;
  color: #495057 !important;
}
.bg-blue {
  background-color: rgb(168, 238, 255) !important;
  color: #495057 !important;
}

#app {
  max-width: 100%;
  overflow-x: hidden;
}
</style>
