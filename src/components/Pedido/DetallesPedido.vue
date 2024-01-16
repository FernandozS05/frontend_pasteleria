<template>
  <div class="row w-100 d-flex justify-content-center align-items-center">
    <div class="col-auto mt-3 ">
      <div class="p-3 border border-3 rounded-4">

        <p class="fs-5">Detalles de pedido</p>
        

        <p class="fs-4 mt-4">Tipo de entrega:</p>
        <div class="form-check">
          <input type="radio" class="form-check-input" name="tipoEntrega" id="entregaSucursal" value="sucursal"
            v-model="tipoEntrega" />
          <label class="form-check-label" for="entregaSucursal">
            Sucursal: Calle principal #5, Col.Prueba, Xalapa, Ver.
          </label>
        </div>
        <div class="form-check">
          <input type="radio" class="form-check-input" name="tipoEntrega" id="entregaDomicilio" value="domicilio"
            v-model="tipoEntrega" />
          <label class="form-check-label" for="entregaDomicilio">
            Domicilio
          </label>
        </div>

        <!-- Detalles de entrega a domicilio -->
        <div v-if="this.tipoEntrega === 'domicilio'" id="detallesDomicilio" class="mb-3 mt-4">
          <label for="infoDomicilio" class="form-label">
            <p class="fs-5">Detalles de entrega a domicilio</p>
          </label>
          <textarea v-model="domicilio" class="form-control" id="infoDomicilio" rows="3"
            placeholder="Calle, colonia, numero de exterior, etc."></textarea>
          <label for="infoReferencias" class="form-label">
            <p class="fs-5">Referencias domicilio</p>
          </label>
          <textarea class="form-control" id="infoReferencias" rows="2"
            placeholder="Referencias de la ubicacion del domicilio."></textarea>
        </div>
        <h4 class="mt-4">Agendar fecha de entrega:</h4>
        <div>
          <input type="date" class="form-control" v-model="fecha" @change="consultarAgenda">
        </div>
        <h4 class="mt-4">Método de pago:</h4>
        <div class="form-check">
          <input type="radio" class="form-check-input" name="metodoPago" id="pagoTarjeta" value="tarjeta"
            v-model="tipoPago" />
          <label class="form-check-label" for="pagoTarjeta">
            Pago con tarjeta
          </label>
        </div>
        <div class="form-check">
          <input type="radio" class="form-check-input" name="metodoPago" id="otraFormaPago" value="efectivo"
            v-model="tipoPago"/>
          <label class="form-check-label" for="otraFormaPago">
            Efectivo
          </label>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-3">
          
          <button class="btn btn-outline-secondary text-rose" type="button" @click="cancelar">
            Cancelar
          </button>
          <button class="btn btn-rose" type="button" @click="guardar">
            Continuar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*
//import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const date = ref(null);
const router = useRouter();

const cancelar = () => {
  router.go(-1);
};

const continuar = () => {
  const tipoEntrega = document.querySelector(
    'input[name="tipoEntrega"]:checked'
  ).id;

  const metodoPago = document.querySelector(
    'input[name="metodoPago"]:checked'
  ).id;

  store.commit("actualizarTipoEntrega", tipoEntrega);
  store.commit("actualizarMetodoPago", metodoPago);

  if (tipoEntrega === "entregaSucursal" && metodoPago === "pagoTarjeta") {
    router.push("/tarjeta");
  } else if (
    tipoEntrega === "entregaSucursal" &&
    metodoPago === "otraFormaPago"
  ) {
    router.push("/formato");
  } else {
    router.push("/direccion");
  }
};
*/
import axios from "axios";
import { toast } from "vue3-toastify";
import toastConf from "@/config/toast";
import apiCliente from "@/config/ServidorCliente.js";

export default {
name:"DetallePedido",
data(){
  return {
    idEntrega: "",
    fecha: "",
    tipoEntrega: "",
    domicilio: "",
    indicacionesExtra: ""
  }},
  methods: {
    consultarAgenda(){
      const url = apiCliente.consultarAgenda + `?fecha=${this.fecha}`;
      console.log(url);
      toast.promise(
        axios.get(url, { withCredentials: true }),
        {
          pending: 'Consultando fecha...', // Mensaje mientras la promesa está pendiente
          success: 'Fecha disponible.', // Mensaje cuando la promesa se resuelve con éxito
          error: 'Error al consultar la fecha.', // Mensaje cuando la promesa es rechazada
        }, toastConf
      ).then((respuesta) => {
        // Puedes realizar acciones adicionales después de que la promesa se resuelva
        // (opcional dependiendo de tus necesidades)
        console.log('Consulta completada');

        // Realizar acciones adicionales según la respuesta exitosa
        if (respuesta.status === 200) {
          console.log(respuesta.data)
          
        }
      }).catch((error) => {
        // Manejar errores de la petición
        if (error.response) {
          console.error('Mensaje del servidor:', error.response.data.error);

          if (error.response.status === 400) {
            toast.error('La fecha no puede ser anterior al dia de hoy.');
          }
          if (error.response.status === 401) {
            toast.error('No autorizado.');
          }
          if (error.response.status === 401) {
            toast.error('Fecha no disponible.');
            this.fecha = "";
          }
          if (error.response.status === 404) {
            toast.error('Informacion no encontrada.');
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
    guardar(){
      const url = apiCliente.registrarEntrega;
      const datos = {};

      if(!this.fecha)
        return

      datos.fecha = this.fecha;

      if(this.tipoEntrega === "domicilio"){
        datos.formaEntrega = "Domicilio";
        datos.domicilio = this.domicilio;
      }else{
        datos.formaEntrega = "Sucursal";
        datos.domicilio = "Sucursal: Calle principal #5, Col. Prueba, Xalapa, Ver.";
      }


      toast.promise(
        axios.post(url, datos, { withCredentials: true }),
        {
          pending: 'Registrando entrega...', // Mensaje mientras la promesa está pendiente
          success: 'Entrega registrada.', // Mensaje cuando la promesa se resuelve con éxito
          error: 'Error al registrar entrega.', // Mensaje cuando la promesa es rechazada
        }, toastConf
      ).then(async (respuesta) => {
        // Puedes realizar acciones adicionales después de que la promesa se resuelva
        // (opcional dependiendo de tus necesidades)
        console.log('Registro completado');

        // Realizar acciones adicionales según la respuesta exitosa
        if (respuesta.status === 200) {

          console.log(respuesta.data)
          this.idEntrega = respuesta.data.idEntrega;
          toast.success("Entrega registrada correctamente.")
          await this.asignarEntregaPedido()
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

    }
    ,
    asignarEntregaPedido(){
      const idPedido = localStorage.getItem("idPedido");

      const url = apiCliente.asignarEntrega + idPedido + "/asignar-entrega";
      console.log(url);
      const datos = {
        idEntrega: this.idEntrega,
        idPedido: idPedido
      }

      toast.promise(
        axios.post(url, datos, { withCredentials: true }),
        {
          pending: 'Asignando entrega...', // Mensaje mientras la promesa está pendiente
          success: 'Entrega asignada.', // Mensaje cuando la promesa se resuelve con éxito
          error: 'Error al asignar entrega.', // Mensaje cuando la promesa es rechazada
        }, toastConf
      ).then((respuesta) => {
        // Puedes realizar acciones adicionales después de que la promesa se resuelva
        // (opcional dependiendo de tus necesidades)
        console.log('Registro completado');

        // Realizar acciones adicionales según la respuesta exitosa
        if (respuesta.status === 200) {

          console.log(respuesta.data)
          toast.success("Entrega asignada correctamente.")
          if(this.tipoPago === "tarjeta"){
            this.$router.push("/tarjeta")
          }
          else{
            this.$router.push("/formato")
          }

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
    }
  }
}
</script>

<style scoped>
.gradient-background {
  background: #ffc6d1;
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
