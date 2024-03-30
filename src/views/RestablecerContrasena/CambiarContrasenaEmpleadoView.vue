<template>
  <div class="cambiar-contrasena-empleado-view">
    <CambiarContrasenaEmpleado />
  </div>
</template>

<script>
// @ is an alias to /src
import CambiarContrasenaEmpleado from "../../components/RestablecerContrasena/CambiarContrasenaEmpleado.vue";
import { toast } from "vue3-toastify";

export default {
  name: "CambiarContrasenaEmpleadoView",
  components: {
    CambiarContrasenaEmpleado,
  },
  methods: {
    notify() {
      toast("Wow so easy !", {
        autoClose: 1000,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    },
  },
};
</script>
