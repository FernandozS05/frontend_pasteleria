import { createStore } from "vuex";

export default createStore({
  state: {
    tipoEntrega: "",
    metodoPago: "",
    direccionDomicilio: {
      calle: "",
      numero: "",
    },
  },
  mutations: {
    actualizarTipoEntrega(state, tipoEntrega) {
      state.tipoEntrega = tipoEntrega;
    },
    actualizarMetodoPago(state, metodoPago) {
      state.metodoPago = metodoPago;
    },
    actualizarDireccionDomicilio(state, direccion) {
      state.direccionDomicilio = direccion;
    },
  },
  actions: {},
  modules: {},
});
