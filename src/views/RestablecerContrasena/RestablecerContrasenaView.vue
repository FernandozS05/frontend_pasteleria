<template>
  <div class="restablecer-contrasena-view">
    <RestablecerContrasena />
  </div>
</template>

<script>
// @ is an alias to /src
import RestablecerContrasena from "@/components/RestablecerContrasena/RestablecerContrasena.vue";
import { toast } from "vue3-toastify";

export default {
  name: "RestablecerContrasenaView",
  components: {
    RestablecerContrasena,
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