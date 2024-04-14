<template>
  <table class="table">
    <thead>
      <tr>
        <th>
          <p class="fs-5 fw-medium align-self-end">Usuario</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Nombre</p>
        </th>
        <th>
          <p class="fs-5 fw-medium align-self-end">Teléfono</p>
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
      <tr v-for="empleado in empleados" :key="empleado.id">
        <td :class="{ 'fila-amarilla': empleado.solicitud_restablecer }">
          <p class="fs-5 align-self-start" :title="empleado.nombre_usuario">
            {{ empleado.nombre_usuario }}
          </p>
        </td>
        <td :class="{ 'fila-amarilla': empleado.solicitud_restablecer }">
          <p class="fs-5">{{ empleado.nombre }}</p>
        </td>
        <td :class="{ 'fila-amarilla': empleado.solicitud_restablecer }">
          <p  class="fs-5">{{ empleado.telefono }}</p>
        </td>
        <td :class="{ 'fila-amarilla': empleado.solicitud_restablecer }">
          <button type="button" class="btn btn-primary btn-sm" @click="editarEmpleado(empleado.id)">
            Editar
          </button>
        </td>
        <td :class="{ 'fila-amarilla': empleado.solicitud_restablecer }">
          <button type="button" class="btn btn-danger btn-sm" @click="eliminarEmpleado(empleado.id)">
            Eliminar
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Swal from "sweetalert2";
export default {
  name: "TablaEmpleados",
  props: {
    empleados: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    editarEmpleado(idEmpleado) {
      this.$emit("editarEmpleado", idEmpleado);
    },
    eliminarEmpleado(idEmpleado) {
      Swal.fire({
        title: "¿Quieres eliminar este usuario?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Eliminar",
        denyButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.$emit("eliminarEmpleado", idEmpleado);
        }
      });
    },
    revisarSolicitudes() {
      if(!this.empleados.length > 0) 
        return
      const haySolicitudes = this.empleados.some(empleado => empleado.solicitud_restablecer);
      if (haySolicitudes) {
        Swal.fire({
          icon: 'info',
          title: 'Atención',
          text: 'Hay empleados con solicitudes de restablecimiento de contraseña pendientes.',
          confirmButtonText: 'Entendido'
        });
      }
    }
  },
  watch: {
    // Se agrega un watcher para 'empleados' que también observa cambios profundos
    empleados: {
      deep: true,
      // eslint-disable-next-line no-unused-vars
      handler(newVal, oldVal) {
        this.revisarSolicitudes();
      }
    }
  },
  mounted(){
    console.log(this.empleados)
    this.revisarSolicitudes();
  }
};
</script>

<style scoped>
.fondo-encabezado {
  background-color: #fe8092;
}

.fila-amarilla {
  background-color: #f6f690;
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