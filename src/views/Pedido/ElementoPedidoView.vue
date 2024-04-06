<template>
  <div class="row">
      <BarraNavegacion @cerrarSesion="cerrarSesion"/>
    </div>
    <div class="row">
      <ElementoPedido v-if="mostrar == true" v-bind:detalles="pedido" v-bind:entrega="entrega" v-bind:pagoAnticipo="pagoAnticipo" v-bind:pagoLiquidacion="pagoLiquidacion"/>
    </div>
</template>
  
<script>
// @ is an alias to /src
import ElementoPedido from "@/components/Pedido/ElementoPedido.vue";
import { toast } from "vue3-toastify";
import apiCliente from "@/config/ServidorCliente";
import axios from "@/config/axios.js";
import toastConf from "@/config/toast";
import BarraNavegacion from "@/components/Barras/BarraNavegacion.vue";

export default {
  name: "ElementoPedidoView",
  components: {
    ElementoPedido,
    BarraNavegacion
  },
  data() {
    return {
      pedido: {},
      entrega: {},
      pagoAnticipo: {},
      pagoLiquidacion: {},
      mostrar: false,
    }
  },
  methods: {
    consultarInfo() {
      const url = apiCliente.detallesPedido + `${localStorage.getItem("idPedido")}`;

      toast.promise(
        axios.get(url),
        {
          pending: 'Consultando pedido...', 
          success: 'Pedido obtenido.', 
          error: 'No se pudo obtener el pedido.', 
        }, toastConf
      ).then(async (respuesta) => {
        if (respuesta.status === 200) {
          this.pedido = respuesta.data;
          console.log(respuesta.data);
          if(this.pedido.id_entrega)
            await this.consultarEntrega();
          if(this.pedido.id_anticipo)
            await this.consultarPagoAnticipo();
          if(this.pedido.id_liquidacion)
            await this.consultarPagoLiquidacion();
         this.mostrar = true;
        }
      }).catch((error) => {
        this.manejarError(error);
      });
    },
    async consultarEntrega(){
      const idEntrega = this.pedido.id_entrega;
      const url = apiCliente.detallesEntrega + idEntrega;

      toast.promise(
        axios.get(url),
        {
          pending: 'Consultando entrega...', 
          success: 'Entrega obtenida.', 
          error: 'No se pudo obtener la entrega.', 
        }, toastConf
      ).then((respuesta) => {
        if (respuesta.status === 200) {
          this.entrega = respuesta.data;
        }
      }).catch((error) => {
        this.manejarError(error);
      });
    },
    async consultarPagoAnticipo(){
      const idPago = this.pedido.id_anticipo;
      if(!idPago) 
        return
      const url = apiCliente.consultarPago + idPago;
      toast.promise(
        axios.get(url),
        {
          pending: 'Consultando pago...', 
          success: 'Pago obtenido.', 
          error: 'No se pudo obtener el pago.', 
        }, 
      ).then((respuesta) => {
        if (respuesta.status === 200) {
          this.pagoAnticipo = respuesta.data;
        }
      }).catch((error) => {
        this.manejarError(error);
      });
    },
    async consultarPagoLiquidacion(){
      const idPago = this.pedido.id_liquidacion;
      if(!idPago) 
        return
      const url = apiCliente.consultarPago + idPago;
      toast.promise(
        axios.get(url),
        {
          pending: 'Consultando pago...', 
          success: 'Pago obtenido.', 
          error: 'No se pudo obtener el pago.', 
        }, toastConf
      ).then((respuesta) => {
        if (respuesta.status === 200) {
          this.pagoLiquidacion = respuesta.data;
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
  },
  mounted(){
    this.consultarInfo();
  }
};
</script>
  