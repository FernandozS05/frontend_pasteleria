<template>
  <div id="app">
    <div>
      <div class="row justify-content-between align-items-center fondo-encabezado">
      </div>
      <div class="row">
        <div class="col container pt-2 bg-light shadow m-3 rounded border border-dark">
          <div class="row">
            <p class="col-10 fs-4 d-flex align-items-start fw-medium text-nowrap subtitulo">
              Productos en el catálogo
              
              <BarraBusqueda class="col-6 ms-5 align-items-center" :placeholder="Buscar"
                @filtrar="filtrarProductosTexto" />
              <button type="button"
                class="btn btn-success boton-agregar ms-5 d-flex align-items-center justify-content-evenly text-center p-1 boton-hover"
                @click="nuevoProducto">
                Agregar
              </button>
              <button type="button"
                class="btn btn-success boton-agregar text-nowrap ms-5 d-flex align-items-center justify-content-evenly text-center p-1 boton-hover"
                @click="verCatalogo">
                Ver catálogo
              </button>
            </p>
          </div>
          <div class="row p-3">
            <TablaProductosCatalogo class="col-12 border border-3 rounded" :productos="productosFiltrados" @editarProducto="editarProducto"
              @eliminarProducto="eliminarProducto" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarraBusqueda from "../Barras/BarraBusqueda.vue";
import TablaProductosCatalogo from "../Producto/TablaProductosCatalogo.vue";
import apiEmpleado from "@/config/ServidorEmpleado";
import axios from "@/config/axios.js";
import Swal from 'sweetalert2';
export default {
  name: "ListadoInsumo",
  components: {
    BarraBusqueda,
    TablaProductosCatalogo,
  },
  data() {
    return {
      productos: [],
      productosFiltrados: []
    };
  },
  methods: {
    verCatalogo(){
      this.$router.push("/catalogo");
    },
    filtrarProductosTexto(textoDeBusqueda) {
      
      if (textoDeBusqueda) {
        this.productosFiltrados = this.productos.filter(insumo =>
          insumo.nombre.toLowerCase().includes(textoDeBusqueda.toLowerCase())
        );
      } else {
        this.productosFiltrados = this.productos;
      }
      if(!this.productosFiltrados.length > 0) {
        Swal.fire({
            icon: "info",
            title: "No encontrados",
            text: "No hay ningún producto.",
          });
      }
    },
    nuevoProducto() {
      localStorage.setItem("ubicacionProducto", "catalogo");
      this.$router.push("/formulario-producto");
    },
    editarProducto(idInsumo) {
      localStorage.setItem("idProducto", idInsumo);
      localStorage.setItem("ubicacionProducto", "catalogo");
      this.$router.push("/formulario-producto");
    },
    eliminarProducto(idProducto) {
      const url = apiEmpleado.eliminarProductoCatalogo + idProducto;
      Swal.fire({
        title: 'Realizando cambios...',
        text: 'Por favor, espere.',
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });

      axios.delete(url).then(async response => {
        if (response.status === 200) {
          Swal.close();
          await Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'El elemento se ha eliminado correctamente.',
          });
          window.location.reload();
        }
      }).catch(error => {
        Swal.close();
        this.manejarError(error);
      });
    },
    async consultarProductos() {
      const url = apiEmpleado.consultarCatalogoCatalogo;
      Swal.fire({
        title: 'Cargando...',
        text: 'Por favor, espere.',
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });

      axios.get(url).then(response => {
        if (response.status === 200) {
          Swal.close();
          console.log(response.data)
          this.productos = response.data;
          this.productosFiltrados = this.productos;
          
        }
      }).catch(error => {
        Swal.close();
        if (error.response.status === 404) {
          Swal.fire({
            icon: "error",
            title: "No se encontraron elementos...",
            text: "Parece que no hay ningún producto en el catalogo.",
          });
        }
        else if (error.request) {
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: ("Error de red"),
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: ("Error desconocido"),
          });
        }
      });
    },
    manejarError(error) {
      if (error.response) {

        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Parece que algo salió mal...",
        });
        if (error.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "No autorizado...",
            text: "Por favor, inicie sesión nuevamente.",
          });
          this.$router.push("/login")
        }
      } else if (error.request) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: ("Error de red"),
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: ("Error desconocido"),
        });
      }
    }

  },
  async mounted() {
    localStorage.removeItem("idProducto");
    await this.consultarProductos();
  }
};
</script>

<style scoped>
.boton-agregar {
  background-color: #fe8092;
  color: #ffffff;
  font-size: 1.3rem;
  border: #ffc6d1;
}

.subtitulo {
  color: #fe8092;
}

.row {
  margin-bottom: 1rem;
}

.boton-hover:hover {
  background-color: #fe8092;
}

.col-4 {
  max-width: fit-content;
}

.logo-pasteleria {
  width: 120px;
}

#app {
  max-width: 100%;
  overflow-x: hidden;
}
</style>
