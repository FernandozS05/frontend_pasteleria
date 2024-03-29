<template>
  <div class="container position-absolute top-50 start-50 translate-middle">
    <div class="row">
      <div class="col-md-6 order-md-2 mt-5">
        <img
          src="../../assets/Imagen1.png"
          alt="Imagen Pastelería"
          class="img-fluid"
        />
      </div>

      <div class="col-md-6 order-md-1 mt-5">
        <div class="gradient-background p-3">
          <div class="mb-3">
            <img
              src="../../assets/Logo1.png"
              alt="Logotipo Pastelería La Casa del Pastel"
              class="img-fluid logo"
            />
          </div>
          <h2 class="text-center mb-2">Pastelería La Casa del Pastel</h2>

          <p class="text-center">Iniciar sesión</p>
          <p class="text-center mb-4">
            ¡Bienvenido de nuevo! Por favor ingrese sus datos.
          </p>

          <form @submit.prevent="iniciarSesion">
            <div class="mb-3">
              <label for="correo" class="form-label">Correo</label>
              <input
                v-model="usuario"
                class="form-control"
                id="correo"
                placeholder="Ingrese su correo"
              />
            </div>

            <div class="mb-3">
              <label for="contrasena" class="form-label">Contraseña</label>
              <input
                v-model="contrasenia"
                type="password"
                class="form-control"
                id="contrasena"
                placeholder="Ingrese su contraseña"
              />
            </div>

            <div class="form-check">
              <router-link to="/restablecer-contrasena" class="text-purple">¿Has olvidado la contraseña?</router-link>
            </div>

            <div class="d-flex flex-column align-items-center mt-3">
              <button type="submit" class="btn btn-rose mb-3 mt-3">
                Iniciar Sesión
              </button>
              <div class="mb-3">
                <router-link to="/registro" class="text-purple ml-1"
                  >¿No tienes una cuenta? Registrarse</router-link
                >
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
import apiUsuario from "@/config/ServidorEmpleado";
import axios from "axios";
import { toast } from "vue3-toastify";
import toastConf from "@/config/toast";

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
        // Si el nombre de usuario contiene '@', selecciona la API de cliente
        this.tipo = "cliente";
      } else {
        // Si no, selecciona la API de usuario
        this.tipo = "empresa";
      }
    },
    iniciarSesion() {
      this.definirApi();
      const api = this.tipo === "cliente" ? apiCliente : apiUsuario;
      const url = api.login;
      const datos =
        this.tipo === "cliente"
          ? { email: this.usuario, contrasenia: this.contrasenia }
          : { nombreUsuario: this.usuario, contraseña: this.contrasenia };
      console.log(url);
      // Usar toast.promise para mostrar un toast mientras la promesa está pendiente
      toast
        .promise(
          axios.post(url, datos, { withCredentials: true }),
          {
            pending: "Iniciando sesión...", // Mensaje mientras la promesa está pendiente
            success: "Inicio de sesión exitoso", // Mensaje cuando la promesa se resuelve con éxito
            error: "No se pudo iniciar sesión", // Mensaje cuando la promesa es rechazada
          },
          toastConf
        )
        .then((respuesta) => {
          // Puedes realizar acciones adicionales después de que la promesa se resuelva
          // (opcional dependiendo de tus necesidades)
          console.log("Inicio de sesión completado");

          // Realizar acciones adicionales según la respuesta exitosa
          if (respuesta.status === 200) {
            console.log(respuesta.data);
            const idUsuario = respuesta.data.id;
            toast.success("Sesión iniciada correctamente!");
            setTimeout(() => {
              this.$emit("irAlCatalogo", idUsuario);
            }, 2000);
          }
        })
        .catch((error) => {
          // Manejar errores de la petición
          if (error.response) {
            console.error("Mensaje del servidor:", error.response.data.error);

            if (error.response.status === 401) {
              toast.error("Contraseña incorrecta.");
            }
            if (error.response.status === 404) {
              toast.error("Usuario no encontrado.", toastConf);
            }
          } else if (error.request) {
            // La solicitud fue realizada, pero no se recibió respuesta
            console.error("No se recibió respuesta del servidor");
            toast.error("Error de red", toastConf);
          } else {
            // Algo sucedió al configurar la solicitud que desencadenó un error
            console.error("Error de configuración de la solicitud", error);
            toast.error("Error desconocido", toastConf);
          }
        });
    },
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