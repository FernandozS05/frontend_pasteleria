<template>
  <div class="codigo-seguridad-view">
    <CodigoSeguridad />
  </div>
</template>

<script>
// @ is an alias to /src
import CodigoSeguridad from "@/components/RestablecerContrasena/CodigoSeguridad.vue";
import { toast } from "vue3-toastify";

export default {
  name: "CodigoSeguridadView",
  components: {
    CodigoSeguridad,
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
