<template>
  <div class="row w-100 d-flex justify-content-center align-items-center ">
    <div class="col-auto mt-3 ">
      <div class="bkng-tb-cntnt ">
        <div class="pymnts ">
          <form id="payment-form">
            <input type="hidden" name="token_id" id="token_id" />
            <div class="pymnt-itm card active">
              <h2>Tarjeta de crédito o débito</h2>
              <div class="pymnt-cntnt">
                <div class="card-expl">
                  <div class="credit">
                    <h4>Tarjetas de crédito</h4>
                  </div>
                  <div class="debit">
                    <h4>Tarjetas de débito</h4>
                  </div>
                </div>
                <div class="sctn-row">
                  <div class="sctn-col l">
                    <label>Nombre del titular</label><input type="text" autocomplete="off"
                      data-openpay-card="holder_name" />
                  </div>
                  <div class="sctn-col">
                    <label>Número de tarjeta</label><input type="number" autocomplete="off"
                      data-openpay-card="card_number" maxlength="16"
                      oninput="this.value = this.value.replace(/[^0-9]/g, ''); if(this.value.length > 16) this.value = this.value.slice(0, 16);"
                      required />
                  </div>
                </div>
                <div class="sctn-row">
                  <div class="sctn-col l">
                    <label>Fecha de expiración</label>
                    <div class="sctn-col half l">
                      <input type="number" placeholder="Mes" data-openpay-card="expiration_month"
                        oninput="this.value = this.value.replace(/[^0-9]/g, ''); if(this.value.length > 2) this.value = this.value.slice(0, 2);" />
                    </div>
                    <div class="sctn-col half l">
                      <input type="number" placeholder="Año" data-openpay-card="expiration_year"
                        oninput="this.value = this.value.replace(/[^0-9]/g, ''); if(this.value.length > 2) this.value = this.value.slice(0, 2);" />
                    </div>
                  </div>
                  <div class="sctn-col cvv">
                    <label>Código de seguridad</label>
                    <div class="sctn-col half l">
                      <input type="password" placeholder="3 dígitos" autocomplete="off" data-openpay-card="cvv2" />
                    </div>
                  </div>
                </div>
                <div class="sctn-row">
                  <a class="button rght" id="pay-button" @click="validarPago">Pagar</a>
                </div>
              </div>
            </div>
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
  name: "PagoTarjeta",
  props: {
    pedido: Object
  },
  data() {
    return {
      validado: false
    }
  },
  methods: {
    validarPago() {
      toast.promise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            const randomStatus = Math.random() < 0.8 ? 200 : 500; // Simula éxito (80%) o error (20%)

            if (randomStatus === 200) {
              resolve({ status: 200 });
            } else {
              reject({ response: { status: 500 } }); // Simula un error en la validación
            }
          }, 2000);
        }),
        {
          pending: 'Validando pago ...', // Mensaje mientras la promesa está pendiente
          success: 'Pago validado.', // Mensaje cuando la promesa se resuelve con éxito
          error: 'No se pudo validar el pago.', // Mensaje cuando la promesa es rechazada
        }, toastConf
      ).then(async (respuesta) => {
        // Puedes realizar acciones adicionales después de que la promesa se resuelva
        // (opcional dependiendo de tus necesidades)
        console.log('Pago completado');

        // Realizar acciones adicionales según la respuesta exitosa
        if (respuesta.status === 200) {
          toast.success("Pago validado.")
          this.registrarPago();
        }
      }).catch((error) => {
        // Manejar errores de la petición
        if (error.response) {
          toast.error('Verifique los datos de su tarjeta', toastConf);
        }
      });
    },
    registrarPago() {
      let anticipado = false;
      if(this.pedido.idPagoAnticipo != null){
        anticipado = true;
      }
      const url = apiCliente.listarPedidos + `pagos/${this.pedido.idPedido}/registrar-pago`;
      const datos = {
        monto: (Math.round(parseInt(this.pedido.total) / 2)),
        direccion: "Tienda en linea.",
        folio: Math.floor(Math.random() * (1000000 - 10000)) + 10000,
        totalRestante: parseInt(this.pedido.total) - (Math.round(parseInt(this.pedido.total) / 2)),
        metodoPago: "Tarjeta",
        vendedor: "No aplica.",
        sucursal: "Tienda en linea.",
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
          a.download = 'Recibo_pago.pdf';

          // Añade el enlace al documento y simula un clic para iniciar la descarga
          document.body.appendChild(a);
          a.click();

          // Limpia y libera recursos
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          console.log(respuesta.data) //
          toast.success("Pago registrada correctamente.")

          this.$router.push("pedidos");
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
* {
  color: black;
  font-size: 16px;
  font-weight: 300;
  font-family: initial;
  font-size: initial;
  font-weight: initial;
}

h2 {
  color: white;
}

a {
  cursor: pointer;
  display: block;
  text-decoration: none;
}

a.button {
  border-radius: 5px 5px 5px 5px;
  -webkit-border-radius: 5px 5px 5px 5px;
  -moz-border-radius: 5px 5px 5px 5px;
  text-align: center;
  font-size: 21px;
  font-weight: 400;
  padding: 12px 0;
  width: 100%;
  display: table;
  background-color: #fe8092;
  color: #ffffff;
}

a.button i {
  margin-right: 10px;
}

a.button.disabled {
  background: none repeat scroll 0 0 #ccc;
  cursor: default;
}

.bkng-tb-cntnt {
  float: left;
  width: 800px;
  background: #ffc6d1;
}

.bkng-tb-cntnt a.button {
  color: #fff;
  float: right;
  font-size: 18px;
  padding: 5px 20px;
  width: auto;
}

.bkng-tb-cntnt a.button i {
  color: #fff;
}

.bkng-tb-cntnt a.button.right i {
  float: right;
  margin: 2px 0 0 10px;
}

.bkng-tb-cntnt a.button.left {
  float: left;
}

.bkng-tb-cntnt a.button.disabled.o {
  border-color: #ccc;
  color: #ccc;
}

.bkng-tb-cntnt a.button.disabled.o i {
  color: #ccc;
}

.pymnts {
  float: left;
  width: 800px;
}

.pymnts * {
  float: left;
}

.sctn-row {
  margin-bottom: 35px;
  width: 800px;
}

.sctn-col {
  width: 375px;
}

.sctn-col.l {
  width: 425px;
}

.sctn-col input {
  border: 1px solid #ccc;
  font-size: 18px;
  line-height: 24px;
  padding: 10px 12px;
  width: 333px;
}

.sctn-col label {
  font-size: 24px;
  line-height: 24px;
  margin-bottom: 10px;
  width: 100%;
}

.sctn-col.x3 {
  width: 300px;
}

.sctn-col.x3.last {
  width: 200px;
}

.sctn-col.x3 input {
  width: 210px;
}

.sctn-col.x3 a {
  float: right;
}

.pymnt-itm {
  margin: 0 0 3px;
  width: 800px;
}

.pymnt-itm h2 {
  background: #f98199;
  font-size: 24px;
  line-height: 24px;
  margin: 0;
  padding: 28px 0 28px 20px;
  width: 800px;
}

.pymnt-itm.active h2 {
  cursor: default;
}

.pymnt-itm div.pymnt-cntnt {
  display: none;
}

.pymnt-itm.active div.pymnt-cntnt {
  background-color: #f7f7f7;
  display: block;
  padding: 0 0 30px;
  width: 100%;
}

.pymnt-cntnt div.sctn-row {
  margin: 20px 30px 0;
  width: 740px;
}

.pymnt-cntnt div.sctn-row div.sctn-col {
  width: 345px;
}

.pymnt-cntnt div.sctn-row div.sctn-col.l {
  width: 395px;
}

.pymnt-cntnt div.sctn-row div.sctn-col input {
  width: 303px;
}

.pymnt-cntnt div.sctn-row div.sctn-col.half {
  width: 155px;
}

.pymnt-cntnt div.sctn-row div.sctn-col.half.l {
  float: left;
  width: 190px;
}

.pymnt-cntnt div.sctn-row div.sctn-col.half input {
  width: 113px;
}

.pymnt-cntnt div.sctn-row div.sctn-col.cvv {
  background-image: url("../../assets/cvv.png");
  background-position: 156px center;
  background-repeat: no-repeat;
  padding-bottom: 30px;
}

.pymnt-cntnt div.sctn-row div.sctn-col.cvv div.sctn-col.half input {
  width: 110px;
}

.card-expl {
  float: left;
  height: 80px;
  margin: 20px 0;
  width: 800px;
}

.card-expl div {
  background-position: left 45px;
  background-repeat: no-repeat;
  height: 70px;
  padding-top: 10px;
}

.card-expl div.debit {
  background-image: url("../../assets/cards2.png");
  margin-left: 20px;
  width: 540px;
}

.card-expl div.credit {
  background-image: url("../../assets/cards1.png");
  border-right: 1px solid #ccc;
  margin-left: 30px;
  width: 209px;
}

.card-expl h4 {
  font-weight: 400;
  margin: 0;
}</style>
