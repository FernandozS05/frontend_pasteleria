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
      <tr v-for="(pedido, index) in pedidos" :key="index">
        <td class="d-flex">
          <img
            class="img-fluid mx-2 align-self-start"
            src="../../assets/icono-pedido.png"
            alt=""
          />
          <p class="fs-5 align-self-end">
            {{ pedido.id }}
          </p>
        </td>
        <td>
          <p class="fs-5">{{ pedido.fecha_realizado.slice(0, 10) }}</p>
        </td>
        <td>
          <p class="fs-5">{{ pedido.estado }}</p>
        </td>
        <td>
          <p class="fs-5">{{ obtenerFechaEntrega(pedido.id_entrega) }}</p>
        </td>
        <td class="ps-5">
          <p v-if="pedido.id_liquidacion != null" class="fs-5">No disponible</p>
          <button
            v-else
            type="button"
            class="btn btn-primary btn-sm"
            @click="pagar(index)"
          >
            Pagar
          </button>
        </td>
        <td>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="verInfo(index)"
          >
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
        this.fechasDeEntrega[idEntrega] = respuesta.data.fecha_entrega.slice(
          0,
          10
        );
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
    editarPedido(index) {
      this.$emit("editarPedido", index);
    },
    CancelarPedido(index) {
      this.$emit("cancelarPedido", index);
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
  },
  mounted() {
    this.cargarFechas();
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

#app {
  max-width: 100%;
  overflow-x:hidden;
}
</style>
