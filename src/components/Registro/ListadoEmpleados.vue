<template>
  <div>
    <div
      class="row justify-content-between align-items-center fondo-encabezado"
    >
      <div class="col-6">
        <p class="fs-4 lh-1 pt-2">Administrar Empleados</p>
      </div>
      <div class="col-6">
        <button
          type="button"
          class="btn btn-success boton-agregar d-flex align-items-center justify-content-evenly text-center p-1 boton-hover"
          @click="nuevoEmpleado"
        >
          <img
            class="img-fluid px-1"
            src="@/assets/icono_mas.png"
            alt="Logo Agregar"
          />
          Agregar
        </button>
      </div>
      <div class="col-2 align-self-end">
        <img
          class="img-fluid logo-pasteleria"
          src="../../assets/Logo1.png"
          alt="Logo de la Pastelería"
        />
      </div>
    </div>
    <div class="row">
      <div
        class="col container pt-2 bg-light shadow m-3 rounded border border-dark"
      >
        <div class="row">
          <p class="col-6 fs-4 align-items-start fw-medium subtitulo">
            Empleados Registrados
            <BarraBusqueda
              class="col-6 align-items-center"
              :placeholder="Buscar"
              @filtrar="filtrarEmpleadosTexto"
            />
          </p>
        </div>
        <div class="row p-3">
          <TablaEmpleados
            class="col-12 border border-3 rounded"
            :empleados="empleadosFiltrados"
            @editarEmpleado="editarEmpleado"
            @eliminarEmpleado="eliminarEmpleado"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarraBusqueda from "../Barras/BarraBusqueda.vue";
import TablaEmpleados from "../Registro/TablaEmpleados.vue";
export default {
  name: "ListadoEmpleados",
  components: {
    BarraBusqueda,
    TablaEmpleados,
  },
  data() {
    return {};
  },
  methods: {
    nuevoEmpleado() {
      this.$router.push("/registro-empleado");
    },
    editarEmpleado() {
      this.$router.push("/modificar-datos");
    },
    eliminarEmpleado() {

    },
  },
};
</script>

<style scoped>
.fondo-encabezado {
  background: linear-gradient(to top, #ffffff, #ffc6d1);
}

.boton-agregar {
  background-color: #fe8092;
  color: #ffffff;
  font-size: 1.3rem;
  border: #ffc6d1;
}

.subtitulo {
  color: #fe8092;
}

.row {
  margin-bottom: 1rem;
}

.boton-hover:hover {
  background-color: #fe8092;
}

.col-4 {
  max-width: fit-content;
}

.logo-pasteleria {
  width: 120px;
}
</style>
