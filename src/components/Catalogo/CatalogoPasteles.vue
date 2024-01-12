<template>
  <div>
    <router-view></router-view>
    <div id="degradado-rosa" class="d-flex align-items-center">
      <img src="assets/images/Logo1.png" alt="Logo Pastelería" />
      <h1 class="ml-2">Pastelería Zudey</h1>
      <nav>
        <ul class="nav">
          <li class="nav-item">
            <router-link to="/inicio" class="nav-link">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/catalogo" class="nav-link">Catálogo</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/pedidos" class="nav-link">Pedidos</router-link>
          </li>
        </ul>
      </nav>
    </div>
    <br />
    <div>
      <input
        type="text"
        placeholder="Buscar producto"
        @input="buscarProducto"
      />
    </div>
    <br />
    <div class="catalogo">
      <app-producto
        v-for="producto in productos"
        :key="producto.nombre"
        :nombre="producto.nombre"
        :imagen="producto.imagen"
        :precio="producto.precio"
        @comprarClick="comprarProducto"
      ></app-producto>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productos: [
        {
          nombre: "Zanahoria",
          imagen: require("../../assets/Imagen3.png"),
          precio: 800,
        },
        {
          nombre: "Chocolate",
          imagen: require("../../assets/Imagen4.png"),
          precio: 801,
        },
        { nombre: "Manzana", imagen: require("../../assets/Imagen5.png"), precio: 802 },
        {
          nombre: "Triple chocolate",
          imagen: require("../../assets/Imagen6.png"),
          precio: 803,
        },
        {
          nombre: "Viruta blanca",
          imagen: require("../../assets/Imagen7.png"),
          precio: 804,
        },
        { nombre: "Mármol", imagen: require("../../assets/Imagen8.png"), precio: 805 },
        { nombre: "Galleta", imagen: require("../../assets/Imagen9.png"), precio: 806 },
        {
          nombre: "Leche merengada",
          imagen: require("../../assets/Imagen10.png"),
          precio: 807,
        },
        { nombre: "Kinder", imagen: require("../../assets/Imagen11.png"), precio: 808 },
        { nombre: "Oreo", imagen: require("../../assets/Imagen12.png"), precio: 809 },
        {
          nombre: "Selva negra",
          imagen: require("../../assets/Imagen13.png"),
          precio: 810,
        },
      ],
    };
  },
  methods: {
    buscarProducto() {
    },
    comprarProducto() {
    },
  },
};
</script>

<style scoped>
#degradado-rosa {
  background: linear-gradient(to bottom, #ffc6d1, #fff);
}
.catalogo {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}
app-producto {
  margin-right: 10px;
}
</style>
