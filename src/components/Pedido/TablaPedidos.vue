<template>
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
          <p class="fs-5 fw-medium align-self-end">ID entrega</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">ID pago liquidacion</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Informacion</p>
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
            {{ pedido.idPedido }}
          </p>
        </td>
        <td>
          <p class="fs-5">{{ pedido.fechaPedido.slice(0,10) }}</p>
        </td>
        <td>
          <p class="fs-5">{{ pedido.estado }}</p>
        </td>
        <td>
          <p class="fs-5">{{ pedido.idEntrega? pedido.idEntrega : "No disponible" }}</p>
        </td>
        <td class="ps-5">
          <p v-if="pedido.idPagoLiquidacion != null" class="fs-5">{{ pedido.idPagoLiquidacion }}</p>
          <button v-else
            type="button"
            class="btn btn-primary btn-sm"
            @click="pagarLiquidacion(index)"
          >
            Pagar
          </button>
        </td>
        <td >
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="verInfo(index)"
          >
            Informacion
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
    pagarLiquidacion(index){
      this.$emit("pagar", index);
    },
    verInfo(index){
      console.log("ver info: " + index);
      this.$emit("info", index);
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
