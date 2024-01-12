<template>
  <div class="registro-usuario-view">
    <RegistroUsuario/>
  </div>
</template>

<script>
// @ is an alias to /src
import RegistroUsuario from "@/components/Registro/RegistroUsuario.vue";

export default {
  name: "RegistroUsuarioView",
  components: {
    RegistroUsuario,
  },
  methods: {
    irAlCatalogo() {
      this.$router.push("/catalogo");
    },
  },
};
</script>
