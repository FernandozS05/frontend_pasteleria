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
  import axios from '@/config/axios.js';
  import Swal from "sweetalert2";
  export default {
    name: "TablaProductoCatalogo",
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
  
          const contentHtml = `
        <div >
          <p class="description">${producto.descripcion}</p>
          <p class="description">Horas de trabajo: ${producto.horas_trabajo} </p>
          <p class="description">$${producto.precio}</p>
        </div>
      `;
  
          await Swal.fire({
            title: `${producto.nombre}`,
            html: contentHtml,
            focusConfirm: false,
            confirmButtonText: "Cerrar",
            showCloseButton: true,
            showCancelButton: false,
            confirmButtonColor: '#fe8092',
            imageUrl: await this.obtenerImagen(producto.imagen),
            imageWidth: 250,
            imageHeight: 200,
            imageAlt: 'Imagen del producto',
          });
  
        } catch (error) {
          console.error("Error al consultar drogas: ", error);
          return false;
        }
      },
      async verProducto(producto) {
        const urlImagen = await this.obtenerImagen(producto.imagen);
        if (urlImagen) {
          this.mostrarImagen(urlImagen);
        } else {
          Swal.fire("Error", "No se pudo cargar la imagen del producto.", "error");
        }
      },
      mostrarImagen(urlImagen) {
        Swal.fire({
          title: "Imagen del producto",
          imageUrl: urlImagen,
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: "Producto"
        });
      },
      manejarError(error) {
        if (error.response) {
  
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: "Parece que algo salió mal...",
          });
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
  </style>