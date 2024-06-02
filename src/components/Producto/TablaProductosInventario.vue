<template>
  <div id="app">
    <table class="table">
      <thead>
        <tr>
          <th>
            <p class="fs-5 fw-medium align-self-end">Nombre</p>
          </th>
          <th>
            <p class="fs-5 fw-medium align-self-end">Precio</p>
          </th>
          <th>
            <p class="fs-5 fw-medium align-self-end">Cantidad</p>
          </th>
          <th>
            <p class="fs-5 fw-medium align-self-end">Detalles</p>
          </th>
          <th>
            <p class="fs-5 fw-medium align-self-end">Editar</p>
          </th>
          <th>
            <p class="fs-5 fw-medium align-self-end">Eliminar</p>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(producto, index) in productos" :key="index" >
          <td :class="caducidadClass(producto)">
            <p class="fs-5 align-self-start" :title="producto.nombre">
              {{ producto.nombre }}
            </p>
          </td >
          <td :class="caducidadClass(producto)">
            <p class="fs-5">{{ `$${producto.precio}` }}</p>
          </td>
          <td :class="caducidadClass(producto)">
            <p class="fs-5">{{ producto.cantidad }}</p>
          </td>
          <td :class="caducidadClass(producto)">
            <button type="button" class="btn btn-primary btn-sm" @click="verInfoProducto(producto)">
              Ver
            </button>
          </td>
          <td :class="caducidadClass(producto)">
            <button type="button" class="btn btn-primary btn-sm" @click="editarProducto(producto.id)">
              Editar
            </button>
          </td>
          <td :class="caducidadClass(producto)">
            <button type="button" class="btn btn-danger btn-sm" @click="eliminarProducto(producto.id)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import apiArchivos from "@/config/ServidorArchivos";
import axios from "@/config/axios.js";
import Swal from "sweetalert2";

const imgDefault = require("../../assets/pastel_default.png"); // Asegúrate de tener una imagen por defecto en tu directorio de assets

export default {
  name: "TablaProducto",
  props: {
    productos: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      productosProximosCaducar: [],
      productosCaducados: []
    };
  },
  mounted() {
  },
  methods: {
    editarProducto(idProducto) {
      this.$emit("editarProducto", idProducto);
    },
    eliminarProducto(idProducto) {
      Swal.fire({
        title: "¿Quieres eliminar este producto?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Eliminar",
        denyButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.$emit("eliminarProducto", idProducto);
        }
      });
    },
    async obtenerImagen(nombre) {
      const url = `${apiArchivos.obtener}?ruta=${nombre}`;
      try {
        const response = await axios.get(url);
        if (response.status === 200) {
          return response.data.url;
        }
      } catch (error) {
        console.log(error);
      }
      return imgDefault; // Retorna la imagen por defecto en caso de error
    },
    async verInfoProducto(producto) {
      try {
        const urlImagen = producto.imagen ? await this.obtenerImagen(producto.imagen) : imgDefault;
        const { value: cantidad } = await Swal.fire({
          title: producto.nombre,
          html: `
            <div>
              <img src="${urlImagen}" alt="Imagen del Producto" style="width: 100px; height: 80px; margin-bottom: 15px;">
              <p class="description">${producto.descripcion}</p>
              <p class="price"><strong>Precio:</strong> $${producto.precio}</p>
              <label for="cantidad">Cantidad:</label>
              <input id="cantidad" type="number" min="1" max="${producto.cantidad}" value="1" class="swal2-input">
            </div>
          `,
          focusConfirm: false,
          confirmButtonText: "Agregar al carrito",
          showCloseButton: true,
          preConfirm: () => {
            const cantidad = document.getElementById('cantidad').value;
            if (!cantidad || cantidad < 1 || cantidad > producto.cantidad) {
              Swal.showValidationMessage(`Por favor, ingrese una cantidad válida (1-${producto.cantidad}).`);
              return false;
            }
            return cantidad;
          },
        });

        if (cantidad) {
          //this.actualizarCantidadProducto(producto, parseInt(cantidad));
          this.$emit("agregarCarrito", { producto, cantidad: parseInt(cantidad) });
          Swal.fire({
            icon: "success",
            title: "Producto agregado al carrito",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        console.error("Error al consultar: ", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo obtener la información del producto.",
        });
      }
    },
    actualizarCantidadProducto(producto, cantidadAgregada) {
      producto.cantidad -= cantidadAgregada;
      if (producto.cantidad === 0) {
        const index = this.productos.findIndex(p => p.id === producto.id);
        if (index !== -1) {
          // eslint-disable-next-line vue/no-mutating-props
          this.productos.splice(index, 1);
        }
      }
    },
    caducidadClass(producto) {
      const hoy = new Date();
      const fechaCaducidad = new Date(producto.fecha_caducidad);
      const diferenciaDias = (fechaCaducidad - hoy) / (1000 * 60 * 60 * 24);

      if (diferenciaDias <= 2 && diferenciaDias > 0) {
        return 'proximo-caducar';
      } else if (diferenciaDias <= 0) {
        return 'caducado';
      }
      return '';
    }
  }
};
</script>

<style scoped>
.fondo-encabezado {
  background-color: #fe8092;
}

.boton-agregar {
  background-color: #fe8092;
  color: #ffffff;
  font-size: 1.3rem;
}

.subtitulo {
  color: #fe8092;
}

.table {
  background-color: #f1edff;
}

thead th {
  border: none;
}

tbody tr {
  border-bottom: 1px solid #ccc;
}

tbody tr:last-child {
  border-bottom: none;
}

tbody td {
  max-width: auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#app {
  max-width: 100%;
  overflow-x: hidden;
}

.description {
  margin-bottom: 15px;
}

.proximo-caducar {
  background-color: rgb(252, 252, 151) !important;
}

.caducado {
  background-color: rgb(252, 176, 176) !important;
}
</style>
