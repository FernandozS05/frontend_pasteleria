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
        <tr v-for="(producto, index) in productos" :key="index">
          <td>
            <p class="fs-5 align-self-start" :title="producto.nombre">
              {{ producto.nombre }}
            </p>
          </td>
          <td>
            <p class="fs-5">{{ `$${producto.precio}` }}</p>
          </td>
          <td>
            <p class="fs-5">{{ producto.cantidad }}</p>
          </td>
          <td>
            <button type="button" class="btn btn-primary btn-sm" @click="verInfoProducto(producto)">
              Ver
            </button>
          </td>
          <td>
            <button type="button" class="btn btn-primary btn-sm" @click="editarProducto(producto.id)">
              Editar
            </button>
          </td>
          <td>
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

export default {
  name: "TablaProducto",
  props: {
    productos: {
      type: Array,
      default: () => [],
    },
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
      return null;
    },
    async verInfoProducto(producto) {
      try {
        const urlImagen = await this.obtenerImagen(producto.imagen);
        const { value: cantidad } = await Swal.fire({
          title: producto.nombre,
          html: `
            <div>
              <img src="${urlImagen}" alt="Imagen del Producto" style="width: 100%; height: auto; margin-bottom: 15px;">
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
          this.$emit("agregarCarrito", { ...producto, cantidad: parseInt(cantidad) });
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
  },
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
</style>
