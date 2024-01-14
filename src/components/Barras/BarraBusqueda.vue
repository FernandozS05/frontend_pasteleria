<template>
    <form class="d-flex" role="search" @submit.prevent="filtrar">
        <input v-model="texto" class="form-control me-2 border-2" type="search" placeholder="Buscar" aria-label="Search">
        <button class="btn btn-success rounded-circle border-2" type="submit">
        <img class="img-fluid py-1" src="../../assets/icono_buscar.png" alt="">
        </button>
    </form>
</template>
  
<script>
export default {
    name: 'BarraBusqueda',
    props: {
        placeholder: String,
    },
    data(){
        return {
            texto: ""
        };
    },
    methods: {
        filtrar() {
            this.$emit('filtrar', this.texto);
        }
    }
};
</script>

<style scoped>

body {
    font-family: 'Poppins', sans-serif;
    color: #ffffff;
}

input{
    background-color: #ffc6d1;
    border-color: #f76797;
}
button{
    background-color: #ffc6d1;
    border-color: #f76797;

}

button:hover{
    background-color: #f685ab;
}
</style>
