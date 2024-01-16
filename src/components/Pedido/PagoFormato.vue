<template>
  <div class="container position-absolute">
    <div class="row w-100 d-flex justify-content-center align-items-center">
      <div class="col-md-6 order-md-1 mt-5 p-3 border border-3 rounded-4">
        <div id="contenedorPago mb-3">
          <p class="fs-4 text-center">Descarga el formato de pago, paga en la sucursal mas cercana y despues ingresa el folio del pago.</p>
          <a class="button rght border download" @click="descargarFormato">Descargar Formato</a>
        </div>
        <div id="contenedorRegistro">
          <label for="inputFolio">
            <p class="fs-4 text-center">Ingresa los datos del pago, una vez que lo hayas realizado.</p>
          </label>
            <form id="inputFolio" @submit.prevent="registrarPago">
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label"><p class="fs-5">Folio de pago</p></label>
                <input v-model="folio" type="number" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
              </div>
              <button type="submit" class="button rght border download">Registrar</button>
            </form>
        </div>
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
  props: {
    pedido: Object
  },
  data(){
    return{
      folio: Number
    }
  },
  methods: {
    descargarFormato() {
      const url = apiCliente.generarPago;

      const datos = {
        anticipo: (Math.round(parseInt(this.pedido.total) / 2)),
        metodoPago: "Efectivo.",
        concepto: (this.pedido.estado == "Pendiente") ? "Pago anticipo." : "Pago liquidacion."
      }
      toast.promise(
        axios.post(url, datos, { withCredentials: true, responseType: 'blob' }),
        {
          pending: 'Generando forma de pago ...', // Mensaje mientras la promesa está pendiente
          success: 'Forma de pago generada.', // Mensaje cuando la promesa se resuelve con éxito
          error: 'Error al generar forma de pago.', // Mensaje cuando la promesa es rechazada
        }, toastConf
      ).then(async (respuesta) => {
        // Puedes realizar acciones adicionales después de que la promesa se resuelva
        // (opcional dependiendo de tus necesidades)
        console.log('Registro completado');

        // Realizar acciones adicionales según la respuesta exitosa
        if (respuesta.status === 200) {
          const blob = new Blob([respuesta.data], { type: 'application/pdf' });
          console.log(blob);
          // Usa FileSaver.js para descargar el archivo
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');

          // Configura el enlace para descargar automáticamente el archivo
          a.href = url;
          a.download = `Forma_pago_${this.pedido.idPedido}.pdf`;

          // Añade el enlace al documento y simula un clic para iniciar la descarga
          document.body.appendChild(a);
          a.click();

          // Limpia y libera recursos
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          console.log(respuesta.data) //
          toast.success("Pago registrada correctamente.")

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
    registrarPago() {
      const url = apiCliente.listarPedidos + `pagos/${this.pedido.idPedido}/registrar-pago`;
      let anticipado = false;
      if(this.pedido.idPagoAnticipo != null){
        anticipado = true;
      }
      const datos = {
        monto: (Math.round(parseInt(this.pedido.total) / 2)),
        direccion: "Calle principal #5, Col.Prueba, Xalapa, Ver.",
        folio: this.folio,
        totalRestante: parseInt(this.pedido.total) - (Math.round(parseInt(this.pedido.total) / 2)),
        metodoPago: "Efectivo",
        vendedor: "Juan Lopez Perez.",
        sucursal: "Sucursal principal.",
        anticipado: anticipado
      };
      console.log(datos);
      toast.promise(
        axios.post(url, datos, { withCredentials: true, responseType: 'blob'} ),
        {
          pending: 'Registrando pago...', // Mensaje mientras la promesa está pendiente
          success: 'Pago registrado.', // Mensaje cuando la promesa se resuelve con éxito
          error: 'Error al registrar pago.', // Mensaje cuando la promesa es rechazada
        }, toastConf
      ).then(async (respuesta) => {
        // Puedes realizar acciones adicionales después de que la promesa se resuelva
        // (opcional dependiendo de tus necesidades)
        console.log('Registro completado');

        // Realizar acciones adicionales según la respuesta exitosa
        if (respuesta.status === 200) {
          const blob = new Blob([respuesta.data], { type: 'application/pdf' });
          console.log(blob);
          // Usa FileSaver.js para descargar el archivo
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');

          // Configura el enlace para descargar automáticamente el archivo
          a.href = url;
          a.download = 'nombre-del-archivo.pdf';

          // Añade el enlace al documento y simula un clic para iniciar la descarga
          document.body.appendChild(a);
          a.click();

          // Limpia y libera recursos
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          console.log(respuesta.data) //
          toast.success("Pago registrada correctamente.")

          this.$router.push("/pedidos");
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
