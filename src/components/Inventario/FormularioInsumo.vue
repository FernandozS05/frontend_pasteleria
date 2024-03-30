<template>
  <div>
    <h4>Registrar Insumo</h4>
    <form
      @submit.prevent="registrarInsumo"
      class="formulario gradient-background"
    >
      <div class="mb-3">
        <label for="nombre" class="form-label">Nombre:</label>
        <input
          type="text"
          v-model="formulario.nombre"
          id="nombre"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="fechaCaducidad" class="form-label"
          >Fecha de Caducidad:</label
        >
        <input
          type="date"
          v-model="formulario.fechaCaducidad"
          id="fechaCaducidad"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="cantidad" class="form-label">Cantidad/Piezas:</label>
        <input
          type="number"
          v-model="formulario.cantidad"
          id="cantidad"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="gramaje" class="form-label">Gramaje (Gr):</label>
        <input
          type="text"
          v-model="formulario.gramaje"
          id="gramaje"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="marca" class="form-label">Marca:</label>
        <input
          type="text"
          v-model="formulario.marca"
          id="marca"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="descripcion" class="form-label">Descripción General:</label>
        <textarea
          v-model="formulario.descripcion"
          id="descripcion"
          class="form-control"
          rows="4"
          required
        ></textarea>
      </div>
      <div class="d-grid gap-2 d-md-flex justify-content-md-center">
        <button
          type="button"
          class="btn btn-outline-secondary me-md-2"
          @click="cancelar"
        >
          Cancelar
        </button>
        <button type="submit" class="btn btn-rose">Registrar</button>
      </div>
    </form>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";

export default {
  data() {
    return {
      formulario: {
        nombre: "",
        fechaCaducidad: "",
        cantidad: "",
        gramaje: "",
        marca: "",
        descripcion: "",
      },
      formularioValido: false,
    };
  },
  methods: {
    validarFormulario() {
      const nombreRegex = /^[A-Za-z\s]+$/;
      const marcaRegex = /^[A-Za-z\s]+$/;
      const descripcionRegex = /^[A-Za-z\s]+$/;
      const gramajeRegex = /^\d+$/;
      const fechaCaducidadValida =
        new Date(this.formulario.fechaCaducidad) > new Date();
      const cantidadValida = parseInt(this.formulario.cantidad) > 0;

      this.formularioValido =
        nombreRegex.test(this.formulario.nombre) &&
        marcaRegex.test(this.formulario.marca) &&
        descripcionRegex.test(this.formulario.descripcion) &&
        gramajeRegex.test(this.formulario.gramaje) &&
        fechaCaducidadValida &&
        cantidadValida &&
        Object.values(this.formulario).every((value) => {
          const stringValue = String(value).trim();
          return stringValue !== "";
        });
    },

    registrarInsumo() {
      this.validarFormulario();
      if (this.formularioValido) {
        console.log("Datos del formulario:", this.formulario);
        this.limpiarFormulario();
      } else {
        toast.error("Por favor, complete todos los campos correctamente.");
      }
    },
    limpiarFormulario() {
      this.formulario = {
        nombre: "",
        fechaCaducidad: "",
        cantidad: "",
        gramaje: "",
        marca: "",
        descripcion: "",
      };
      this.validarFormulario();
    },
    cancelar() {
      this.$router.go(-1);
      this.limpiarFormulario();
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
</style>
