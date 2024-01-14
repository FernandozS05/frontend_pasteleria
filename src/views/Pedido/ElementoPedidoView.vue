<template>
    <div class="elemento-pedido-view">
      <ElementoPedido />
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import ElementoPedido from "@/components/Pedido/ElementoPedido.vue";
  import { toast } from "vue3-toastify";
  
  export default {
    name: "ElementoPedidoView",
    components: {
    ElementoPedido,
},
    methods: {
      notify() {
        toast("Wow so easy !", {
          autoClose: 1000,
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      },
    },
  };
  </script>
  