<template>
  <div class="pop-up">
    <div class="pop-up-inner container mt-5">
      <div class="container py-4 border rounded p-4">
        <h2 class="text-center text-rose">Restablecer Contraseña</h2>
        <p class="text-center mt-3">Necesitamos verificar tu identidad.</p>
        <div class="mt-4">
          <p class="mb-3">¿Cómo quieres obtener tu código de seguridad?</p>
          <div class="form-check">
            <input type="radio" id="correo" class="form-check-input" value="correo" v-model="opcion" />
            <label for="correo" class="form-check-label">
              Enviar al correo <i class="bi bi-envelope-fill"></i>
            </label>
          </div>
          <div class="form-check">
            <input type="radio" id="sms" class="form-check-input" value="sms" v-model="opcion" />
            <label for="sms" class="form-check-label">
              Enviar un mensaje de texto SMS
              <i class="bi bi-chat-dots-fill"></i>
            </label>
          </div>
        </div>
        <div class="text-center mt-4">
          <button class="btn btn-outline-secondary me-3" @click="cancelar">
            Cancelar
          </button>
          <button class="btn btn-rose" @click="enviarCodigo">
            Enviar Código
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiCliente from "@/config/ServidorCliente.js";
import axios from "@/config/axios.js";
import Swal from 'sweetalert2';
export default {
  data() {
    return {
      opcion: "",
    };
  },
  methods: {
    cancelar() {
      this.$router.back();
    },
    enviarCodigo() {
      if (this.opcion === "") {
        Swal.fire({
          icon: "info",
          title: "Seleccione una opción",
          text: "Por favor seleccione un método para restablecer su contraseña.",
        });
        return;
      }

      const url = apiCliente.obtenerCodigo;
      const datos = {
        correo: localStorage.getItem("correoUsuario"),
        metodo: this.opcion,
      };

      Swal.fire({
        title: 'Enviando código...',
        text: 'Por favor, espere.',
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
      axios.post(url, datos)
        .then(response => {
          Swal.close();
          if (response.status == 200) {
            Swal.fire({
              icon: 'success',
              title: 'Código enviado',
              text: 'El código de verificación ha sido enviado exitosamente.',
            }).then(() => {
              this.$router.push("/codigo-seguridad");
            });
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

    cerrarModal() {
      this.$emit("cerrar");
    },
  },
};
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(to top, #ffffff, #ffc6d1);
}

.text-rose {
  color: #fe8092;
}

.btn-rose {
  background-color: #fe8092;
  color: #ffffff;
}

.btn-outline-secondary {
  color: #fe8092;
  border-color: #fe8092;
}

.centro-texto {
  text-align: center;
}

.pop-up {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  background: linear-gradient(to top, #ffffff, #ffc6d1);
}

.pop-up-inner {
  border: 2px solid #ccc;
  padding: 20px;
  background-color: #fff;
}
</style>
