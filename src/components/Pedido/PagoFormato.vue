<template>
  <div class="container position-absolute">
    <div class="row">
      <div class="col-md-6 order-md-1 mt-5">
        <div>
          <p class="text-center">Aquí puedes descargar el formato de pago.</p>
          <a
            class="button rght"
            id="download-button"
            @click="redirigirATablaPedidos"
            >Descargar Formato</a
          >
        </div>
      </div>

      <div class="col-md-6 mt-4">
        <div>
          <label for="detallesPago" class="form-label">
            Productos Seleccionados
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    redirigirATablaPedidos() {
      this.$router.push("/tablaPedidos");
    },
  },
};
</script>

<style scoped>
#download-button {
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  text-align: center;
  font-size: 21px;
  font-weight: 400;
  padding: 12px 0;
  width: 100%;
  display: table;
  background-color: #fe8092;
  color: #ffffff;
  cursor: pointer;
  text-decoration: none;
  margin-top: 20px;
}

#download-button:hover {
  background-color: #ff627c;
}
</style>
