<template>
  <div class="cambiar-contrasena-view">
    <CambiarContrasena />
  </div>
</template>

<script>
// @ is an alias to /src
import CambiarContrasena from "../../components/RestablecerContrasena/CambiarContrasena.vue";
import { toast } from "vue3-toastify";

export default {
  name: "CambiarContrasenaView",
  components: {
    CambiarContrasena,
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
