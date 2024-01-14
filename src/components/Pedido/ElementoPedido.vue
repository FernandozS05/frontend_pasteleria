<template>
  <div class="container position-absolute top-50 start-50 translate-middle">
    <div class="row">
      <div class="col-md-6 order-md-1 mt-5">
        <div class="gradient-background p-3">
          <h4 class="mt-4">Detalles del Pedido:</h4>

          <div class="mb-3" v-if="detalles.productos">
            <label for="productos" class="form-label"
              >Productos Seleccionados:</label
            >
            <ul>
              <li v-for="(producto, index) in productos" :key="index">
                {{ producto.nombre }} - Cantidad: {{ producto.cantidad }}
              </li>
            </ul>
          </div>

          <div class="mb-3">
            <label for="fechaPedido" class="form-label"
              >Fecha del Pedido Agendada:</label
            >
            <p>{{ producto.fechaPedido }}</p>
          </div>

          <div class="mb-3">
            <label for="cantidad" class="form-label"
              >Cantidad de Productos:</label
            >
            <p>{{ producto.cantidad }}</p>
          </div>

          <div class="mb-3">
            <label for="precioTotal" class="form-label"
              >Precio Total a Pagar:</label
            >
            <p>{{ producto.precioTotal }}</p>
          </div>

          <div class="d-flex justify-content-between align-items-center mt-3">
            <button class="btn btn-primary" @click="editarPedido">
              Editar Pedido
            </button>
            <button class="btn btn-danger" @click="cancelarPedido">
              Cancelar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ElementoPedido",
  props: {
    detalles: Object,
  },
  methods: {
    editarPedido() {
      this.$emit("editarPedido");
    },
    cancelarPedido() {
      this.$emit("cancelarPedido");
    },
  },
};
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(to top, #ffffff, #ffc6d1);
}

.text-rose {
  color: #fe8092;
}

.btn-rose {
  background-color: #fe8092;
  color: #ffffff;
}

.btn-outline-secondary {
  color: #fe8092;
  border-color: #fe8092;
}
</style>
