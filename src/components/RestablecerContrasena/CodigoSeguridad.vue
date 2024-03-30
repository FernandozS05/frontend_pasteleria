<template>
  <div class="pop-up">
    <div class="pop-up-inner container mt-5">
      <div class="container py-4 border rounded p-4">
        <h2 class="text-center text-rose">Ingrese el código de seguridad</h2>
        <div class="form-group mt-4">
          <label for="codigo" class="form-label">Código de Seguridad</label>
          <input
            type="text"
            class="form-control"
            id="codigo"
            v-model="codigo"
          />
        </div>
        <div class="text-center mt-4">
          <button class="btn btn-outline-secondary me-3" @click="cancelar">
            Cancelar
          </button>
          <button class="btn btn-rose" @click="verificarCodigo">
            Verificar Código
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";

export default {
  data() {
    return {
      codigo: "",
    };
  },
  methods: {
    cancelar() {
      this.$router.go(-1);
    },
    verificarCodigo() {
      if (this.codigo === "") {
        toast.error("Por favor, ingrese el código antes de continuar.");
        return;
      }

      const codigoCorrecto = "codigoCorrecto";
      if (this.codigo !== codigoCorrecto) {
        toast.error(
          "El código ingresado es incorrecto. Por favor, verifíquelo y vuelva a intentarlo."
        );
        return;
      }
      this.$router.push("/cambiar-contrasena");
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
