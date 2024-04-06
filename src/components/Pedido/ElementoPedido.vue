<template>
  <div class="row  w-100 d-flex justify-content-center align-items-center">
    <div class="col-auto mt-3 p-2 border border-3 rounded-4">
      <h4 class="mt-4 mb-3">Detalles del Pedido</h4>
      <p class="fs-5 mb-3">{{ `Cliente: ${this.detalles.cliente}` }}</p>
      <p class="fs-5 mb-3">{{ `Realizado en: ${this.detalles.fecha_realizado.slice(0, 10)}` }}</p>

      <p class="fs-6 mt-3">{{ `Total: $${this.detalles.total}` }}</p>
      <div class="mb-3">
        <p class="fs-4 fw-medium">Detalles de entrega</p>
        <p class="fs-6">{{ `Fecha de entrega: ${this.entrega.fecha_entrega ? this.entrega.fecha_entrega.slice(0, 10) : "No disponible"}` }}</p>
        <p class="fs-6">{{ `Forma entrega: ${this.entrega.fecha_entrega ? this.entrega.forma_entrega : "No disponible"}`
          }}</p>
      </div>
      <div class="mb-3">
        <p class="fs-4 fw-medium">Pagos</p>
        <p class="fs-5 fw-medium">Pago anticipo</p>
        <div v-if="this.detalles.id_anticipo != null" class="row">
          <p class="fs-6">{{ `Metodo pago: ${this.pagoAnticipo.metodo}` }}</p>
          <p class="fs-6">{{ `Folio: ${this.pagoAnticipo.folio}` }}</p>
          <p class="fs-6">{{ `Monto: $${this.pagoAnticipo.total}` }}</p>
          <p class="fs-6">{{ `Dirección: ${this.pagoAnticipo.direccion}` }}</p>
        </div>
        <div v-else class="row">
          <p class="fs-6">{{ "Sin pago de anticipo registrado." }}</p>
        </div>
        <p class="fs-5 fw-medium">Pago liquidacion</p>
        <div v-if="this.detalles.id_liquidacion != null" class="row">
          <p class="fs-6">{{ `Metodo pago: ${this.pagoLiquidacion.metodo}` }}</p>
          <p class="fs-6">{{ `Folio: ${this.pagoLiquidacion.folio}` }}</p>
          <p class="fs-6">{{ `Monto: $${this.pagoLiquidacion.total}` }}</p>
          <p class="fs-6">{{ `Dirección: ${this.pagoLiquidacion.direccion}` }}</p>
        </div>
        <div v-else class="row">
          <p class="fs-6">{{ "Sin pago de liquidacion registrado." }}</p>
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-3">
        <button class="btn btn-primary" @click="volver">
          Volver
        </button>
        <button class="btn btn-danger" @click="consultarCancelacion">
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
import axios from "@/config/axios.js";
import { toast } from "vue3-toastify";
import toastConf from "@/config/toast";
import apiCliente from "@/config/ServidorCliente.js";
import Swal from "sweetalert2";
export default {
  name: "ElementoPedido",
  props: {
    detalles: Object,
    pagoAnticipo: Object,
    entrega: Object,
    pagoLiquidacion: Object,
  },
  data() {
    return {
      autorizado: false
    }
  },
  methods: {
    consultarCancelacion() {
      const url = apiCliente.consultarCancelacion + this.detalles.id;
      toast.promise(
        axios.get(url),
        {
          pending: 'Consultando cancelación...',
          success: 'Cancelacion autorizada.',
          error: 'No autorizada.',
        }, toastConf
      ).then(async (respuesta) => {

        if (respuesta.status === 200) {
          const mensaje = respuesta.data;
          Swal.fire({
            title: "Cancelacion de pedido",
            text: mensaje,
            icon: "info"
          });

          this.autorizado = true;
        }
      }).catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const mensaje = error.response.data;
            Swal.fire({
            title: "Cancelacion de pedido",
            text: mensaje,
            icon: "info"
          });
          }
          if (error.response.status === 404) {
            toast.error('Ruta no encontrada.');
          }
        } else if (error.request) {
          toast.error('Error de red', toastConf);
        } else {
          toast.error('Error desconocido', toastConf);
        }
      });
    },
    cancelar() {
      const url = apiCliente.cancelarPedido + this.detalles.id;

      toast.promise(
        axios.delete(url, { withCredentials: true, responseType: 'blob' }),
        {
          pending: 'Cancelando pedido ...',
          success: 'Pedido Cancelado.',
          error: 'Cancelacion interrumpida.',
        }, toastConf
      ).then(async (respuesta) => {
        if (respuesta.status === 200) {
          const blob = new Blob([respuesta.data], { type: 'application/pdf' });

          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');

          a.href = url;
          a.download = `Voucher_devolucion_${this.detalles.id}.pdf`;

          document.body.appendChild(a);
          a.click();

          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          toast.success("Pedido cancelado correctamente.")

          this.$router.back();
        }
      }).catch((error) => {
        this.manejarError(error);
      });
    },
    manejarError(error) {
      if (error.response) {
        if (error.response.status === 401) {
          this.$router.push("/login");
          toast.error('No autorizado.');
        } else if (error.response.status === 404) {
          toast.error('Información no encontrada.');
        } else {
          toast.error('Error en la solicitud.');
        }
      } else if (error.request) {
        toast.error('Error de red');
      } else {
        toast.error('Error desconocido');
      }
    },
    volver() {
      this.$router.back();
    },
    editarPedido() {
      this.$emit("editarPedido");
    },
    cancelarPedido() {
      this.$emit("cancelarPedido");
    },

  },
  mounted() {
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
