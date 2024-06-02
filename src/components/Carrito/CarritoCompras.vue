<template>
  <div>
    <img @click="mostrarCarrito" class="cart img-fluid" src="../../assets/cart.png" alt="Carrito">
    <p class="position-absolute badge badge-danger rounded-circle bg-danger">{{ itemsCarrito.length }}</p>
  </div>
  <div v-show="visibleCarrito" class="cart-products position-absolute card shadow-sm p-3">
    <p class="position-absolute top-0 end-0 p-2 cursor-pointer" @click="ocultarCarrito">X</p>
    <h4 class="card-title">Productos seleccionados</h4>
    <div class="card-items">
      <ProductoCarrito 
        v-for="(item, index) in itemsCarrito" 
        :key="item.producto.id" 
        :producto="item.producto"
        :cantidad="item.cantidad" 
        @quitar="quitar(index)" />
    </div>
    <h5>Total: $<strong>{{ totalCarrito }}</strong></h5>
    <h6>
      <template v-if="itemsCarrito.length === 0">
        Sin productos seleccionados
      </template>
      <template v-else>
        <template v-if="consultando">
          Consultando agenda...
        </template>
        <template v-else>
          Entrega más próxima el día {{ fechaProxima }} a las {{ horaProxima }}
        </template>
      </template>
    </h6>
    <button class="btn btn-primary" @click="registrarPedido">
      Realizar pedido
    </button>
  </div>
</template>

<script>
import ProductoCarrito from "./ProductoCarrito.vue";
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
      fechaProxima: "",
      horaProxima: "",
      consultando: false,
    };
  },
  methods: {
    quitar(index) {
      // eslint-disable-next-line vue/no-mutating-props
      this.itemsCarrito.splice(index, 1);
      this.calcularTotal();
    },
    revisar() {
      const tipoUsuario = localStorage.getItem("tipoUsuario");
      return tipoUsuario === "empresa";
    },
    mostrarCarrito() {
      this.visibleCarrito = true;
    },
    ocultarCarrito() {
      this.visibleCarrito = false;
    },
    async calcularTotal() {
      this.totalCarrito = this.itemsCarrito.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
      await this.consultarAgenda();
    },
    async obtenerDatosCliente() {
      const { value: formValues } = await Swal.fire({
        title: "¿A nombre de quién se hará el pedido?",
        html: `
          <input id="swal-input1" class="swal2-input" placeholder="Ingresa el nombre completo">
          <input id="swal-input2" class="swal2-input" placeholder="Ingresa el número de teléfono">
        `,
        focusConfirm: false,
        preConfirm: () => {
          const nombre = document.getElementById('swal-input1').value;
          const telefono = document.getElementById('swal-input2').value;

          if (!nombre || !telefono) {
            Swal.showValidationMessage('Por favor, completa todos los campos');
            return null;
          }

          return {
            nombre,
            telefono,
          };
        },
      });
      return formValues || null;
    },
    async registrarPedido() {
      try {
        let cliente = await this.obtenerDatosCliente();
        if (!cliente) return;

        const idUsuario = localStorage.getItem("idUsuario");
        const url = apiCliente.registrarPedido;
        const datos = {
          usuario: idUsuario,
          nombre_cliente: cliente.nombre,
          telefono: cliente.telefono,
          lugar_realizado: this.revisar() ? "Sucursal" : "Internet",
          productos: this.itemsCarrito.map(item => ({ id: item.producto.id, cantidad: item.cantidad })),
          total: this.totalCarrito,
        };

        const respuesta = await axios.post(url, datos);

        if (respuesta.status === 200) {
          const idPedido = respuesta.data.id_pedido;
          localStorage.setItem("idPedido", idPedido);
          this.$router.push("/registro-pedido");
        }
      } catch (e) {
        this.manejarError(e);
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
    },
    async consultarAgenda() {
      try {
        if (!this.itemsCarrito.length) return;

        this.consultando = true;

        const url = '/empleado/agenda/consultar-fechas-horas';
        let totalHoras = this.itemsCarrito.reduce((total, item) => total + item.producto.horas_trabajo * item.cantidad, 0);

        const datos = { horas: totalHoras };
        const respuesta = await axios.post(url, datos);

        if (respuesta.status === 200) {
          console.log(respuesta.data);
          this.fechaProxima = respuesta.data[0].fecha;
          this.horaProxima = `${respuesta.data[0].hora}:00 hrs`;
        }

        this.consultando = false;
      } catch (e) {
        console.log(e);
        this.manejarError(e);
        this.consultando = false;
      }
    },
  },
  mounted() {},
  watch: {
    itemsCarrito: "calcularTotal",
  },
};
</script>

<style scoped>
.cart-products {
  position: absolute;
  top: 15%; /* Posicionar justo debajo del icono */
  right: 5%; /* Alinear a la derecha del contenedor */
  min-width: 290px;
  z-index: 1050; /* Asegurar que esté por encima de otros contenidos */
}

.cart {
  width: 39px;
  height: 38px;
  cursor: pointer;
}

.close-btn {
  top: -10px;
  right: -10px;
}

/* Asegura que el cursor sea un puntero en los botones de cerrar */
.cursor-pointer {
  cursor: pointer;
}

.btn-primary {
  background-color: #fe8092 !important; /* Usar !important para asegurar que sobrescribe el estilo de Bootstrap */
  border-color: #ff3a57 !important; /* Asegúrate de cambiar también el color del borde si es necesario */
}

.btn-primary:hover {
  background-color: #f7566e !important; /* Usar !important para asegurar que sobrescribe el estilo de Bootstrap */
}
</style>
