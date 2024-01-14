<template>
  <div class="container position-absolute top-50 start-50 translate-middle">
    <div class="row">
      <div class="col-md-6 order-md-1 mt-5">
        <div class="gradient-background p-3">
          <h4 class="mt-4">Agendar fecha de entrega:</h4>
          <div>
            <VueDatePicker v-model="date"></VueDatePicker>
          </div>

          <h4 class="mt-4">Tipo de entrega:</h4>
          <div class="form-check">
            <input
              type="radio"
              class="form-check-input"
              name="tipoEntrega"
              id="entregaSucursal"
            />
            <label class="form-check-label" for="entregaSucursal">
              En la sucursal
            </label>
            <div>Dirección de la sucursal: 123 Calle Principal, Ciudad</div>
          </div>
          <div class="form-check">
            <input
              type="radio"
              class="form-check-input"
              name="tipoEntrega"
              id="entregaDomicilio"
              v-model="tipoEntrega"
              value="Domicilio"
            />
            <label class="form-check-label" for="entregaDomicilio">
              A domicilio
            </label>
          </div>

          <h4 class="mt-4">Método de pago:</h4>
          <div class="form-check">
            <input
              type="radio"
              class="form-check-input"
              name="metodoPago"
              id="pagoTarjeta"
            />
            <label class="form-check-label" for="pagoTarjeta">
              Pago con tarjeta
            </label>
          </div>
          <div class="form-check">
            <input
              type="radio"
              class="form-check-input"
              name="metodoPago"
              id="otraFormaPago"
            />
            <label class="form-check-label" for="otraFormaPago">
              Otra forma de pago
            </label>
          </div>

          <div class="mb-3 mt-4">
            <label for="detallesPago" class="form-label">
              Detalles adicionales del pago
            </label>
            <textarea
              class="form-control"
              id="detallesPago"
              rows="3"
              placeholder="Indicaciones adicionales"
            ></textarea>
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
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const date = ref(null);
const router = useRouter();

const cancelar = () => {
  router.go(-1);
};

const continuar = () => {
  const tipoEntrega = document.querySelector(
    'input[name="tipoEntrega"]:checked'
  ).id;

  const metodoPago = document.querySelector(
    'input[name="metodoPago"]:checked'
  ).id;

  store.commit("actualizarTipoEntrega", tipoEntrega);
  store.commit("actualizarMetodoPago", metodoPago);

  if (tipoEntrega === "entregaSucursal" && metodoPago === "pagoTarjeta") {
    router.push("/tarjeta");
  } else if (
    tipoEntrega === "entregaSucursal" &&
    metodoPago === "otraFormaPago"
  ) {
    router.push("/formato");
  } else {
    router.push("/direccion");
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
