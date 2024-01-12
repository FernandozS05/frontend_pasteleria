<template>
  <div class="registro-usuario-view">
    <RegistroUsuario/>
    <button @click="notify">Notify !</button>
  </div>
</template>

<script>
// @ is an alias to /src
import RegistroUsuario from "@/components/Registro/RegistroUsuario.vue";
import { toast } from "vue3-toastify";

export default {
  name: "RegistroUsuarioView",
  components: {
    RegistroUsuario,
  },
  methods: {
    irAlCatalogo() {
      this.$router.push("/catalogo");
    },
    notify() {
      toast("Wow so easy !", {
        autoClose: 1000,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    },
  },
};
</script>
