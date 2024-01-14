<template>
  <div class="item mb-3 align-items-center border border-3 rounded" @click="detalle(this)">
    <div class="contenedor-foto">
      <img class="img-fluid" :src="imagen" alt="">
    </div>
    <p class="delscripcion">{{this.nombre}}</p>
    <span class="precio">{{`$ ${this.precio}`}}</span>
  </div>
</template>

<script>
export default {
  props: {
    nombre: {
      type: String,
      default: "",
    },
    imagen: {
      type: String,
      default: "",
    },
    precio: {
      type: Number,
      default: 0,
    },
    descripcion: {
      type: String,
      default: "",
    },
    seleccionado:{
      type: Boolean,
      default: false
    }
  },
  methods: {
    detalle() {
      this.$emit("detalle");
    },
  },
};
</script>

<style scoped>
.item{
    max-width: 210px;
    padding: 30px;
    height: 250px;
    /*border: 2px solid red;*/
    text-align: center;
    margin: 0 10px;
    cursor: pointer;
    border-radius: 5px;
    transition: .3s;
}
.item:hover{
    background-color: #e6e6e6;
    border: 2px solid red;
}
img{
    width: 100%;
    margin: 15px 0;
}
.descripcion{
    color: #707070;
    font-weight: bold;
}
.precio{
    color: #f85151;
    font-weight: bold;
    font-size: 20px;
}
</style>