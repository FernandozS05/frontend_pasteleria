<template>
  <div class="container position-absolute">
    <div class="row w-100 d-flex justify-content-center align-items-center">
      <div class="col-md-6 order-md-1 mt-5 p-3 border border-3 rounded-4">
        <div id="contenedorPago mb-3">
          <p class="fs-4 text-center">
            Descarga el formato de pago, paga en la sucursal mas cercana y
            despues ingresa el folio del pago.
          </p>
          <a class="button rght border download" @click="descargarFormato">Descargar Formato</a>
        </div>
        <div id="contenedorRegistro">
          <label for="inputFolio">
            <p class="fs-4 text-center">
              Ingresa los datos del pago, una vez que lo hayas realizado.
            </p>
          </label>
          <form id="inputFolio" @submit.prevent="registrarPago">
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">
                <p class="fs-5">Folio de pago</p>
              </label>
              <input v-model="folio" type="number" class="form-control" id="exampleInputEmail1"
                aria-describedby="emailHelp" />
            </div>
            <button type="submit" class="button rght border download">
              Registrar
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/config/axios.js";
import { toast } from "vue3-toastify";
import toastConf from "@/config/toast";
import apiCliente from "@/config/ServidorCliente.js";
import Swal from "sweetalert2";
export default {
  props: {
    pedido: Object,
  },
  data() {
    return {
      folio: Number,
    };
  },
  methods: {
    descargarFormato() {
      const url = apiCliente.generarPago;

      const datos = {
        anticipo: Math.round(parseInt(this.pedido.total) / 2),
        metodo_pago: "Efectivo.",
        concepto:
          this.pedido.estado == "Pendiente"
            ? "Pago anticipo."
            : "Pago liquidacion.",
      };
      toast
        .promise(
          axios.post(url, datos, { responseType: "blob" }),
          {
            pending: "Generando forma de pago ...",
            success: "Forma de pago generada.",
            error: "Error al generar forma de pago.",
          },
          toastConf
        )
        .then(async (respuesta) => {
          if (respuesta.status === 200) {
            const blob = new Blob([respuesta.data], {
              type: "application/pdf",
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.href = url;
            a.download = `Forma_pago_${this.pedido.id}.pdf`;

            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            Swal.fire({
              position: "center",
              icon: "success",
              title: "Pago registrado correctamente.",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((error) => {
          this.manejarError(error);
        });
    },
    registrarPago() {
      let anticipado = false;
      if (this.pedido.id_anticipo != null) {
        anticipado = true;
      }
      const url = apiCliente.registrarPago + `${this.pedido.id}`;
      const datos = {
        monto: Math.round(parseInt(this.pedido.total) / 2),
        direccion: "Calle principal #5, Col.Prueba, Xalapa, Ver.",
        folio: this.folio,
        total_restante:
          parseInt(this.pedido.total) -
          Math.round(parseInt(this.pedido.total) / 2),
        metodo_pago: "Efectivo",
        sucursal: "Sucursal principal.",
        anticipado: anticipado,
      };
      toast
        .promise(
          axios.post(url, datos, { responseType: "blob" }),
          {
            pending: "Registrando pago...",
            success: "Pago registrado.",
            error: "Error al registrar pago.",
          },
          toastConf
        )
        .then(async (respuesta) => {
          if (respuesta.status === 200) {
            const blob = new Blob([respuesta.data], {
              type: "application/pdf",
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.href = url;
            a.download = "nombre-del-archivo.pdf";

            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            Swal.fire({
              position: "center",
              icon: "success",
              title: "Pago registrado correctamente.",
              showConfirmButton: false,
              timer: 1500,
            });
            await this.preguntarFactura(this.pedido.productos);
            this.$router.push("/pedidos");
          }
        })
        .catch((error) => {
          this.manejarError(error);
        });
    },
    manejarError(error) {
      if (error.response) {
        if (error.response.status === 401) {
          this.$router.push("/login");
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: "No autorizado.",
          });
        } else if (error.response.status === 404) {
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: "Información no encontrada.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: "Error en la solicitud.",
          });
        }
      } else if (error.request) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Error de red.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Error desconocido.",
        });
      }
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
    async preguntarFactura(productos) {
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
            productos: productos,
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
    redirigirATablaPedidos() {
      this.$router.push("/tablaPedidos");
    },
  },
};
</script>

<style scoped>
.download {
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  text-align: center;
  font-size: 21px;
  font-weight: 400;
  padding: 12px 0;
  width: 100%;
  display: table;
  background-color: #fe8092;
  color: #ffffff;
  cursor: pointer;
  text-decoration: none;
  margin-top: 20px;
}

.download:hover {
  background-color: #ee4a65;
  border-color: #ee4a65;
}
</style>
