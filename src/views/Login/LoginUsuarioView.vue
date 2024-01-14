<template>
    <div class="login-usuario-view">
      <Login @irAlCatalogo="irAlCatalogo"/>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import Login from "@/components/Login/Login.vue";
  
  export default {
    name: "LoginUsuarioView",
    components: {
        Login,
    },
    methods: {
      irAlCatalogo(idUsuario) {
        this.$router.push("/catalogo");
        localStorage.setItem('idUsuario', idUsuario);
      },
    },
  };
  </script>
  