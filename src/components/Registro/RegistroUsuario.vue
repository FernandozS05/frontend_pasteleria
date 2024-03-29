<template>
  <div class="container position-absolute top-50 start-50 translate-middle">
    <div class="row">
      <div class="col-md-6 order-md-1 mt-5">
        <img
          src="../../assets/Imagen2.png"
          alt="Imagen Pastelería"
          class="img-fluid"
        />
      </div>

      <div class="col-md-6 order-md-2 mt-5">
        <div class="gradient-background p-3">
          <div class="mb-3">
            <img
              src="../../assets/Logo1.png"
              alt="Logotipo Pastelería Zudey"
              class="img-fluid logo"
            />
          </div>
          <h2 class="text-center mb-4">Pastelería Zudey</h2>

          <h3 class="text-center mb-4">Registrarse</h3>
          <p class="text-center mb-4">
            Por favor, ingrese sus datos personales.
          </p>

          <form @submit.prevent="registrarUsuario">
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre</label>
              <input
                v-model="nombre"
                type="text"
                class="form-control"
                id="nombre"
                placeholder="Ingrese su nombre"
                required
              />
            </div>

            <div class="mb-3">
              <label for="email" class="form-label">Correo</label>
              <input
                v-model="email"
                type="email"
                class="form-control"
                id="email"
                placeholder="Ingrese su correo"
                required
              />
            </div>

            <div class="mb-3">
              <label for="contraseña" class="form-label">Contraseña</label>
              <input
                v-model="contrasenia"
                type="password"
                class="form-control"
                id="contraseña"
                placeholder="Ingrese su contraseña"
                required
              />
            </div>

            <div class="mb-3">
              <label for="telefono" class="form-label"
                >Número de Teléfono</label
              >
              <input
                v-model="telefono"
                type="tel"
                class="form-control"
                id="telefono"
                placeholder="Ingrese su número de teléfono"
                required
              />
            </div>

            <div class="d-flex justify-content-between align-items-center mt-3">
              <router-link
                to="/login"
                class="btn btn-outline-secondary text-rose"
                >Cancelar</router-link
              >
              <button class="btn btn-rose" type="submit">
                Registrarse
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import toastConf from "@/config/toast";

export default {
  name: "RegistroUsuario",
  data() {
    return {
      nombre: "",
      apellido: "",
      tipo: "",
      telefono: "",
      email: "",
      contrasenia: "",
    };
  },
  methods: {
    validarNombre() {
      const nombreValido = /^[a-zA-Z\s']{3,}$/.test(this.nombre);
      if (!nombreValido) {
        this.mostrarError(
          "Nombre inválido. Asegúrate de ingresar al menos 3 letras y sin números ni símbolos."
        );
      }
      return nombreValido;
    },
    validarCorreo() {
      const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
      if (!correoValido) {
        this.mostrarError(
          "Correo electrónico inválido. Ingresa un correo válido con formato usuario@dominio.com."
        );
      }
      return correoValido;
    },
    validarContraseña() {
      const contraseñaValida = /^(?=.*[A-Z]).{8,}$/.test(this.contrasenia);
      if (!contraseñaValida) {
        this.mostrarError(
          "Contraseña inválida. Debe contener al menos una mayúscula y tener al menos 8 caracteres."
        );
      }
      return contraseñaValida;
    },
    validarTelefono() {
      console.log("Validando teléfono...");
      const telefonoLimpio = this.telefono.replace(/[^0-9]/g, "");

      if (
        telefonoLimpio.length !== 10 ||
        !/^\d{10}$/.test(telefonoLimpio) ||
        /^(.)\1+$/.test(telefonoLimpio)
      ) {
        this.mostrarError(
          "Número de teléfono inválido. Ingresa un número válido con exactamente 10 dígitos numéricos y que no sea una cadena repetitiva de un solo dígito."
        );
        return false;
      }

      return true;
    },
    async registrarUsuario() {
      if (
        !this.validarNombre() ||
        !this.validarCorreo() ||
        !this.validarContraseña() ||
        !this.validarTelefono()
      ) {
        return;
      }

      this.apellido = this.nombre.split(':')[1];
      const datos = {
        nombre: this.nombre,
        apellido: this.apellido,
        tipo: this.tipo,
        telefono: this.telefono,
        email: this.email,
        contrasenia: this.contrasenia,
      };
      
      toast
        .promise(
          axios.post(
          "http://localhost:3000/api/cliente/registro",
          datos, { withCredentials: true }),
          {
            pending: "Registrando usuario...", // Mensaje mientras la promesa está pendiente
            success: "Registro exitoso", // Mensaje cuando la promesa se resuelve con éxito
            error: "No se pudo registrar el usuario", // Mensaje cuando la promesa es rechazada
          },
          toastConf
        )
        .then((respuesta) => {
          // Puedes realizar acciones adicionales después de que la promesa se resuelva
          // (opcional dependiendo de tus necesidades)
          console.log("Inicio de sesión completado");

          // Realizar acciones adicionales según la respuesta exitosa
          if (respuesta.status === 200) {
            toast.success("Registro exitoso. ¡Inicia sesión ahora!");
            setTimeout(()=> {}, 1000)
            this.$router.push("/login");
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
    mostrarError(mensaje) {
      toast.error(mensaje, toastConf);
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

.btn-outline-secondary {
  color: #fe8092;
  border-color: #fe8092;
}

.btn-rose {
  background-color: #fe8092;
  color: #ffffff;
}
</style>