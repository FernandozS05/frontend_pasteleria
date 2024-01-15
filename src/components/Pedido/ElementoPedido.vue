<template>
  <div class="container position-absolute top-50 start-50 translate-middle">
    <div class="row">
      <div class="col-md-6 order-md-1 mt-5">
        <div class="gradient-background p-3">
          <h4 class="mt-4 mb-3">Detalles del Pedido</h4>
          <p class="fs-5 mb-3">{{`Realizado: ${this.detalles.fechaPedido}`}}</p>
          <div class="mb-3" v-if="detalles.productos">
            <label for="listaProductos" class="form-label"
              >Productos</label
            >
            <ul id="listaProductos">
              <li v-for="(producto, index) in productos" :key="index">
                {{ producto.cantidad }} - {{ producto.nombre }} 
              </li>
            </ul>
            <p>{{`Total: ${this.total}`}}</p>
          </div>

          <div class="mb-3">
            <p class="fs-5">Detalles de entrega</p>
            <p class="fs-6">{{ `Fecha de entrega: ${this.entrega.fecha}` }}</p>
            <p class="fs-6">{{ `Direccion: ${this.entrega.direccion}` }}</p>
            <p class="fs-6">{{ `Forma entrega: ${this.entrega.formaEntrega}` }}</p>
          </div>
          <div class="mb-3">
            <p class="fs-5">Pagos</p>
            <p class="fs-6">{{ `Total anticipo: ${this.detalles.totalAnticipo}` }}</p>
            <p class="fs-5">Pago anticipo</p>
            <div v-if="this.detalles.pagoAnticipo != null" class="row">
              <p class="fs-6">{{ `Metodo pago: ${this.pagoAnticipo.metodoPago}` }}</p>
              <p class="fs-6">{{ `Folio: ${this.pagoAnticipo.direccion}` }}</p>
              <p class="fs-6">{{ `Monto: ${this.pagoAnticipo.monto}` }}</p>
              <p class="fs-6">{{ `Dirección: ${this.pagoAnticipo.direccion}` }}</p>
            </div>
            <div v-else class="row">
              <p class="fs-6">{{ "Sin pago de anticipo registrado."}}</p>
            </div>
            <p class="fs-5">Pago anticipo</p>
            <div v-if="this.detalles.pagoLiquidacion != null" class="row">
              <p class="fs-6">{{ `Metodo pago: ${this.pagoLiquidacion.metodoPago}` }}</p>
              <p class="fs-6">{{ `Folio: ${this.pagoLiquidacion.direccion}` }}</p>
              <p class="fs-6">{{ `Monto: ${this.pagoLiquidacion.monto}` }}</p>
              <p class="fs-6">{{ `Dirección: ${this.pagoLiquidacion.direccion}` }}</p>
            </div>
            <div v-else class="row">
              <p class="fs-6">{{ "Sin pago de liquidacion registrado."}}</p>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center mt-3">
            <button class="btn btn-primary" @click="editarPedido">
              Editar Pedido
            </button>
            <button class="btn btn-danger" @click="cancelarPedido">
              Cancelar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import apiCliente from "@/config/ServidorCliente";
import axios from 'axios';
import toastConf from "@/config/toast";
export default {
  name: "ElementoPedido",
  props: {
    detalles: Object,
  },
  data(){
    return{
      padoAnticipo: "",
      pagoLiquidacion: "",
      entrega: ""
    }
  },
  methods: {
    consultarEntrega(){
      const idEntrega = this.detalles.idEntrega;
      const url = apiCliente.consultarEntrega + idEntrega;

      toast.promise(
        axios.get(url, { withCredentials: true }),
        {
          pending: 'Consultando entrega...', // Mensaje mientras la promesa está pendiente
          success: 'Entrega obtenida.', // Mensaje cuando la promesa se resuelve con éxito
          error: 'No se pudo obtener la entrega.', // Mensaje cuando la promesa es rechazada
        }, toastConf
      ).then((respuesta) => {
        // Puedes realizar acciones adicionales después de que la promesa se resuelva
        // (opcional dependiendo de tus necesidades)
        console.log('Consulta completada');

        // Realizar acciones adicionales según la respuesta exitosa
        if (respuesta.status === 200) {
          console.log(respuesta.data)
          this.entrega = respuesta.data;
        }
      }).catch((error) => {
        // Manejar errores de la petición
        if (error.response) {
          console.error('Mensaje del servidor:', error.response.data.error);

          if (error.response.status === 401) {
            toast.error('No autorizado.', toastConf);
            this.$router.push("/pedidos");
          }
          if (error.response.status === 404) {
            toast.error('Informacion no encontrada.', toastConf);
          }
        } else if (error.request) {
          // La solicitud fue realizada, pero no se recibió respuesta
          console.error('No se recibió respuesta del servidor');
          toast.error('Error de red', toastConf);
        } else {
          // Algo sucedió al configurar la solicitud que desencadenó un error
          console.error('Error de configuración de la solicitud', error);
          toast.error('Error desconocido', toastConf);
        }
      });
    },
    consultarPagoAnticipo(){
      const idPago = this.detalles.idPagoAnticipo;
      const url = apiCliente.consultarPago + idPago;

      toast.promise(
        axios.get(url, { withCredentials: true }),
        {
          pending: 'Consultando pago...', // Mensaje mientras la promesa está pendiente
          success: 'Pago obtenido.', // Mensaje cuando la promesa se resuelve con éxito
          error: 'No se pudo obtener el pago.', // Mensaje cuando la promesa es rechazada
        }, toastConf
      ).then((respuesta) => {
        // Puedes realizar acciones adicionales después de que la promesa se resuelva
        // (opcional dependiendo de tus necesidades)
        console.log('Consulta completada');

        // Realizar acciones adicionales según la respuesta exitosa
        if (respuesta.status === 200) {
          console.log(respuesta.data)
          this.pagoAnticipo = respuesta.data;
        }
      }).catch((error) => {
        // Manejar errores de la petición
        if (error.response) {
          console.error('Mensaje del servidor:', error.response.data.error);

          if (error.response.status === 401) {
            toast.error('No autorizado.', toastConf);
            this.$router.push("/pedidos");
          }
          if (error.response.status === 404) {
            toast.error('Informacion no encontrada.', toastConf);
          }
        } else if (error.request) {
          // La solicitud fue realizada, pero no se recibió respuesta
          console.error('No se recibió respuesta del servidor');
          toast.error('Error de red', toastConf);
        } else {
          // Algo sucedió al configurar la solicitud que desencadenó un error
          console.error('Error de configuración de la solicitud', error);
          toast.error('Error desconocido', toastConf);
        }
      });
    },
    consultarPagoLiquidacion(){
      const idPago = this.detalles.idPagoLiquidacion;
      const url = apiCliente.consultarPago + idPago;

      toast.promise(
        axios.get(url, { withCredentials: true }),
        {
          pending: 'Consultando pago...', // Mensaje mientras la promesa está pendiente
          success: 'Pago obtenido.', // Mensaje cuando la promesa se resuelve con éxito
          error: 'No se pudo obtener el pago.', // Mensaje cuando la promesa es rechazada
        }, toastConf
      ).then((respuesta) => {
        // Puedes realizar acciones adicionales después de que la promesa se resuelva
        // (opcional dependiendo de tus necesidades)
        console.log('Consulta completada');

        // Realizar acciones adicionales según la respuesta exitosa
        if (respuesta.status === 200) {
          console.log(respuesta.data)
          this.pagoLiquidacion = respuesta.data;
        }
      }).catch((error) => {
        // Manejar errores de la petición
        if (error.response) {
          console.error('Mensaje del servidor:', error.response.data.error);

          if (error.response.status === 401) {
            toast.error('No autorizado.', toastConf);
            this.$router.push("/pedidos");
          }
          if (error.response.status === 404) {
            toast.error('Informacion no encontrada.', toastConf);
          }
        } else if (error.request) {
          // La solicitud fue realizada, pero no se recibió respuesta
          console.error('No se recibió respuesta del servidor');
          toast.error('Error de red', toastConf);
        } else {
          // Algo sucedió al configurar la solicitud que desencadenó un error
          console.error('Error de configuración de la solicitud', error);
          toast.error('Error desconocido', toastConf);
        }
      });
    },
    editarPedido() {
      this.$emit("editarPedido");
    },
    cancelarPedido() {
      this.$emit("cancelarPedido");
    },
  },
};
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(to top, #ffffff, #ffc6d1);
}

.text-rose {
  color: #fe8092;
}

.btn-rose {
  background-color: #fe8092;
  color: #ffffff;
}

.btn-outline-secondary {
  color: #fe8092;
  border-color: #fe8092;
}
</style>
