<template>
  <div id="app">
  <div class="row justify-content-between align-items-center fondo-encabezado">
    <div class="col-12">
      <p class="fs-4 lh-1 pt-2">Administrar Entregas</p>
    </div>
    <div class="col-2 align-self-end">
      <img
        class="img-fluid logo-pasteleria"
        src="../../assets/Logo1.png"
        alt="Logo de la Pastelería"
      />
    </div>
  </div>
  <div class="row">
    <div
      class="col container pt-2 bg-light shadow m-3 rounded border border-dark"
    >
      <div class="row">
        <p class="col-6 fs-4 align-items-start fw-medium subtitulo">
          Entregas Registradas
          <BarraBusqueda
            class="col-6 align-items-center"
            :placeholder="Buscar"
            @filtrar="filtrarEntregasTexto"
          />
        </p>
      </div>
      <div class="row p-3">
        <TablaEntregas
          class="col-12 border border-3 rounded"
          :entregas="entregasFiltradas"
          @editarEntrega="editarEntrega"
          @eliminarEntrega="eliminarEntrega"
        />
      </div>
    </div>
  </div>
</div>
</template>

<script>
import BarraBusqueda from "../Barras/BarraBusqueda.vue";
import TablaEntregas from "../Entregas/TablaEntregas.vue";
export default {
  name: "ListadoEntregas",
  components: {
    BarraBusqueda,
    TablaEntregas,
  },
  data() {
    return {};
  },
  methods: {
    editarEntrega() {
      this.$router.push("/modificar-entrega");
    },
    eliminarEntrega() {
      
    },
  },
};
</script>

<style scoped>
body {
  font-family: "Poppins", sans-serif;
  color: #ffffff;
}

.fondo-encabezado {
  background: linear-gradient(to top, #ffffff, #ffc6d1);
}

.subtitulo {
  color: #fe8092;
}

.logo-pasteleria {
  width: 120px;
}

#app {
  max-width: 100%;
  overflow-x:hidden;
}
</style>