<template>
  <table class="table">
    <thead>
      <tr>
        <th>
          <p class="fs-5 fw-medium align-self-end">Fecha de Entrega</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Detalles de Entrega</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Nombre del Cliente</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Anticipo</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Liquidación</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Estado</p>
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
      <tr v-for="(elemento, index) in entregas" :key="index">
        <td>
          <img
            class="img-fluid mx-2 align-self-start"
            src="../../assets/cake-solid-24.png"
            alt=""
          />
          <p
            class="fs-5 align-self-start"
            :title="elemento.entrega.fechaEntrega"
          ></p>
        </td>
        <td>
          <p class="fs-5">{{ elemento.entrega.detalles }}</p>
        </td>
        <td>
          <p class="fs-5">{{ elemento.entrega.nombreCliente }}</p>
        </td>
        <td>
          <p class="fs-5">{{ elemento.entrega.anticipo }}</p>
        </td>
        <td>
          <p class="fs-5">{{ elemento.entrega.liquidacion }}</p>
        </td>
        <td>
          <p class="fs-5">{{ elemento.entrega.estado }}</p>
        </td>
        <td>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="editarEntrega(index)"
          >
            Editar
          </button>
        </td>
        <td>
          <button
            type="button"
            class="btn btn-danger btn-sm"
            @click="eliminarEntrega(index)"
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
    name: "TablaEntregas",
    props: {
      entregas: {
        type: Array,
        default: () => [],
      },
    },
    methods: {
      editarEntrega() {
        this.$router.push("/modificar-entrega");
      },
      eliminarEntrega() {
  
      },
    },
  };
</script>

<style scoped>
body {
  font-family: "Poppins", sans-serif;
  color: #ffffff;
}

input {
  background-color: #f1edff;
  border-color: #435bde;
}

p {
  font-family: "Poppins", sans-serif;
  font-size: 1.1em;
  font-weight: 300;
  color: #333333;
}

td {
  max-width: auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.table {
  background-color: #fe8092;
}
</style>