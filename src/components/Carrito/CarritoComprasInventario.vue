<template>
  <div>
    <img @click="mostrarCarrito" class="cart img-fluid" src="../../assets/cart.png" alt="Carrito">
    <p class="position-absolute badge badge-danger rounded-circle bg-danger">{{ itemsCarrito.length }}</p>
  </div>
  <div v-show="visibleCarrito" class="cart-products position-absolute card shadow-sm p-3">
    <p class="position-absolute top-0 end-0 p-2 cursor-pointer" @click="ocultarCarrito">X</p>
    <h4 class="card-title">Productos seleccionados</h4>
    <div class="card-items">
      <ProductoCarrito v-for="(item, index) in itemsCarrito" :key="item.producto.id" :producto="item.producto"
                       :cantidad="item.cantidad" @quitar="quitar(index)" />
    </div>
    <h5>Total: $<strong>{{ totalCarrito }}</strong></h5>
    <h6>
      <template v-if="itemsCarrito.length === 0">
        Sin productos seleccionados
      </template>
    </h6>
    <button class="btn btn-primary" @click="confirmarVenta">
      Realizar venta
    </button>
  </div>
</template>

<script>
import ProductoCarrito from "./ProductoCarrito.vue";
import apiEmpleado from "@/config/ServidorEmpleado";
import apiCliente from "@/config/ServidorCliente";
import axios from "@/config/axios.js";
import Swal from "sweetalert2";

export default {
  name: "CarritoCompras",
  props: {
    itemsCarrito: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    ProductoCarrito,
  },
  data() {
    return {
      visibleCarrito: false,
      totalCarrito: 0,
    };
  },
  methods: {
    quitar(index) {
      const item = this.itemsCarrito[index];
      // eslint-disable-next-line vue/no-mutating-props
      //this.itemsCarrito.splice(index, 1);
      
      this.$emit('eliminarDelCarrito', item);
      this.calcularTotal();
    },
    mostrarCarrito() {
      this.visibleCarrito = true;
      this.calcularTotal();  // Recalcular el total al mostrar el carrito
    },
    ocultarCarrito() {
      this.visibleCarrito = false;
    },
    calcularTotal() {
      this.totalCarrito = this.itemsCarrito.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
    },
    confirmarVenta() {
      if(!this.itemsCarrito.length > 0) {
        return;
      } 

      Swal.fire({
        title: 'Confirmar venta',
        text: 'Por favor, confirme que ha recibido el pago antes de proceder.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.registrarVenta();
        }
      });
    },
    registrarVenta() {
      const url = apiEmpleado.venderProductoInventario;
      const datos = {
        productos: this.itemsCarrito.map(item => ({ id: item.producto.id, cantidad: item.cantidad })),
        total: this.totalCarrito
      };
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

            await this.preguntarFactura();

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
              width: 100%;
              box-sizing: border-box;
              margin: 8px 0;
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
    async preguntarFactura() {
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
            productos: this.itemsCarrito.map(item => ({
              id: item.producto.id,
              nombre: item.producto.nombre,
              precio: item.producto.precio,
              cantidad: item.cantidad
            })),
          };
          await this.generarFactura(datosFactura);
        }
      }
    },
    async generarFactura(datos) {
      try {
        const url = apiCliente.generarFactura;
        Swal.fire({
          title: 'Generando factura...',
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
        this.manejarError(error);
      }
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
    }
  },
  watch: {
    itemsCarrito: {
      handler: "calcularTotal",
      deep: true
    }
  },
  mounted() {
    this.calcularTotal();
  }
};
</script>

<style scoped>
.cart-products {
  top: 15%;
  right: 5%;
  min-width: 290px;
  z-index: 1050;
}

.cart {
  width: 39px;
  height: 38px;
  cursor: pointer;
}

.cursor-pointer {
  cursor: pointer;
}

.btn-primary {
  background-color: #fe8092 !important;
  border-color: #ff3a57 !important;
}

.btn-primary:hover {
  background-color: #f7566e !important;
}
</style>
