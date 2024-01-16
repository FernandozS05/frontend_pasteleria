<template>
  <div class="container position-absolute top-50 start-50 translate-middle">
    <div class="row">
      <div class="col-md-6 order-md-1 mt-5">
        <div class="gradient-background p-3">
          <h4 class="mt-4">Detalles de la Venta:</h4>

          <div class="mb-3">
            <label for="productos" class="form-label"
              >Productos Seleccionados:</label
            >
            <ul>
              <li v-for="(producto, index) in detalles.productos" :key="index">
                {{ producto.nombre }} - Cantidad: {{ producto.cantidad }}
              </li>
            </ul>
          </div>

          <div class="mb-3">
            <label for="fechaVenta" class="form-label"
              >Fecha de la Venta:</label
            >
            <p>{{ detalles.fechaVenta }}</p>
          </div>

          <div class="mb-3">
            <label for="cantidad" class="form-label"
              >Cantidad de Productos:</label
            >
            <p>{{ detalles.cantidad }}</p>
          </div>

          <div class="mb-3">
            <label for="precioTotal" class="form-label"
              >Precio Total a Pagar:</label
            >
            <p>{{ detalles.precioTotal }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ElementoVenta",
  props: {
    detalles: Object,
  },
  methods: {},
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