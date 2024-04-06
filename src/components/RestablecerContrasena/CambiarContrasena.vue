<template>
  <div>
    <h4>Cambiar Contraseña</h4>
    <form
      @submit.prevent="cambiarContrasenia"
      class="formulario gradient-background"
    >
      <div class="mb-3">
        <label for="nuevaContrasenia" class="form-label"
          >Nueva Contraseña:</label
        >
        <input
          type="password"
          v-model="nuevaContrasenia"
          id="nuevaContrasenia"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="confirmarContrasenia" class="form-label"
          >Confirmar Contraseña:</label
        >
        <input
          type="password"
          v-model="confirmarContrasenia"
          id="confirmarContrasenia"
          class="form-control"
          required
        />
      </div>
      <div class="d-grid gap-2 d-md-flex justify-content-md-center">
        <button type="submit" class="btn btn-rose">Cambiar Contraseña</button>
      </div>
    </form>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import apiCliente from "@/config/ServidorCliente.js";
import axios from "@/config/axios.js";
export default {
  data() {
    return {
      nuevaContrasenia: "",
      confirmarContrasenia: "",
    };
  },
  methods: {
    validarContrasenia() {
  const contraseniaValida = /^(?=.*[A-Z]).{8,}$/.test(this.nuevaContrasenia);

  if (this.nuevaContrasenia !== this.confirmarContrasenia) {
    Swal.fire({
      icon: "error",
      title: "Las contraseñas no coinciden",
      text: "Por favor, asegúrate de que las contraseñas coincidan.",
    });
    this.nuevaContrasenia = "";
    this.confirmarContrasenia = "";
    return false;
  }

  if (!contraseniaValida) {
    Swal.fire({
      icon: "error",
      title: "Contraseña no válida",
      text: "La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra mayúscula.",
    });
    this.nuevaContrasenia = "";
    this.confirmarContrasenia = "";
    return false;
  }

  return true;
},
cambiarContrasenia() {
  if (!this.validarContrasenia()) return; 

  const url = apiCliente.cambiarContrasenia;
  const datos = {
    correo: localStorage.getItem("correoUsuario"),
    contrasenia: this.nuevaContrasenia,
  };

  Swal.fire({
    title: 'Cambiando contraseña...',
    text: 'Por favor, espere.',
    didOpen: () => {
      Swal.showLoading(); 
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false
  });

  axios.post(url, datos)
    .then(() => {
      Swal.close();

      Swal.fire({
        icon: 'success',
        title: 'Contraseña cambiada',
        text: 'Tu contraseña ha sido cambiada exitosamente.',
      }).then(() => {
        this.$router.push("/login");
      });
    })
    .catch(() => {
      
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al cambiar tu contraseña. Por favor, intenta nuevamente.',
      });
    });
    this.$router.push("/login");
},

  },
};
</script>

<style scoped>
.formulario {
  max-width: 700px;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
}

.gradient-background {
  background: linear-gradient(to top, #ffffff, #ffc6d1);
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
</style>
