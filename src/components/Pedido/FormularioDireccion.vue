<template>
  <div class="container position-absolute top-50 start-50 translate-middle">
    <div class="row">
      <div class="col-md-6 order-md-1 mt-5">
        <div class="gradient-background p-3">
          <h4 class="mt-4">Ingresa la dirección de entrega:</h4>
          <div v-if="tipoEntrega === 'entregaDomicilio'">
            <div class="mb-3">
              <label for="pais" class="form-label">País o Región:</label>
              <input
                type="text"
                class="form-control"
                id="pais"
                v-model="direccion.pais"
                placeholder="México"
              />
            </div>
            <div class="mb-3">
              <label for="estado" class="form-label">Estado o Provincia:</label>
              <input
                type="text"
                class="form-control"
                id="estado"
                v-model="direccion.estado"
                placeholder="Veracruz"
              />
            </div>
            <div class="mb-3">
              <label for="codigoPostal" class="form-label"
                >Código Postal:</label
              >
              <input
                type="number"
                class="form-control"
                id="codigoPostal"
                v-model="direccion.codigoPostal"
                placeholder="91050"
              />
            </div>
            <div class="mb-3">
              <label for="municipio" class="form-label"
                >Municipio o Ciudad:</label
              >
              <input
                type="text"
                class="form-control"
                id="municipio"
                v-model="direccion.municipio"
                placeholder="Xalapa"
              />
            </div>
            <div class="mb-3">
              <label for="colonia" class="form-label">Colonia:</label>
              <input
                type="text"
                class="form-control"
                id="colonia"
                v-model="direccion.colonia"
                placeholder="Unidad Veracruzana"
              />
            </div>
            <div class="mb-3">
              <label for="calle" class="form-label"
                >Dirección (calle y número):</label
              >
              <input
                type="text"
                class="form-control"
                id="calle"
                v-model="direccion.calle"
                placeholder="Dirección completa"
              />
            </div>
            <div class="mb-3">
              <label for="telefono" class="form-label"
                >Número de Teléfono:</label
              >
              <input
                type="tel"
                class="form-control"
                id="telefono"
                v-model="direccion.telefono"
                placeholder="1234567890"
                pattern="[0-9]{10}"
              />
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center mt-3">
            <button
              class="btn btn-outline-secondary text-rose"
              type="button"
              @click="cancelar"
            >
              Cancelar
            </button>
            <button class="btn btn-rose" type="button" @click="continuar">
              Continuar
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-6 order-md-2 mt-5">
        <label for="detallesPago" class="form-label">
          Productos Seleccionados
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

const tipoEntrega = store.state.tipoEntrega;
const direccion = ref({
  calle: "",
  numero: "",
});

const cancelar = () => {
  router.go(-1);
};

const continuar = () => {
  store.commit("actualizarDireccionDomicilio", direccion.value);
  const metodoPago = store.state.metodoPago;
  if (metodoPago === "pagoTarjeta") {
    router.push("/tarjeta");
  } else {
    router.push("/formato");
  }
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