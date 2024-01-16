<template>
    <div class="row  w-100 d-flex justify-content-center align-items-center">
      <div class="col-auto mt-3 p-2 border border-3 rounded-4">
          <h4 class="mt-4 mb-3">Detalles del Pedido</h4>
          <p class="fs-5 mb-3">{{`Realizado en: ${this.detalles.fechaPedido.slice(0,10)}`}}</p>
          
          <p class="fs-6 mt-3">{{`Total: $${this.detalles.total}`}}</p>
          <div class="mb-3">
            <p class="fs-4 fw-medium">Detalles de entrega</p>
            <p class="fs-6">{{ `Fecha de entrega: ${this.entrega.fecha_entrega.slice(0,10)}` }}</p>
            <p class="fs-6">{{ `Forma entrega: ${this.entrega.entrega.formaEntrega}` }}</p>
          </div>
          <div class="mb-3">
            <p class="fs-4 fw-medium">Pagos</p>
            <p class="fs-5 fw-medium">Pago anticipo</p>
            <div v-if="this.detalles.idPagoAnticipo != null" class="row">
              <p class="fs-6">{{ `Metodo pago: ${this.pagoAnticipo.metodo}` }}</p>
              <p class="fs-6">{{ `Folio: ${this.pagoAnticipo.folio}` }}</p>
              <p class="fs-6">{{ `Monto: $${this.pagoAnticipo.total}` }}</p>
              <p class="fs-6">{{ `Dirección: ${this.pagoAnticipo.direccion}` }}</p>
            </div>
            <div v-else class="row">
              <p class="fs-6">{{ "Sin pago de anticipo registrado."}}</p>
            </div>
            <p class="fs-5 fw-medium">Pago liquidacion</p>
            <div v-if="this.detalles.idPagoLiquidacion != null" class="row">
              <p class="fs-6">{{ `Metodo pago: ${this.pagoLiquidacion.metodo}` }}</p>
              <p class="fs-6">{{ `Folio: ${this.pagoLiquidacion.folio}` }}</p>
              <p class="fs-6">{{ `Monto: $${this.pagoLiquidacion.total}` }}</p>
              <p class="fs-6">{{ `Dirección: ${this.pagoLiquidacion.direccion}` }}</p>
            </div>
            <div v-else class="row">
              <p class="fs-6">{{ "Sin pago de liquidacion registrado."}}</p>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center mt-3">
            <button class="btn btn-primary" @click="volver">
              Volver
            </button>
            <button class="btn btn-danger" @click="consultar">
              Consultar cancelacion
            </button>
            <button class="btn btn-danger" role="button" :disabled="!autorizado" @click="cancelar">
              Cancelar Pedido
            </button>
          </div>
        </div>
      </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import toastConf from "@/config/toast";
import apiCliente from "@/config/ServidorCliente.js";

export default {
  name: "ElementoPedido",
  props: {
    detalles: Object,
    pagoAnticipo: Object,
    entrega: Object,
    pagoLiquidacion: Object,
  },
  data(){
    return{
      autorizado: false
    }
  },
  methods: {
    consultar(){
      
      const url = apiCliente.consultarCancelacion + this.detalles.idPedido;
      console.log(url);
      toast.promise(
        axios.get(url, { withCredentials: true }),
        {
          pending: 'Consultando cancelación...', // Mensaje mientras la promesa está pendiente
          success: 'Cancelacion autorizada.', // Mensaje cuando la promesa se resuelve con éxito
          error: 'No autorizada.', // Mensaje cuando la promesa es rechazada
        }, toastConf
      ).then(async (respuesta) => {
        // Puedes realizar acciones adicionales después de que la promesa se resuelva
        // (opcional dependiendo de tus necesidades)
        console.log('Registro completado');

        // Realizar acciones adicionales según la respuesta exitosa
        if (respuesta.status === 200) {

          const mensaje = respuesta.data;
          toast.success(mensaje)
          this.autorizado= true;
        }
      }).catch((error) => {
        // Manejar errores de la petición
        if (error.response) {
          console.error('Mensaje del servidor:', error.response.data.error);

          if (error.response.status === 401) {
            console.log("No autorizado");
              const mensaje = error.response.data;
              toast.error(mensaje);
            //toast.error('No autorizado.');
          }
          if (error.response.status === 404) {
            toast.error('Ruta no encontrada.');
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
    cancelar() {
      const url = apiCliente.cancelarPedido + this.detalles.idPedido;

      toast.promise(
        axios.delete(url, { withCredentials: true, responseType: 'blob' }),
        {
          pending: 'Cancelando pedido ...', // Mensaje mientras la promesa está pendiente
          success: 'Pedido Cancelado.', // Mensaje cuando la promesa se resuelve con éxito
          error: 'Cancelacion interrumpida.', // Mensaje cuando la promesa es rechazada
        }, toastConf
      ).then(async (respuesta) => {
        // Puedes realizar acciones adicionales después de que la promesa se resuelva
        // (opcional dependiendo de tus necesidades)

        // Realizar acciones adicionales según la respuesta exitosa
        if (respuesta.status === 200) {
          const blob = new Blob([respuesta.data], { type: 'application/pdf' });
          console.log(blob);
          // Usa FileSaver.js para descargar el archivo
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');

          // Configura el enlace para descargar automáticamente el archivo
          a.href = url;
          a.download = `Voucher_devolucion_${this.detalles.idPedido}.pdf`;

          // Añade el enlace al documento y simula un clic para iniciar la descarga
          document.body.appendChild(a);
          a.click();

          // Limpia y libera recursos
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          console.log(respuesta.data) //
          toast.success("Pedido cancelado correctamente.")

          //this.$router.push("pedidos");
        }
      }).catch((error) => {
        // Manejar errores de la petición
        if (error.response) {
          console.error('Mensaje del servidor:', error.response.data.error);

          if (error.response.status === 401) {
            toast.error('No autorizado.');
          }
          if (error.response.status === 404) {
            toast.error('Ruta no encontrada.');
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
    volver(){
      this.$router.push("pedidos");
    },
    editarPedido() {
      this.$emit("editarPedido");
    },
    cancelarPedido() {
      this.$emit("cancelarPedido");
    },

  },
  mounted(){
    console.log(this.detalles);
    console.log(this.entrega);
    console.log(this.pagoAnticipo);
}
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
