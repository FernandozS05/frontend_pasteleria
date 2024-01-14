<template>
  <table class="table table-auto">
    <thead>
      <tr>
        <th>
          <p class="fs-5 fw-medium align-self-end">Nombre/ID del pedido</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Fecha de Pedido</p>
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
          <p class="fs-5 fw-medium align-self-end">Estado del Pedido</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Información Adicional</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Editar</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Cancelar</p>
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
          <p class="fs-5 align-self-end" :title="pedido.titulo">
            {{ acortarTitulo(pedido.titulo) }}
          </p>
        </td>
        <td>
          <p class="fs-5">{{ pedido.fecha_agenda }}</p>
        </td>
        <td>
          <p class="fs-5">{{ pedido.cantidad }}</p>
        </td>
        <td>
          <p class="fs-5">{{ pedido.precioTotal }}</p>
        </td>
        <td>
          <p class="fs-5">{{ pedido.tipoEntrega }}</p>
        </td>
        <td>
          <p class="fs-5">{{ pedido.estadoPedido }}</p>
        </td>
        <td>
          <p class="fs-5">{{ pedido.informacionAdicional }}</p>
        </td>
        <td>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="editarPedido(index)"
          >
            Editar
          </button>
        </td>
        <td>
          <button
            type="button"
            class="btn btn-danger btn-sm"
            @click="CancelarPedido(index)"
          >
            Cancelar
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "TablaPedidos",
  props: {
    pedidos: Array,
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
    editarPedido(index) {
      this.$emit("editarPedido", index);
    },
    CancelarPedido(index) {
      this.$emit("CancelarPedido", index);
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
</style>
