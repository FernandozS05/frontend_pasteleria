<template>
  <div id="app">
    <div class="d-flex align-items-center degradado-rosa">
      <img class="col-1 img-fluid" src="../../assets/Logo1.png" alt="Logo Pastelería" />
      <p class="tit col-2 ml-2">La Casa del Pastel</p>
      <div class="col-1 align-items-center">
        <img class="img-fluid float-start fs-4 me-2" src="../../assets/icono_salir.png" />
        <li>
          <a class="dropdown-item" href="#" @click="cerrarSesion">
            <p class="fs-6">Cerrar sesión</p>
          </a>
        </li>
      </div>
      <nav class="col-auto w-100">
        <ul class="nav">
          <li class="nav-item">
            <router-link to="/catalogo" class="nav-link">
              <p class="fs-5 link">Catálogo</p>
            </router-link>
          </li>
          <li v-if="tipoUsuarioEsEmpresa" class="nav-item">
            <router-link to="/listado-insumo" class="nav-link">
              <p class="fs-5 link">Inventario</p>
            </router-link>
          </li>
          <li v-if="esAdministrador" class="nav-item">
            <router-link to="/listado-empleados" class="nav-link">
              <p class="fs-5 link">Empleados</p>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/pedidos" class="nav-link">
              <p class="fs-5 link">Pedidos</p>
            </router-link>
          </li>
          <li v-if="tipoUsuarioEsEmpresa" class="nav-item">
            <router-link to="/reportes" class="nav-link">
              <p class="fs-5 link">Ventas</p>
            </router-link>
          </li>
          <li v-if="esCatalogo" class="nav-item">
            <CarritoCompras :itemsCarrito="itemsCarrito" />
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>



<script>
import apiEmpleado from '@/config/ServidorEmpleado.js';
import axios from '@/config/axios.js';
import CarritoCompras from '../Carrito/CarritoCompras.vue';

export default {
  name: "BarraNavegacion",
  props: {
    itemsCarrito: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  components: {
    CarritoCompras
  },
  data() {
    return {
      esAdministrador: false,
    };
  },
  computed: {
    tipoUsuarioEsCliente() {
      return localStorage.getItem("tipoUsuario") === "cliente";
    },
    tipoUsuarioEsEmpresa() {
      return localStorage.getItem("tipoUsuario") === "empresa";
    },
    esCatalogo() {
      return this.$route.path === "/catalogo";
    }
  },
  methods: {
    cerrarSesion() {
      localStorage.removeItem("tokenUsuario");
      localStorage.removeItem("idUsuario");
      this.$router.push("/login");
    },
    async revisarAdministrador() {
      console.log("Ejecuntando")
      const idUsuario = localStorage.getItem("idUsuario");
      if (!idUsuario) {
        this.esAdministrador = false;
        return;
      }

      const url = apiEmpleado.perfil + idUsuario;
      try {
        const respuesta = await axios.get(url);
        console.log(respuesta);
        if (respuesta.status == 200) {
          this.esAdministrador = respuesta.data.administrador;
        }
      } catch (error) {
        this.esAdministrador = false;
      }
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
  mounted() {
    this.revisarAdministrador();
  },
  watch: {
    itemsCarrito(newVal) {
      console.log('productosCarrito changed:', newVal);
    }
  }
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
  overflow-x: hidden;
}
</style>
