<template>
    <table class="table">
      <thead>
        <tr>
          <th>
            <p class="fs-5 fw-medium align-self-end">Nombre</p>
          </th>
          <th>
            <p class="fs-5 fw-medium align-self-end">Correo Electrónico</p>
          </th>
          <th>
            <p class="fs-5 fw-medium align-self-end">Teléfono</p>
          </th>
          <th>
            <p class="fs-5 fw-medium align-self-end">Contraseña</p>
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
        <tr v-for="(elemento, index) in empleados" :key="index">
          <td>
            <img
              class="img-fluid mx-2 align-self-start"
              src="../../assets/cake-solid-24.png"
              alt=""
            />
            <p class="fs-5 align-self-start" :title="elemento.empleado.nombre">
              {{ elemento.empleado.nombre }}
            </p>
          </td>
          <td>
            <p class="fs-5">{{ elemento.empleado.correoElectronico }}</p>
          </td>
          <td>
            <p class="fs-5">{{ elemento.empleado.telefono }}</p>
          </td>
          <td>
            <p class="fs-5">{{ elemento.empleado.contrasena }}</p>
          </td>
          <td>
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click="editarEmpleado(index)"
            >
              Editar
            </button>
          </td>
          <td>
            <button
              type="button"
              class="btn btn-danger btn-sm"
              @click="eliminarEmpleado(index)"
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
    name: "TablaEmpleados",
    props: {
      empleados: {
        type: Array,
        default: () => [],
      },
    },
    methods: {
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