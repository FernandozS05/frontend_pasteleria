<template>
  <form class="d-flex" role="search" @submit.prevent="filtrar">
    <div class="datepicker-container">
      <VueDatePicker
        v-model="fechaInicio"
        class="form-control datepicker"
        placeholder="Fecha de inicio"
      ></VueDatePicker>
      <VueDatePicker
        v-model="fechaFin"
        class="form-control datepicker"
        placeholder="Fecha de fin"
      ></VueDatePicker>
    </div>
    <button class="btn btn-success rounded-circle border-2" type="submit">
      <img class="img-fluid py-1" src="../../assets/icono_buscar.png" alt="" />
    </button>
  </form>
</template>

<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Swal from "sweetalert2";

export default {
  name: "BarraFecha",
  data() {
    return {
      fechaInicio: null,
      fechaFin: null,
    };
  },
  methods: {
    filtrar() {
      if (this.fechaInicio && this.fechaFin) {
        const rangoFechas = {
          inicio: this.fechaInicio,
          fin: this.fechaFin,
        };
        this.$emit("filtrar", rangoFechas);
      } else if (this.fechaInicio) {
        const fecha = {
          inicio: this.fechaInicio,
          fin: this.fechaInicio,
        };
        this.$emit("filtrar", fecha);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Selecciona al menos una fecha para filtrar!",
        });
      }
    },
  },
  components: {
    VueDatePicker,
  },
};
</script>

<style scoped>
body {
  font-family: "Poppins", sans-serif;
  color: #ffffff;
}

.datepicker-container {
  display: flex;
}

.datepicker {
  background-color: #ffc6d1;
  border-color: #f76797;
  margin-right: 5px;
}

button {
  background-color: #ffc6d1;
  border-color: #f76797;
}

button:hover {
  background-color: #f685ab;
}
</style>
