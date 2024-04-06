<template>
  <div class="row">
      <BarraNavegacion @cerrarSesion="cerrarSesion"/>
    </div>
  <div class="row">
    <PagoTarjeta :pedido="pedido" />
  </div>
</template>

<script>
import PagoTarjeta from "@/components/Pedido/PagoTarjeta.vue";
import { toast } from "vue3-toastify";
import axios from "@/config/axios.js";
import toastConf from "@/config/toast";
import apiCliente from "@/config/ServidorCliente.js";
import BarraNavegacion from "@/components/Barras/BarraNavegacion.vue";

export default {
  name: "PagoTarjetaView",
  components: {
    PagoTarjeta,
    BarraNavegacion
  },
  data(){
    return {
      pedido: ""
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
      ).then((respuesta) => {
        if (respuesta.status === 200) {
          this.pedido = respuesta.data;
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
