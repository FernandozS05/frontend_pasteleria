<template>
  <div id="app">
    <div>
      <h4></h4>
      <p class="text-center fs-2">Registrar producto</p>
      <form @submit.prevent="guardarCambios" class="formulario gradient-background">
        <div class="mb-3">
          <label for="nombre" class="form-label">Nombre</label>
          <input type="text" v-model="nombre" id="nombre" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="precio" class="form-label">Precio</label>
          <input type="number" v-model="precio" id="precio" class="form-control" required />
        </div>
        <div v-if="this.ubicacion =='catalogo'" class="mb-3">
          <label for="horas" class="form-label">Horas de trabajo para elaboración:</label>
          <input type="number" v-model="horas_trabajo" id="horas" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="imagen" class="form-label">Imagen del producto</label>
          <input class="form-control" type="file" id="imagen" @change="cargarImagen">
        </div>
        <div class="mb-3">
          <label for="descripcion" class="form-label">Descripción del producto</label>
          <textarea v-model="descripcion" id="descripcion" class="form-control" rows="4" required></textarea>
        </div>
        <div class="d-grid gap-2 d-md-flex justify-content-md-center">
          <button type="button" class="btn btn-outline-secondary me-md-2" @click="cancelar">
            Cancelar
          </button>
          <button type="submit" class="btn btn-rose">Guardar</button>
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
      ubicacion: "",
      nombre: "",
      precio: 0,
      imagen: null,
      descripcion: "",
      horas_trabajo: 0,
      formularioValido: false,
    };
  },
  methods: {
    consultarProducto(idProducto) {
      const url = apiEmpleado.detallesProductoCatalogo + idProducto;
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
          this.nombre = response.data.nombre;
          this.precio = parseInt(response.data.precio);
          this.piezas = parseInt(response.data.piezas);
          this.descripcion = response.data.descripcion;
        }
      }).catch(error => {
        Swal.close();
        this.manejarError(error);
      });
    },
    manejarError(error) {
      if (error.response) {
        console.log(error)
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
    cargarImagen(event) {
      this.imagen = event.target.files[0];
    },
    guardarCambios() {
      if (!this.validarCampos()) {
        return;
      }
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
    },
    validarCampos() {
      const nombreRegex = /^[A-Za-z\s]+$/; // Solo letras y espacios
      if (!nombreRegex.test(this.nombre)) {
        Swal.fire("Error", "El nombre del producto es inválido.", "error");
        return false;
      }

      if (this.precio <= 0) {
        Swal.fire("Error", "El precio debe ser mayor que 0.", "error");
        return false;
      }

      if (!this.descripcion.trim()) {
        Swal.fire("Error", "La descripción no puede estar vacía.", "error");
        return false;
      }

      if (!this.imagen && !localStorage.getItem("idProducto")) {
        Swal.fire("Error", "Debe seleccionar una imagen para el producto.", "error");
        return false;
      }

      return true;
    },
    cargarFormulario() {
      const formulario = new FormData();

      formulario.append('nombre', this.nombre);
      formulario.append('precio', this.precio);
      formulario.append('horas_trabajo', this.horas_trabajo);
      formulario.append('descripcion', this.descripcion);
      if(this.imagen != null){
        formulario.append('imagen', this.imagen);
      }
      return formulario;
    },
    enviarFormulario() {

      const idProducto = localStorage.getItem("idProducto");
      const url = idProducto
        ? `${apiEmpleado.actualizarProductoCatalogo}${idProducto}`
        : ((this.ubicacion == "catalogo") ? apiEmpleado.registrarProductoCatalogo : apiEmpleado.registrarProductoInventario);

      const method = idProducto ? 'put' : 'post';

      const formulario = this.cargarFormulario();

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

      axios[method](url, formulario).then(async response => {
        if (response.status === 200) {
          Swal.close();
          await Swal.fire({
            icon: "success",
            title: idProducto ? "Actualización compleatada" : "Registro completado",
            text: `Producto ${idProducto ? 'actualizado' : 'registrado'} correctamente.`,
          });
          localStorage.removeItem("idProducto");
          if(this.ubicacion !="catalogo")
            this.$router.push("/productos-inventario")
          else
            this.$router.push("/productos-catalogo")
        }
      }).catch(error => {
        Swal.close();
        this.manejarError(error);
      });
    },
    cancelar() {
      localStorage.removeItem("idProducto");
      this.$router.back();
    },
  },
  mounted() {
    const idProducto = localStorage.getItem("idProducto");
    if (idProducto) {
      this.consultarProducto(idProducto);
    }
    this.ubicacion = localStorage.getItem("ubicacionProducto");
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