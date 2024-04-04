<template>
  <table class="table">
    <thead>
      <tr>
        <th>
          <p class="fs-5 fw-medium align-self-end">Nombre</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Fecha de Caducidad</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Cantidad/Piezas</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Gramaje</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Marca</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Descripción General</p>
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
      <tr v-for="(elemento, index) in insumos" :key="index">
        <td>
          <img
            class="img-fluid mx-2 align-self-start"
            src="../../assets/cake-solid-24.png"
            alt=""
          />
          <p class="fs-5 align-self-start" :title="elemento.insumo.nombre">
            {{ elemento.insumo.nombre }}
          </p>
        </td>
        <td>
          <p class="fs-5">{{ elemento.insumo.fechaCaducidad }}</p>
        </td>
        <td>
          <p class="fs-5">{{ elemento.insumo.cantidad }}</p>
        </td>
        <td>
          <p class="fs-5">{{ elemento.insumo.gramaje }}</p>
        </td>
        <td>
          <p class="fs-5">{{ elemento.insumo.marca }}</p>
        </td>
        <td>
          <p class="fs-5">{{ elemento.insumo.descripcion }}</p>
        </td>
        <td>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="editarInsumo(index)"
          >
            Editar
          </button>
        </td>
        <td>
          <button
            type="button"
            class="btn btn-danger btn-sm"
            @click="eliminarInsumo(index)"
          >
            Eliminar
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "TablaInsumo",
  props: {
    insumos: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    editarInsumo() {
      this.$router.push("/modificar-insumo");
    },
    eliminarInsumo() {

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
</style>