<template>
    <div class="login-usuario-view">
      <LoginUsuario/>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import LoginUsuario from "@/components/Login/LoginUsuario.vue";
  
  export default {
    name: "LoginUsuarioView",
    components: {
        LoginUsuario,
    },
    methods: {
      irAlCatalogo() {
        this.$router.push("/catalogo");
      },
    },
  };
  </script>
  