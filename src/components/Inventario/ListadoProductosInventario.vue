<template>
  <div id="app">
    <div>
      <div class="row justify-content-between align-items-center fondo-encabezado">
      </div>
      <div class="row">
        <div class="col container pt-2 bg-light shadow m-3 rounded border border-dark">
          <div class="row align-items-start">
            <p class="col-6 fs-4 text-nowrap fw-medium subtitulo">
              Productos en el inventario
            </p>
            <div class="row d-flex">
              <BarraBusqueda class="col-5 ms-2 align-items-center" :placeholder="Buscar" @filtrar="filtrarProductosTexto" />
              <button type="button" class="btn btn-success boton-agregar ms-3 col-2" @click="nuevoProducto">
                Agregar
              </button>
              <button type="button" class="col-2 btn btn-success boton-agregar ms-3 d-flex align-items-center justify-content-evenly text-center p-1 boton-hover text-nowrap" @click="verInsumos">
                Ver insumos
              </button>
              <div class="col-1 ms-5">
                <CarritoComprasInventario :itemsCarrito="productosCarrito" @eliminarDelCarrito="eliminarDelCarrito" />
              </div>
            </div>
          </div>
          <div class="row p-3">
            <TablaProductosInventario class="col-12 border border-3 rounded" :productos="productosFiltrados" @agregarCarrito="agregarAlCarrito" @editarProducto="editarProducto" @eliminarProducto="eliminarProducto" />
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
import CarritoComprasInventario from "../Carrito/CarritoComprasInventario.vue";

export default {
  name: "ListadoInsumo",
  components: {
    BarraBusqueda,
    TablaProductosInventario,
    CarritoComprasInventario
  },
  data() {
    return {
      productos: [],
      productosFiltrados: [],
      productosCarrito: [],
      productosProximosCaducar: [],
      productosCaducados: []
    };
  },
  methods: {
    verInsumos() {
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

      if(!this.productosFiltrados.length > 0) {
        Swal.fire({
            icon: "info",
            title: "No encontrados",
            text: "No hay ningun producto.",
          });
      }
    },
    agregarAlCarrito(nuevoItem) {
      console.log(nuevoItem);
      const existente = this.productosCarrito.find(item => item.producto.id === nuevoItem.producto.id);
      if (existente) {
        existente.cantidad= parseInt(existente.cantidad) +parseInt(nuevoItem.cantidad);
      } else {
        this.productosCarrito = [...this.productosCarrito, nuevoItem];
      }
      this.actualizarCantidadProducto(nuevoItem.producto, -nuevoItem.cantidad);
    },
    eliminarDelCarrito(itemCarrito) {
      const index = this.productosCarrito.findIndex(item => item.producto.id == itemCarrito.producto.id);
      if (index !== -1) {
        const producto = this.productosCarrito[index].producto;
        const cantidad = this.productosCarrito[index].cantidad;
        this.productosCarrito.splice(index, 1);
        this.actualizarCantidadProducto(producto, cantidad);
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
          this.productos = response.data;
          this.productosFiltrados = this.productos;
          this.verificarCaducidadProductos();
        }
      }).catch(error => {
        Swal.close();
        if (error.response.status === 404) {
          Swal.fire({
            icon: "info",
            title: "No se encontraron elementos...",
            text: "Parece que no hay ningún producto en el inventario.",
          });
        } else if (error.request) {
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: "Error de red",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: "Error desconocido",
          });
        }
      });
    },
    actualizarCantidadProducto(producto, cantidad) {
      const prod = this.productos.find(p => p.id == producto.id);
      if (prod) {
        prod.cantidad += cantidad;
        if (prod.cantidad < 0) prod.cantidad = 0;
      } else {
        producto.cantidad = cantidad;
        this.productos.push(producto);
      }
      if (producto.cantidad === 0) {
        const index = this.productos.findIndex(p => p.id === producto.id);
        if (index !== -1) {
          // eslint-disable-next-line vue/no-mutating-props
          this.productos.splice(index, 1);
        }
      }
      this.filtrarProductosTexto(''); // Refresca la lista de productos filtrados
    },
    verificarCaducidadProductos() {
      const hoy = new Date();
      this.productosProximosCaducar = [];
      this.productosCaducados = [];

      this.productosFiltrados.forEach(producto => {
        const fechaCaducidad = new Date(producto.fecha_caducidad);
        const diferenciaDias = (fechaCaducidad - hoy) / (1000 * 60 * 60 * 24);

        if (diferenciaDias <= 2 && diferenciaDias > 0) {
          this.productosProximosCaducar.push(producto);
        } else if (diferenciaDias <= 0) {
          this.productosCaducados.push(producto);
        }
      });

      if (this.productosProximosCaducar.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "Atención",
          text: "Algunos productos están próximos a caducar.",
        });
      }

      if (this.productosCaducados.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Atención",
          text: "Algunos productos están caducados.",
        });
      }
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
          this.$router.push("/login");
        }
      } else if (error.request) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Error de red",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Error desconocido",
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
