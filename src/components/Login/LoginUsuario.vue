<template>
  <div class="container position-absolute top-50 start-50 translate-middle">
    <div class="row">
      <div class="col-md-6 order-md-2 mt-5">
        <img src="../../assets/Imagen1.png" alt="Imagen Pastelería" class="img-fluid" />
      </div>

      <div class="col-md-6 order-md-1 mt-5">
        <div class="gradient-background p-3">
          <div class="mb-3">
            <img src="../../assets/Logo1.png" alt="Logotipo Pastelería La Casa del Pastel" class="img-fluid logo" />
          </div>
          <h2 class="text-center mb-2">Pastelería La Casa del Pastel</h2>

          <p class="text-center">Iniciar sesión</p>
          <p class="text-center mb-4">
            ¡Bienvenido de nuevo! Por favor ingrese sus datos.
          </p>

          <form @submit.prevent="iniciarSesion">
            <div class="mb-3">
              <label for="correo" class="form-label">Correo</label>
              <input v-model="usuario" class="form-control" id="correo" placeholder="Ingrese su correo" />
            </div>

            <div class="mb-3">
              <label for="contrasena" class="form-label">Contraseña</label>
              <input v-model="contrasenia" type="password" class="form-control" id="contrasena"
                placeholder="Ingrese su contraseña" />
            </div>

            <div class="form-check">
              <a @click="irARestablecer" class="text-purple">¿Has olvidado la
                contraseña?</a>
            </div>

            <div class="d-flex flex-column align-items-center mt-3">
              <button type="submit" class="btn btn-rose mb-3 mt-3">
                Iniciar Sesión
              </button>
              <div class="mb-3">
                <router-link to="/registro" class="text-purple ml-1">¿No tienes una cuenta? Registrarse</router-link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiCliente from "@/config/ServidorCliente.js";
import apiEmpleado from "@/config/ServidorEmpleado";
import axios from "@/config/axios.js";
import { toast } from "vue3-toastify";
import toastConf from "@/config/toast";
import Swal from 'sweetalert2';
export default {
  name: "LoginUsuario",
  data() {
    return {
      usuario: "",
      contrasenia: "",
      tipo: "",
      api: {},
    };
  },
  methods: {
    definirApi() {
      if (this.usuario.includes("@")) {

        this.tipo = "cliente";
      } else {
        this.tipo = "empresa";
      }
    },
    iniciarSesion() {
      this.definirApi();
      const api = this.tipo === "cliente" ? apiCliente : apiEmpleado;
      const url = api.login;
      console.log(url);
      const datos =
        this.tipo === "cliente"
          ? { email: this.usuario, contrasenia: this.contrasenia }
          : { nombre_usuario: this.usuario, contrasenia: this.contrasenia };
      toast
        .promise(
          axios.post(url, datos),
          {
            pending: "Iniciando sesión...",
            success: "Inicio de sesión exitoso",
            error: "No se pudo iniciar sesión",
          },
          toastConf
        )
        .then((respuesta) => {
          if (respuesta.status === 200) {
            localStorage.setItem("tokenUsuario", respuesta.data.token);
            const idUsuario = respuesta.data.id;
            localStorage.setItem("tipoUsuario", this.tipo === "cliente" ? "cliente" : "empresa");
            toast.success("Sesión iniciada correctamente!");
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Sesión iniciada correctamente!",
              showConfirmButton: false,
              timer: 1500,
            });
            this.$emit("irAlCatalogo", idUsuario);
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              Swal.fire({
                icon: "error",
                title: "Error...",
                text: "Contraseña incorrecta.",
              });
            }
            if (error.response.status === 404) {
              //toast.error("Usuario no encontrado.", toastConf);
              Swal.fire({
                icon: "error",
                title: "Error...",
                text: "Usuario no encontrado.",
              });
            }
          } else if (error.request) {
            //toast.error("Error de red", toastConf);
            Swal.fire({
              icon: "error",
              title: "Error...",
              text: "Error de red",
            });
          } else {
            //toast.error("Error desconocido", toastConf);
            Swal.fire({
              icon: "error",
              title: "Error...",
              text: "Error desconocido",
            });
          }
        });
    },
    solicitarRestablecer(nombreUsuario) {

      const url = apiEmpleado.restablecer;
      const datos = {
        nombre_usuario: nombreUsuario,
      };

      Swal.fire({
        title: 'Realizando solicitud...',
        text: 'Por favor, espere.',
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
      axios.put(url, datos)
        .then(response => {
          Swal.close();
          if (response.status == 200) {
            Swal.fire({
              icon: 'success',
              title: 'Solicitud enviada',
              text: 'El administrador se pondra en contacto con usted lo más pronto posible.',
            })
          }
        })
        .catch(() => {
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al enviar el código. Por favor, inténtelo de nuevo.',
          });
        });
    },
    async irARestablecer() {
      const { value: usuario } = await Swal.fire({
        title: "Ingrese su nombre de usuario o correo electrónico",
        input: "text",
        text: "Ingrese su nombre de usuario o correo electrónico con el que se registró.",
        inputPlaceholder: "Nombre de usuario o correo"
      });

      if (usuario) {
        const esCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario);

        if (esCorreo) {
          localStorage.setItem("correoUsuario", usuario);
          this.$router.push("/restablecer-contrasena");
        } else {
          localStorage.setItem("nombreUsuario", usuario);
          this.solicitarRestablecer(usuario);
        }
      }
    }

  },
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

.text-purple {
  color: #593fa9;
}

.btn-rose {
  background-color: #fe8092;
  color: #ffffff;
}
</style>
