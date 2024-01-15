<template>
  <div class="row">
      <BarraNavegacion @cerrarSesion="cerrarSesion"/>
    </div>
  <div class="row">
    <PagoTarjeta :pedido="pedido" />
  </div>
</template>

<script>
// @ is an alias to /src
import PagoTarjeta from "@/components/Pedido/PagoTarjeta.vue";
import { toast } from "vue3-toastify";
import axios from "axios";
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
      const url = apiCliente.listarPedidos + `${localStorage.getItem("idPedido")}`;

      toast.promise(
        axios.get(url, { withCredentials: true }),
        {
          pending: 'Consultando pedido...', // Mensaje mientras la promesa está pendiente
          success: 'Pedido obtenido.', // Mensaje cuando la promesa se resuelve con éxito
          error: 'No se pudo obtener el pedido.', // Mensaje cuando la promesa es rechazada
        }, toastConf
      ).then((respuesta) => {
        // Puedes realizar acciones adicionales después de que la promesa se resuelva
        // (opcional dependiendo de tus necesidades)
        console.log('Consulta completada');

        // Realizar acciones adicionales según la respuesta exitosa
        if (respuesta.status === 200) {
          console.log(respuesta.data)
          this.pedido = respuesta.data;
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
    }
  },
  mounted(){
    this.consultarInfo();
  }
};
</script>
