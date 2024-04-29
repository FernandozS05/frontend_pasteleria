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
import apiCliente from "@/config/ServidorCliente";
import apiEmpleado from "@/config/ServidorEmpleado";
import axios from '@/config/axios.js';
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

        const contentHtml = `
      <div >
        <p class="description">${producto.descripcion}</p>
        <p class="description">$${producto.precio}</p>
      </div>
    `;

        await Swal.fire({
          title: `${producto.nombre}`,
          html: contentHtml,
          focusConfirm: false,
          confirmButtonText: "Venta",
          showCloseButton: true,
          showCancelButton: false,
          confirmButtonColor: '#fe8092',
          imageUrl: await this.obtenerImagen(producto.imagen),
          imageWidth: 250,
          imageHeight: 200,
          imageAlt: 'Imagen del Equipo'
        }).then(async (result) => {
          if (result.isConfirmed) {
            await Swal.fire({
              title: `Venta de producto`,
              text: "Realiza el cobro al cliente y despues genera el ticket.",
              focusConfirm: true,
              confirmButtonText: "Generar ticket",
              cancelButtonText: "Cancelar",
              showCloseButton: true,
              showCancelButton: true,
              confirmButtonColor: '#fe8092',
            }).then(async (result) => {
              if (result.isConfirmed) {
                this.registrarVenta(producto);
              }
            })
          }
        });

      } catch (error) {
        console.error("Error al consultar drogas: ", error);
        return false;
      }
    },
    registrarVenta(producto) {
      const url = apiEmpleado.venderProductoInventario;
      const datos = {
        productos: [{ id: producto.id, cantidad: 1 }],
        total: producto.precio
      }
      Swal.fire({
        title: 'Registrando venta...',
        text: 'Por favor, espere.',
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
      axios.post(url, datos, { responseType: "blob" })
        .then(async (respuesta) => {
          if (respuesta.status === 200) {
            Swal.close();
            const blob = new Blob([respuesta.data], {
              type: "application/pdf",
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.href = url;
            a.download = "Ticket_compra.pdf";

            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            await Swal.fire({
              position: "center",
              icon: "success",
              title: "Compra registrada correctamente.",
              showConfirmButton: false,
              timer: 1500,
            });

            await this.preguntarFactura(producto);

            window.location.reload();
          }
        })
        .catch((error) => {
          Swal.close();
          this.manejarError(error);
        });
    },
    async obtenerDatosCliente() {
      const result = await Swal.fire({
        title: 'Datos del cliente',
        html: `
      <style>
        .swal2-input, .swal2-select {
          width: 100%; /* Asegura que los campos usen todo el ancho disponible */
          box-sizing: border-box; /* Añade el padding y border dentro del ancho y alto del elemento */
          margin: 8px 0; /* Añade un margen uniforme */
        }
      </style>
      <input type="text" id="nombre" class="swal2-input" placeholder="Nombre completo">
      <input type="text" id="rfc" class="swal2-input" placeholder="RFC">
      <select id="razon-social" class="swal2-select">
        <option value="" disabled selected>Razón Social</option>
        <option value="Persona Física">Persona Física</option>
        <option value="Persona Moral">Persona Moral</option>
        <option value="Autónomo">Autónomo</option>
        <option value="Empresa Pública">Empresa Pública</option>
        <option value="Empresa Privada">Empresa Privada</option>
        <option value="ONG">ONG</option>
      </select>
      <input type="text" id="direccion" class="swal2-input" placeholder="Dirección">
      <input type="email" id="correo" class="swal2-input" placeholder="Correo electrónico">
      <select id="uso-factura" class="swal2-select">
        <option value="" disabled selected>Uso de Factura</option>
        <option value="Gastos Generales">Gastos Generales</option>
        <option value="Inversión">Inversión</option>
        <option value="Costo de Venta">Costo de Venta</option>
        <option value="Gastos Operativos">Gastos Operativos</option>
        <option value="Otros">Otros</option>
      </select>
    `,
        focusConfirm: false,
        preConfirm: () => {
          const nombre = document.getElementById('nombre').value;
          const rfc = document.getElementById('rfc').value;
          const razonSocial = document.getElementById('razon-social').value;
          const direccion = document.getElementById('direccion').value;
          const correo = document.getElementById('correo').value;
          const usoFactura = document.getElementById('uso-factura').value;

          // Validación de campos
          if (!nombre || !rfc || rfc.length !== 13 || !razonSocial || !direccion || !correo || !usoFactura) {
            Swal.showValidationMessage('Por favor, complete todos los campos correctamente.');
            return false;
          }
          return {
            nombre,
            rfc,
            razon: razonSocial,
            direccion,
            correo,
            usoFactura
          };
        },
        confirmButtonText: 'Generar Factura',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      });

      return result.isConfirmed ? result.value : null;
    },
    async preguntarFactura(producto) {
      const resultado = await Swal.fire({
        title: "¿Desea generar una factura para esta venta?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, generar factura"
      });

      if (resultado.isConfirmed) {
        const datosCliente = await this.obtenerDatosCliente();

        if (datosCliente) {
          const datosFactura = {
            cliente: datosCliente,
            productos: [{
              nombre: producto.nombre,
              cantidad: 1,
              precio: producto.precio
            }],
          };
          console.log(datosFactura);
          await this.generarFactura(datosFactura);
        }
      }
    },
    async generarFactura(datos) {

      try {
        const url = apiCliente.generarFactura;
        console.log(url);
        Swal.fire({
          title: 'Registrando venta...',
          text: 'Por favor, espere.',
          didOpen: () => {
            Swal.showLoading();
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false
        });
        const respuesta = await axios.post(url, datos);

        if (respuesta.status === 200) {
          Swal.close();

          await Swal.fire({
            position: "center",
            icon: "success",
            title: "Factura enviada exitosamente.",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        Swal.close();
        console.log(error);
        this.manejarError(error);
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
          text: "Parece que algo salio mal...",
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