<template>
    <div class="item">
        <img class="img-fluid" :src="imagen" alt="">
        <div class="item-content">
            <h5>{{ this.producto.nombre }}</h5>
            <h5 class="cart-price">{{ `$ ${this.producto.precio}` }}</h5>
            <h6>{{ `Cantidad: ${this.cantidad}` }}</h6>
        </div>
        <button @click="quitarDelCarrito" class="btn btn-danger">X</button>
    </div>
</template>

<script>
import apiArchivos from "@/config/ServidorArchivos";
import axios from '@/config/axios.js';

export default {
    props: {
        
        producto: {
            type: Object
        },
        cantidad:{
            type: Number,
            default: 0,
        }
    },
    data() {
        return {
            imagen: ""
        }
    },
    methods: {
        async obtenerArchivoImagen(ruta) {
            try {
                const url = `${apiArchivos.obtener}?ruta=${ruta}`;
                const respuesta = await axios.get(url);
                if (respuesta.status == 200) {
                    this.imagen = respuesta.data.url;
                }
            } catch (e) {
                console.log(e);
            }
        },
        quitarDelCarrito() {
            this.$emit("quitar");
        },  
    },
    mounted(){
        this.obtenerArchivoImagen(this.producto.imagen);
    }
};
</script>

<style scoped>
.item img{
    width: 115px;
}

.item{
    display: flex;
    align-items: center;
    border-bottom: solid 2px red;
}
.item .item-content{
    margin: 0 19px;
    width: 201px;
}
.item .item-content h5{
    margin: 0;
    font-size: 15px;
    font-weight: 400;
    font-family: system-ui;
}
.item .item-content h6{
    margin: 0;
    font-size: 13px;
    font-weight: 400;
    font-family: system-ui;
}
.item span{
    background-color: red;
    padding: 0px 5px;
    border-radius: 50%;
    color: #fff;
    font-family: system-ui;
    cursor: pointer;
}
h3{
    margin-bottom: 0;
}
.item .item-content h5.cart-price{
    font-weight: 700;
}
</style>