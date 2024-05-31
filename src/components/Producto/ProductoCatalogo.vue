<template>
  <div id="app">
    <div class="item mb-3 align-items-center border border-3 rounded" @click="detalle">
      <div class="contenedor-foto">
        <self-building-square-spinner class="img-fluid"  v-if="cargando" :animation-duration="6000" :size="100" color="#ff1d5e" />
        <img class="img-fluid" :src="urlImagen" @load="imagenCargada" alt="">
      </div>
      <p class="descripcion">{{ nombre }}</p>
      <span class="precio">{{ `$ ${precio}` }}</span>
    </div>
  </div>
</template>


<script>
import apiArchivos from "@/config/ServidorArchivos";
import axios from '@/config/axios.js';
import { SelfBuildingSquareSpinner } from 'epic-spinners'
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
    seleccionado: {
      type: Boolean,
      default: false
    }
  },
  components: {
    SelfBuildingSquareSpinner
  },
  data() {
    return {
      urlImagen: null,
      cargando: true
    }
  },
  methods: {
    async obtenerArchivoImagen(ruta) {
      try {
        const url = `${apiArchivos.obtener}?ruta=${ruta}`;
        const respuesta = await axios.get(url);
        if (respuesta.status == 200) {
          this.urlImagen = respuesta.data.url;
          this.cargando = false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    imagenCargada() {
      this.cargando = false;
    },
    detalle() {
      this.$emit("detalle");
    },
  },
  mounted() {
    this.obtenerArchivoImagen(this.imagen);
  }
};
</script>

<style scoped>
.item {
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

.item:hover {
  background-color: #e6e6e6;
  border: 2px solid red;
}

img {
  width: 100%;
  margin: 15px 0;
}

.descripcion {
  color: #707070;
  font-weight: bold;
}

.precio {
  color: #f85151;
  font-weight: bold;
  font-size: 20px;
}

#app {
  max-width: 100%;
  overflow-x: hidden;
}
</style>