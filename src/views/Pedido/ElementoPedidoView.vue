<template>
  <div class="row">
      <BarraNavegacion @cerrarSesion="cerrarSesion"/>
    </div>
    <div class="row">
      <ElementoPedido v-if="mostrar == true" v-bind:detalles="pedido" v-bind:entrega="entrega" v-bind:pagoAnticipo="pagoAnticipo" v-bind:pago-liquidacion="pagoLiquidacion"/>
    </div>
</template>
  
<script>
// @ is an alias to /src
import ElementoPedido from "@/components/Pedido/ElementoPedido.vue";
import { toast } from "vue3-toastify";
import apiCliente from "@/config/ServidorCliente";
import axios from 'axios';
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
    notify() {
      toast("Wow so easy !", {
        autoClose: 1000,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    },
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

          if(this.pedido.idEntrega)
            this.consultarEntrega();
          if(this.pedido.idPagoAnticipo)
            this.consultarPagoAnticipo();
          if(this.pedido.idPagoLiquidacion)
            this.consultarPagoLiquidacion();

          setTimeout(() => this.mostrar = true, 3000);
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
    consultarEntrega(){
      const idEntrega = this.pedido.idEntrega;
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
          // eslint-disable-next-line vue/no-mutating-props
          this.entrega = respuesta.data;
          console.log(this.entrega);
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
      const idPago = this.pedido.idPagoAnticipo;
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
          // eslint-disable-next-line vue/no-mutating-props
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
      const idPago = this.pedido.idPagoLiquidacion;
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
          // eslint-disable-next-line vue/no-mutating-props
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
  },
  mounted(){
    this.consultarInfo();
  }
};
</script>
  