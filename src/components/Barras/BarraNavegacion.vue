<template>
  <div id="app">
    <div id="row degradado-rosa" class="d-flex align-items-center degradado-rosa">
      <img
        class="col-1 img-fluid"
        src="../../assets/Logo1.png"
        alt="Logo Pastelería"
      />
      <p class="tit col-2 ml-2">La Casa del Pastel</p>
      <div class="col-2 align-items-center">
        <img
          class="img-fluid float-start fs-4 me-2"
          src="../../assets/icono_salir.png"
        />
        <li>
          <a class="dropdown-item" href="#" @click="cerrarSesion"
            ><p class="fs-6">Cerrar sesión</p></a
          >
        </li>
      </div>
      <nav class="col-auto w-100">
        <ul class="nav">
          <li v-if="tipoUsuarioEsCliente" class="nav-item">
            <router-link to="/catalogo" class="nav-link"
              ><p class="fs-5 link">Catálogo</p></router-link
            >
          </li>
          <li v-if="tipoUsuarioEsEmpresa" class="nav-item">
            <router-link to="/catalogo" class="nav-link"
              ><p class="fs-5 link">Administrar Catálogo</p></router-link
            >
          </li>
          <li v-if="tipoUsuarioEsEmpresa" class="nav-item">
            <router-link to="/catalogo" class="nav-link"
              ><p class="fs-5 link">Administrar Usuarios</p></router-link
            >
          </li>
          <li v-if="tipoUsuarioEsEmpresa" class="nav-item">
            <router-link to="/reportes" class="nav-link"
              ><p class="fs-5 link">Inventario</p></router-link
            >
          </li>
          <li v-if="tipoUsuarioEsEmpresa" class="nav-item">
            <router-link to="/reportes" class="nav-link"
              ><p class="fs-5 link">Empleados</p></router-link
            >
          </li>
          <li v-if="tipoUsuarioEsCliente" class="nav-item">
            <router-link to="/pedidos" class="nav-link"
              ><p class="fs-5 link">Pedidos</p></router-link
            >
          </li>
          <li v-if="tipoUsuarioEsEmpresa" class="nav-item">
            <router-link to="/reportes" class="nav-link"
              ><p class="fs-5 link">Ventas</p></router-link
            >
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: "BarraNavegacion",
  data() {
    return {
      
    };
  },
  computed:{
    tipoUsuarioEsCliente() {
      return localStorage.getItem("tipoUsuario") === "cliente";
    },
    tipoUsuarioEsEmpresa() {
      return localStorage.getItem("tipoUsuario") === "empresa";
    },
  },
  methods: {
    cerrarSesion() {
      localStorage.removeItem("tokenUsuario");
      localStorage.removeItem("idUsuario");
      this.$router.push("/login");
    },
    revisar() {
      const tipoUsuario = localStorage.getItem("tipoUsuario");
      if (tipoUsuario === "cliente") {
        return false;
      } else if (tipoUsuario === "empresa") {
        return true;
      }
      return false;
    },
  },
};
</script>

<style scoped>
.degradado-rosa {
  background: #ff9baf;
}

body {
  font-family: "Poppins", sans-serif;
  background: #fafafa;
  color: #999;
}

p {
  font-family: "Poppins", sans-serif;
  font-size: 1.1em;
  font-weight: 300;
  line-height: 1.7em;
  color: #fff;
}

.link {
  color: white;
  font-size: 5px;
  margin-bottom: 5px;
}

.tit {
  color: #000000;
  font-size: larger;
}

#app {
  max-width: 100%;
  overflow-x:hidden;
}
</style>
