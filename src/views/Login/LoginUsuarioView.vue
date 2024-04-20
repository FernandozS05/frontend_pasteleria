<template>
    <div class="login-usuario-view">
      <Login @irAlCatalogo="irAlCatalogo"/>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import Login from "@/components/Login/LoginUsuario.vue";
  
  export default {
    name: "LoginUsuario",
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
  