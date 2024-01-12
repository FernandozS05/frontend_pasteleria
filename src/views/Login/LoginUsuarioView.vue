<template>
    <div class="login-usuario-view">
      <LoginUsuario/>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import LoginUsuario from "@/components/Login/LoginUsuario.vue";
  import { toast } from "vue3-toastify";
  
  export default {
    name: "LoginUsuarioView",
    components: {
        LoginUsuario,
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
  