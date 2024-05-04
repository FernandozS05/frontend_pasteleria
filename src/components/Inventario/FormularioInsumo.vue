<template>
  <div id="app">
    <div>
      <p class="text-center fs-2">Registrar Insumo</p>
      <form @submit.prevent="registrarInsumo" class="formulario gradient-background">
        <div class="mb-3">
          <label for="nombre" class="form-label">Nombre:</label>
          <input type="text" v-model="formulario.nombre" id="nombre" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="fechaCaducidad" class="form-label">Fecha de Caducidad:</label>
          <input type="date" v-model="formulario.fecha_caducidad" id="fechaCaducidad" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="cantidad" class="form-label">Cantidad/Piezas:</label>
          <input type="number" v-model="formulario.piezas" id="cantidad" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="descripcion" class="form-label">Descripción General:</label>
          <textarea v-model="formulario.descripcion" id="descripcion" class="form-control" rows="4" required></textarea>
        </div>
        <div class="d-grid gap-2 d-md-flex justify-content-md-center">
          <button type="button" class="btn btn-outline-secondary me-md-2" @click="cancelar">
            Cancelar
          </button>
          <button type="submit" class="btn btn-rose">Registrar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import apiEmpleado from "@/config/ServidorEmpleado";
import axios from "@/config/axios.js";
import Swal from 'sweetalert2';
export default {
  data() {
    return {
      editando: false,
      formulario: {
        nombre: "",
        fecha_caducidad: "",
        piezas: "",
        descripcion: "",
      },
      formularioValido: false,
    };
  },
  methods: {
    consultarInsumo(idInsumo) {
      const url = apiEmpleado.detallesInsumoInventario + idInsumo;
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
          this.formulario.nombre = response.data.nombre;
          this.formulario.fecha_caducidad = response.data.fecha_caducidad;
          this.formulario.piezas = response.data.piezas;
          this.formulario.descripcion = response.data.descripcion;
        }
      }).catch(error => {
        Swal.close();
        this.manejarError(error);
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
    },
    validarFormulario() {
      // Validaciones de expresiones regulares para nombre y descripción
      const nombreRegex = /^[A-Za-z\s]+$/;

      // Validación de la fecha de caducidad directamente sin re-formatear
      const fechaCaducidadValida = new Date(this.formulario.fecha_caducidad) > new Date();
      console.log(fechaCaducidadValida)
      const cantidadValida = parseInt(this.formulario.piezas) > 0;
      console.log(nombreRegex.test(this.formulario.nombre))


      // Comprobar todas las validaciones para establecer formularioValido
      this.formularioValido =
        nombreRegex.test(this.formulario.nombre) &&
        fechaCaducidadValida &&
        cantidadValida;
      console.log(this.formularioValido)
    },
    async registrarInsumo() {
      this.validarFormulario();

      if (this.formularioValido) {
        Swal.fire({
          title: "¿Quieres guardar los cambios?",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Guardar",
          denyButtonText: "No guardar"
        }).then((result) => {
          if (result.isConfirmed) {
            this.enviarFormulario()
          } else if (result.isDenied) {
            Swal.fire("Los cambios no se han guardado", "", "info");
          }
        });

      } else {
        await Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Por favor, complete todos los campos correctamente.",
        });
      }
    },
    enviarFormulario() {

      const idInsumo = localStorage.getItem("idInsumo");
      const url = idInsumo
        ? `${apiEmpleado.actualizarInsumoInventario}${idInsumo}`
        : apiEmpleado.agregarInsumoInventario;

      const method = idInsumo ? 'put' : 'post';

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

      axios[method](url, this.formulario).then(async response => {
        if (response.status === 200) {
          Swal.close();
          await Swal.fire({
            icon: "success",
            title: idInsumo ? "Actualización compleatada" : "Registro completado",
            text: `Insumo ${idInsumo ? 'actualizado' : 'registrado'} correctamente.`,
          });
          this.limpiarFormulario();
          localStorage.removeItem("idInsumo");
          this.$router.push("/listado-insumo")
        }
      }).catch(error => {
        Swal.close();
        this.manejarError(error);
      });
    },
    limpiarFormulario() {
      this.formulario = {
        nombre: "",
        fecha_caducidad: "",
        piezas: "",
        descripcion: "",
      };
      this.validarFormulario();
    },
    cancelar() {
      localStorage.removeItem("idInsumo");
      this.limpiarFormulario();
      this.$router.back();
    },
  },
  mounted() {
    const idInsumo = localStorage.getItem("idInsumo");
    if (idInsumo) {
      this.consultarInsumo(idInsumo);
    }
  }
};
</script>

<style scoped>
.formulario {
  max-width: 700px;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
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
  overflow-x: hidden;
}
</style>
