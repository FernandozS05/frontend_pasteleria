<template>
  <div class="container position-absolute">
    <div class="row">
      <div class="col-md-6 order-md-1 mt-5">
        <div class="bkng-tb-cntnt">
          <div class="pymnts">
            <form action="#" method="POST" id="payment-form">
              <input type="hidden" name="token_id" id="token_id" />
              <div class="pymnt-itm card active">
                <h2>Tarjeta de crédito o débito</h2>
                <div class="pymnt-cntnt">
                  <div class="card-expl">
                    <div class="credit"><h4>Tarjetas de crédito</h4></div>
                    <div class="debit"><h4>Tarjetas de débito</h4></div>
                  </div>
                  <div class="sctn-row">
                    <div class="sctn-col l">
                      <label>Nombre del titular</label
                      ><input
                        type="text"
                        autocomplete="off"
                        data-openpay-card="holder_name"
                      />
                    </div>
                    <div class="sctn-col">
                      <label>Número de tarjeta</label
                      ><input
                        type="text"
                        autocomplete="off"
                        data-openpay-card="card_number"
                      />
                    </div>
                  </div>
                  <div class="sctn-row">
                    <div class="sctn-col l">
                      <label>Fecha de expiración</label>
                      <div class="sctn-col half l">
                        <input
                          type="text"
                          placeholder="Mes"
                          data-openpay-card="expiration_month"
                        />
                      </div>
                      <div class="sctn-col half l">
                        <input
                          type="text"
                          placeholder="Año"
                          data-openpay-card="expiration_year"
                        />
                      </div>
                    </div>
                    <div class="sctn-col cvv">
                      <label>Código de seguridad</label>
                      <div class="sctn-col half l">
                        <input
                          type="text"
                          placeholder="3 dígitos"
                          autocomplete="off"
                          data-openpay-card="cvv2"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="sctn-row">
                    <a
                      class="button rght"
                      id="pay-button"
                      @click="redirigirATablaPedidos"
                      >Pagar</a
                    >
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="col-md-6 mt-4">
        <div>
          <label for="detallesPago" class="form-label">
            Productos Seleccionados
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PagoTarjeta",
  props: {
    pedido: Object
  },
  methods: {
    
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
  background: linear-gradient(to top, #ffffff, #ffc6d1);
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
  background: linear-gradient(to top, #ffffff, #ffc6d1);
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
}
</style>
