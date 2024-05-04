<template>
  <div>
    <div class="row">
      <div class="col container pt-2 bg-light shadow m-3 rounded border border-dark">
        <div class="row d-flex justify-space-between">
          <p class="col-4 fs-4 align-items-start fw-medium subtitulo">
            Empleados Registrados
          </p>
          <BarraBusqueda class="col-6 align-items-center" :placeholder="Buscar" @filtrar="filtrarEmpleadosTexto" />
          <button type="button"
            class="col-1 btn btn-success boton-agregar d-flex align-items-center justify-content-evenly text-center p-1 boton-hover"
            @click="nuevoEmpleado">
            Agregar
          </button>
        </div>
        <div class="row p-3">
          <TablaEmpleados class="col-12 border border-3 rounded" :empleados="empleadosFiltrados"
            @editarEmpleado="editarEmpleado" @eliminarEmpleado="eliminarEmpleado" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarraBusqueda from "../Barras/BarraBusqueda.vue";
import TablaEmpleados from "../Registro/TablaEmpleados.vue";
import apiEmpleado from "@/config/ServidorEmpleado";
import axios from "@/config/axios.js";
import Swal from 'sweetalert2';
export default {
  name: "ListadoEmpleados",
  components: {
    BarraBusqueda,
    TablaEmpleados
  },
  data() {
    return {
      empleados: [],
      empleadosFiltrados: []
    };
  },
  methods: {
    nuevoEmpleado() {
      this.$router.push("/formulario-empleado");
    },
    editarEmpleado(idEmpleado) {
      localStorage.setItem("idEmpleado",idEmpleado);
      this.$router.push("/formulario-empleado");
    },
    filtrarEmpleadosTexto(textoDeBusqueda) {
      if (textoDeBusqueda) {
        this.empleadosFiltrados = this.empleados.filter(empleado =>
        empleado.nombre.toLowerCase().includes(textoDeBusqueda.toLowerCase())
        );
      } else {
        this.empleadosFiltrados = this.empleados;
      }
    },
    eliminarEmpleado(idEmpleado) {
      const url = apiEmpleado.eliminar + idEmpleado;
      Swal.fire({
        title: 'Realizando cambios...',
        text: 'Por favor, espere.',
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });

      axios.delete(url).then(async response => {
        if (response.status === 200) {
          Swal.close();
          await Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'El usuario se ha eliminado correctamente.',
          });
          window.location.reload();
        }
      }).catch(error => {
        Swal.close();
        this.manejarError(error);
      });
    },
    async consultarEmpleados() {
      const url = apiEmpleado.listar;
      Swal.fire({
        title: 'Cargando...',
        text: 'Por favor, espere.',
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });

      axios.get(url).then(response => {
        if (response.status === 200) {
          Swal.close();
          console.log(response.data)
          this.empleados = response.data;
          this.empleadosFiltrados = this.empleados;
          if(!this.empleados.length > 0) {
            Swal.fire({
            icon: "error",
            title: "No se encontraron usuarios...",
            text: "Parece que no hay ningún usuario registrado.",
          });
          }
        }
      }).catch(error => {
        Swal.close();
        if (error.response.status === 404) {
          Swal.fire({
            icon: "error",
            title: "No se encontraron usuarios...",
            text: "Parece que no hay ningún usuario registrado.",
          });
        }
        else if (error.request) {
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: ("Error de red"),
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: ("Error desconocido"),
          });
        }
      });
    },
    manejarError(error) {
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Parece que algo salió mal...",
        });
        if (error.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "No autorizado...",
            text: "Por favor, inicie sesión nuevamente.",
          });
          this.$router.push("/login")
        }
      } else if (error.request) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: ("Error de red"),
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: ("Error desconocido"),
        });
      }
    }
  },
  async mounted(){
    localStorage.removeItem("idEmpleado");
    await this.consultarEmpleados();
  }
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
