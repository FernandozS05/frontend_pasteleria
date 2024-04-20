<template>
  <div id="app">
  <table class="table">
    <thead>
      <tr>
        <th>
          <p class="fs-5 fw-medium align-self-end">Nombre</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Fecha de caducidad</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Piezas</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Informacion</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Editar</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Eliminar</p>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(insumo, index) in insumos" :key="index">
        <td>
          <p class="fs-5 align-self-start" :title="insumo.nombre">
            {{ insumo.nombre }}
          </p>
        </td>
        <td>
          <p class="fs-5">{{ insumo.fecha_caducidad }}</p>
        </td>
        <td>
          <p class="fs-5">{{ insumo.piezas }}</p>
        </td>
        <td>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="infoInsumo(insumo)"
          >
            Detalles
          </button>
        </td>
        <td>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="editarInsumo(insumo.id)"
          >
            Editar
          </button>
        </td>
        <td>
          <button
            type="button"
            class="btn btn-danger btn-sm"
            @click="eliminarInsumo(insumo.id)"
          >
            Eliminar
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
import Swal from 'sweetalert2';
export default {
  name: "TablaInsumo",
  props: {
    insumos: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    editarInsumo(idInsumo) {
      this.$emit("editarInsumo", idInsumo);
    },
    infoInsumo(idInsumo) {
      this.$emit("infoInsumo", idInsumo);
    },
    eliminarInsumo(idInsumo) {
      Swal.fire({
          title: "¿Quieres eliminar este insumo?",
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: "Eliminar",
          denyButtonText: "Cancelar"
        }).then((result) => {
          if (result.isConfirmed) {
            this.$emit("eliminarInsumo", idInsumo);
          }
        });
    },
  },
};
</script>

<style scoped>
.fondo-encabezado {
  background-color: #fe8092;
}

.boton-agregar {
  background-color: #fe8092;
  color: #ffffff;
  font-size: 1.3rem;
}

.subtitulo {
  color: #fe8092;
}

.table {
  background-color: #f1edff;
}

thead th {
  border: none;
}

tbody tr {
  border-bottom: 1px solid #ccc;
}

tbody tr:last-child {
  border-bottom: none;
}

tbody td {
  max-width: auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#app {
  max-width: 100%;
  overflow-x:hidden;
}
</style>