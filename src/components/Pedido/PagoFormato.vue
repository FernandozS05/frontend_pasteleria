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
import axios from "@/config/axios.js";
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
        metodo_pago: "Efectivo.",
        concepto: (this.pedido.estado == "Pendiente") ? "Pago anticipo." : "Pago liquidacion."
      }
      toast.promise(
        axios.post(url, datos, { responseType: 'blob' }),
        {
          pending: 'Generando forma de pago ...', 
          success: 'Forma de pago generada.', 
          error: 'Error al generar forma de pago.', 
        }, toastConf
      ).then(async (respuesta) => {
      
        if (respuesta.status === 200) {
          const blob = new Blob([respuesta.data], { type: 'application/pdf' });
          
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');

          a.href = url;
          a.download = `Forma_pago_${this.pedido.id}.pdf`;
         
          document.body.appendChild(a);
          a.click();

          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          toast.success("Pago registrada correctamente.") 
        }
      }).catch((error) => {
        this.manejarError(error);
      });
    },
    registrarPago() {
      let anticipado = false;
      if(this.pedido.id_anticipo != null){
        anticipado = true;
      }
      const url = apiCliente.registrarPago + `${this.pedido.id}`;
      const datos = {
        monto: (Math.round(parseInt(this.pedido.total) / 2)),
        direccion: "Calle principal #5, Col.Prueba, Xalapa, Ver.",
        folio: this.folio,
        total_restante: parseInt(this.pedido.total) - (Math.round(parseInt(this.pedido.total) / 2)),
        metodo_pago: "Efectivo",
        sucursal: "Sucursal principal.",
        anticipado: anticipado
      };
      toast.promise(
        axios.post(url, datos, {responseType: 'blob'} ),
        {
          pending: 'Registrando pago...', 
          success: 'Pago registrado.', 
          error: 'Error al registrar pago.', 
        }, toastConf
      ).then(async (respuesta) => {
        if (respuesta.status === 200) {
          const blob = new Blob([respuesta.data], { type: 'application/pdf' });

          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');

          a.href = url;
          a.download = 'nombre-del-archivo.pdf';

          document.body.appendChild(a);
          a.click();

          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          toast.success("Pago registrada correctamente.")

          this.$router.push("/pedidos");
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
