<template>
    <div class="row w-100 d-flex justify-content-center align-items-center">
      <div class="col-auto mt-3 ">
        <div class="p-3 border border-3 rounded-4">
  
          <p class="fs-3">Elige un método de pago</p>

          <!-- Detalles de entrega a domicilio -->
          <h4 class="mt-4">Método de pago:</h4>
          <div v-if="!this.tipo == 'empresa'" class="form-check">
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
            <button class="btn btn-rose" type="button" @click="irAPagar">
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  
  
  export default {
  name:"DetallePedido",
  data(){
    return {
      tipoPago: "",
      tipo: ""
    }},
    methods: {
      async definirTipo() {
      const tipo = localStorage.getItem("tipoUsuario");

      if (!tipo) {

        this.$router.push("/login");
        return;
      }
      this.tipo = tipo;
    },
     irAPagar(){
        if(this.tipoPago=="tarjeta"){
            this.$router.push("/tarjeta");
        }
        else if(this.tipoPago=="efectivo"){
            this.$router.push("/formato")
        }
     },
     cancelar(){
      this.$router.back();
     }
    },
    mounted(){
      this.definirTipo();
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
  