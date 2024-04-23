<template>
  <div id="app">
    <div>
      <div class="row justify-content-between align-items-center fondo-encabezado">
      </div>
      <div class="row">
        <div class="col container pt-2 bg-light shadow m-3 rounded border border-dark">
          <div class="row">
            <p class="col-10 fs-4 d-flex align-items-start text-nowrap fw-medium subtitulo">
              Productos en el inventario
              <BarraBusqueda class="col-6 ms-5 align-items-center" :placeholder="Buscar"
                @filtrar="filtrarProductosTexto" />
              <button type="button"
                class="btn btn-success boton-agregar ms-5"
                @click="nuevoProducto">
                Agregar
              </button>
              <button type="button"
                class="btn btn-success boton-agregar ms-5 d-flex align-items-center justify-content-evenly text-center p-1 boton-hover text-nowrap"
                @click="verInsumos">
                Ver insumos
              </button>
            </p>
          </div>
          <div class="row p-3">
            <TablaProductosInventario class="col-12 border border-3 rounded" :productos="productosFiltrados" @editarProducto="editarProducto"
              @eliminarProducto="eliminarProducto" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarraBusqueda from "../Barras/BarraBusqueda.vue";
import TablaProductosInventario from "../Producto/TablaProductosInventario.vue";
import apiEmpleado from "@/config/ServidorEmpleado";
import axios from "@/config/axios.js";
import Swal from 'sweetalert2';
export default {
  name: "ListadoInsumo",
  components: {
    BarraBusqueda,
    TablaProductosInventario,
  },
  data() {
    return {
      productos: [],
      productosFiltrados: []
    };
  },
  methods: {
    verInsumos(){
      this.$router.push("/listado-insumo");
    },
    filtrarProductosTexto(textoDeBusqueda) {
      if (textoDeBusqueda) {
        this.productosFiltrados = this.productos.filter(insumo =>
          insumo.nombre.toLowerCase().includes(textoDeBusqueda.toLowerCase())
        );
      } else {
        this.productosFiltrados = this.productos;
      }
    },
    nuevoProducto() {
      localStorage.setItem("ubicacionProducto", "inventario");
      this.$router.push("/formulario-producto");
    },
    editarProducto(idInsumo) {
      localStorage.setItem("idProducto", idInsumo);
      localStorage.setItem("ubicacionProducto", "inventario");
      this.$router.push("/formulario-producto");
    },
    eliminarProducto(idProducto) {
      const url = apiEmpleado.eliminarProductoInventario + idProducto;
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
      const url = apiEmpleado.consultarProductosInventario;
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
            icon: "info",
            title: "No se encontraron elementos...",
            text: "Parece que no hay ningun producto en el inventario.",
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
          text: "Parece que algo salio mal...",
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