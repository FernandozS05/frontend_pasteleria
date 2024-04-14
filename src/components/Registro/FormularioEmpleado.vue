<template>
  <div class="container">
    <div id="app">
      <div>
        <p class="text-center fs-2">Registrar empleado</p>
        <form @submit.prevent="guardarCambios">
          <div class="mb-3">
            <label for="nombre" class="form-label">Nombre completo</label>
            <input v-model="nombre" type="text" class="form-control" id="nombre" placeholder="Ingrese el nombre"
              required />
          </div>
          <div class="mb-3">
            <label for="nombreUsuario" class="form-label">Nombre de usuario (para acceder al sistema)</label>
            <input v-model="nombreUsuario" type="text" class="form-control" id="nombreUsuario" placeholder="Ingrese el nombre de usuario" required />
          </div>
          <div class="mb-3">
            <label for="telefono" class="form-label">Número de Teléfono</label>
            <input v-model="telefono" type="tel" class="form-control" id="telefono"
              placeholder="Ingrese el número de teléfono" required />
          </div>
          <div id="cambiarContrasenia" class="mb-3">
            <label for="contraseña" class="form-label">Contraseña</label>
            <input v-if="this.editandoContrasenia" v-model="contrasenia" type="password" class="form-control"
              id="contraseña" placeholder="Ingrese la contraseña" required />
            <div v-else class="row d-flex align-items-center me-3 pe-2">
              <p class="col-8 fs-5 align-self-start">Este usuario ya tiene una contraseña asignada. Si decides
                cambiarla, perderá el acceso actual.</p>
              <button class="col-auto btn btn-primary align-self-start" src="../../assets/icono_contraseña.png" alt=""
                @click.prevent="editarContrasenia()">
                <p class="col-auto fs-5 lh-1 pt-2 px-2 align-self-end">Cambiar</p>
              </button>
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <button type="button" class="btn btn-outline-secondary me-md-2" @click="cancelar">
              Cancelar
            </button>
            <button class="btn btn-rose" type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import apiEmpleado from "@/config/ServidorEmpleado";
import axios from "@/config/axios.js";
import Swal from "sweetalert2";
export default {
  name: "FormularioEmpleado",
  data() {
    return {
      nombre: "",
      tipo: "",
      telefono: "",
      nombreUsuario: "",
      contrasenia: "",
      editandoContrasenia: false
    };
  },
  methods: {
    editarContrasenia() {

      this.editandoContrasenia = true;
    },
    validarNombreUsuario() {
      // Asumiendo que solo deseas letras sin espacios ni números.
      const usernameValido = /^[A-Za-z]+$/.test(this.nombreUsuario);
      if (!usernameValido) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "El nombre de usuario solo debe contener letras y no debe incluir espacios ni números.",
        });
      }
      return usernameValido;
    },
    consultarEmpleado(idEmpleado) {
      const url = apiEmpleado.perfil + idEmpleado;
      
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
          this.nombreUsuario = response.data.nombre_usuario;
          this.telefono = response.data.telefono;
        }
      }).catch(error => {
        Swal.close();
        this.manejarError(error);
      });
    },
    guardarCambios() {
      if (!this.validarCampos()) {
        return;
      }
      Swal.fire({
        title: "¿Quieres guardar los cambios?",
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "No guardar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.enviarFormulario()
        }
      });
    },
    validarCampos() {
      if (!this.validarNombre() || !this.validarNombreUsuario() || !this.validarTelefono()) {
        return false;
      }

      if (this.contrasenia !== "" && !this.validarContrasenia()) {
        return false;
      }

      return true;
    },
    cargarDatos() {
      const datos = {
        nombre_usuario: this.nombreUsuario,
        nombre: this.nombre,
        telefono: this.telefono,
      };

      if (this.contrasenia != "") {
        datos.contrasenia = this.contrasenia;
      }

      return datos;
    },
    enviarFormulario() {

      const idEmpleado = localStorage.getItem("idEmpleado");
      const url = idEmpleado
        ? `${apiEmpleado.actualizar}${idEmpleado}`
        : apiEmpleado.registro;

      const method = idEmpleado ? 'put' : 'post';

      const datos = this.cargarDatos(); 

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

      axios[method](url, datos).then(async response => {
        if (response.status === 200) {
          Swal.close();
          await Swal.fire({
            icon: "success",
            title: idEmpleado ? "Actualizacion compleatada" : "Registro completado",
            text: `Usuario ${idEmpleado ? 'actualizado' : 'registrado'} correctamente.`,
          });
          localStorage.removeItem("idEmpleado");

          this.$router.push("/listado-empleados");
        }
      }).catch(error => {
        Swal.close();
        this.manejarError(error);
      });
    },
    validarNombre() {
      const nombreValido = /^[a-zA-Z\s']{3,}$/.test(this.nombre);
      if (!nombreValido) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Nombre inválido. Asegúrate de ingresar al menos 3 letras y sin números ni símbolos.",
        });
      }
      return nombreValido;
    },
    validarContrasenia() {
      const contraseñaValida = /^(?=.*[A-Z]).{8,}$/.test(this.contrasenia);
      if (!contraseñaValida) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Contraseña inválida. Debe contener al menos una mayúscula y tener al menos 8 caracteres.",
        });
      }
      return contraseñaValida;
    },
    validarTelefono() {
      const telefonoLimpio = this.telefono.replace(/[^0-9]/g, "");

      if (/^(\d)\1+$/.test(telefonoLimpio)) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Número de teléfono inválido. Ingresa un número válido que no sea una cadena repetitiva de un solo dígito.",
        });
        return false;
      }

      if (telefonoLimpio.length !== 10) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Número de teléfono inválido. Ingresa un número válido con exactamente 10 dígitos numéricos.",
        });
        return false;
      }

      return true;
    },
    manejarError(error) {
      if (error.response) {
        console.log(error)
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Parece que algo salio mal...",
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
    cancelar() {
      localStorage.removeItem("idEmpleado");
      this.$router.back();
    },
  },
  mounted() {
    const idEmpleado = localStorage.getItem("idEmpleado");
    if (idEmpleado) {
      this.consultarEmpleado(idEmpleado);
    }
    else
      this.editandoContrasenia = true;
  }
};
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(to top, #ffffff, #ffc6d1);
}

.logo {
  max-width: 100px;
}

.text-rose {
  color: #fe8092;
}

.btn-outline-secondary {
  color: #fe8092;
  border-color: #fe8092;
}

.btn-rose {
  background-color: #fe8092;
  color: #ffffff;
}
</style>
