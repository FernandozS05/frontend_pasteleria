<template>
        <div id="row degradado-rosa" class="d-flex align-items-center degradado-rosa">

            <img class="col-1 img-fluid " src="../../assets/Logo1.png" alt="Logo Pastelería" />
            <p class="col-3 fs-2 ml-2">Pastelería Zudey</p>
            <div class="col-2 d-flex align-items-center p-1 mb-3 mb-2bg-opacity-10 ">
                                <img class="img-fluid float-start fs-4 me-2" src="../../assets/icono_salir.png" />
                                <li><a class="dropdown-item" href="#" @click="cerrarSesion"><p class="fs-6">Cerrar sesión</p></a></li>
            </div>
            <nav class="col-auto w-100">
                <ul class="nav">
                    <li class="nav-item">
                        <router-link to="/inicio" class="nav-link"><p class="fs-5 link">Inicio</p></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/catalogo" class="nav-link"><p class="fs-5 link">Catálogo</p></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/pedidos" class="nav-link"><p class="fs-5 link">Pedidos</p></router-link>
                    </li>
                </ul> 
            </nav>
            
        </div>
</template>

<script>
export default {
    name: "BarraNavegacion",
    data() {
        return {
        };
    },
    methods: {
        cerrarSesion(){
            this.$emit("cerrarSesion");
        }
    },
};
</script>

<style scoped>
.degradado-rosa {
    background: #ff9baf;
}

@import "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700";

body {
    font-family: 'Poppins', sans-serif;
    background: #fafafa;
    color: #999;
}

p {
    font-family: 'Poppins', sans-serif;
    font-size: 1.1em;
    font-weight: 300;
    line-height: 1.7em;
    color: #fff;
}

.link {
    color: white;
    font-size: 1.1em;
}

/* ---------------------------------------------------
    SIDEBAR STYLE
----------------------------------------------------- */
.link:hover{
    color: #000000;
}

</style>
