<template>
  <div id="app">
  <div>
    <h4>Modificar Entrega</h4>
    <form
      @submit.prevent="modificarEntrega"
      class="formulario gradient-background"
    >
      <div class="mb-3">
        <label for="fechaEntrega" class="form-label">Fecha de Entrega:</label>
        <input
          type="date"
          v-model="formulario.fechaEntrega"
          id="fechaEntrega"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="detallesEntrega" class="form-label"
          >Detalles de Entrega:</label
        >
        <textarea
          v-model="formulario.detallesEntrega"
          id="detallesEntrega"
          class="form-control"
          rows="4"
          required
        ></textarea>
      </div>
      <div class="mb-3">
        <label for="nombreCliente" class="form-label"
          >Nombre del Cliente:</label
        >
        <input
          type="text"
          v-model="formulario.nombreCliente"
          id="nombreCliente"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="anticipo" class="form-label">Anticipo:</label>
        <input
          type="number"
          v-model="formulario.anticipo"
          id="anticipo"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="liquidacion" class="form-label">Liquidación:</label>
        <input
          type="number"
          v-model="formulario.liquidacion"
          id="liquidacion"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="estado" class="form-label">Estado:</label>
        <input
          type="text"
          v-model="formulario.estado"
          id="estado"
          class="form-control"
          required
        />
      </div>
      <div class="d-grid gap-2 d-md-flex justify-content-md-center">
        <button
          type="button"
          class="btn btn-outline-secondary me-md-2"
          @click="cancelar"
        >
          Cancelar
        </button>
        <button type="submit" class="btn btn-rose">Guardar</button>
      </div>
    </form>
  </div>
</div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  data() {
    return {
      formulario: {
        fechaEntrega: "",
        detallesEntrega: "",
        nombreCliente: "",
        anticipo: "",
        liquidacion: "",
        estado: "",
      },
      formularioValido: false,
    };
  },
  methods: {
    cancelar() {
      this.$router.go(-1);
    },
    validarFormulario() {
      const fechaActual = new Date();
      const fechaEntregaValida =
        new Date(this.formulario.fechaEntrega) >= fechaActual;
      const nombreClienteRegex = /^[A-Za-z\s]+$/;
      const estadoRegex = /^[A-Za-z\s]+$/;

      this.formularioValido =
        fechaEntregaValida &&
        nombreClienteRegex.test(this.formulario.nombreCliente) &&
        estadoRegex.test(this.formulario.estado) &&
        this.formulario.anticipo >= 0 &&
        this.formulario.liquidacion >= 0 &&
        Object.values(this.formulario).every((value) => {
          const stringValue = String(value).trim();
          return stringValue !== "";
        });

      if (!fechaEntregaValida) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "La fecha de entrega debe ser posterior a la fecha actual.",
        });
      }
    },

    modificarEntrega() {
      this.validarFormulario();
      if (this.formularioValido) {
        console.log("Datos del formulario:", this.formulario);
        this.limpiarFormulario();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Por favor, complete todos los campos correctamente.",
        });
      }
    },
    limpiarFormulario() {
      this.formulario = {
        fechaEntrega: "",
        detallesEntrega: "",
        nombreCliente: "",
        anticipo: "",
        liquidacion: "",
        estado: "",
      };
      this.validarFormulario();
    },
  },
};
</script>

<style scoped>
.formulario {
  max-width: 700px;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
}

.gradient-background {
  background: linear-gradient(to top, #ffffff, #ffc6d1);
}

.text-rose {
  color: #fe8092;
}

.btn-rose {
  background-color: #fe8092;
  color: #ffffff;
  border-color: #fe8092;
}

.btn-outline-secondary {
  color: #fe8092;
  border-color: #fe8092;
}

#app {
  max-width: 100%;
  overflow-x:hidden;
}
</style>
