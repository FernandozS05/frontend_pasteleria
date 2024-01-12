<template>
  <div>
    <router-view></router-view>
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="seccion-izquierda p-4 text-center">
            <div id="degradado-rosa" class="d-flex align-items-center">
              <img src="../../assets/Logo1.png" alt="Logo Pastelería" />
              <h1 class="ml-2">Pastelería Zudey</h1>
            </div>
            <h2 class="mt-4">Iniciar Sesión</h2>
            <p class="mb-4">
              ¡Bienvenido de nuevo! Por favor, ingrese sus datos.
            </p>

            <form @submit.prevent="iniciarSesion">
              <p class="text-danger">{{ loginError }}</p>
              <div class="mb-3">
                <input
                  v-model="email"
                  type="email"
                  placeholder="Correo Electrónico"
                  class="form-control mx-auto"
                />
              </div>

              <div
                v-if="emailInvalid && (emailTouched || emailDirty)"
                class="text-danger"
              >
                <div v-if="emailErrors?.['required']">
                  Es necesario ingresar un correo electrónico.
                </div>
                <div v-if="emailErrors?.['email']">
                  El correo electrónico no es válido.
                </div>
              </div>

              <div class="mb-3">
                <input
                  v-model="password"
                  type="password"
                  placeholder="Contraseña"
                  class="form-control mx-auto"
                />
              </div>

              <div
                v-if="passwordInvalid && (passwordTouched || passwordDirty)"
                class="text-danger"
              >
                <div v-if="passwordErrors?.['required']">
                  Es necesario ingresar una contraseña.
                </div>
              </div>

              <div>
                <label>
                  <input type="checkbox" /> Recordar Contraseña
                  <a href="#">¿Has olvidado tu contraseña?</a>
                </label>
              </div>
              <button id="btn1" type="submit" class="btn btn-primary mt-3">
                Iniciar Sesión
              </button>
            </form>
            <p class="mt-4">
              ¿No tienes una cuenta?
              <router-link
                to="/registro"
                class="active"
                aria-current="page"
                id="a1"
                >Registrarse</router-link
              >
            </p>
          </div>
        </div>

        <div class="col-md-6 p-4">
          <div class="seccion-derecha">
            <img
              src="../../assets/Imagen1.png"
              alt="Imagen Pastelería"
              class="img-fluid w-100"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      loginError: "",
    };
  },
  computed: {
    emailInvalid() {
      return (
        !this.email ||
        ((this.emailTouched || this.emailDirty) &&
          !!this.emailErrors?.["required"])
      );
    },
    emailErrors() {
      return this.emailErrors?.["email"];
    },
    emailTouched() {
      return this.emailTouched;
    },
    emailDirty() {
      return this.emailDirty;
    },
    passwordInvalid() {
      return (
        !this.password ||
        ((this.passwordTouched || this.passwordDirty) &&
          !!this.passwordErrors?.["required"])
      );
    },
    passwordErrors() {
      return this.passwordErrors?.["password"];
    },
    passwordTouched() {
      return this.passwordTouched;
    },
    passwordDirty() {
      return this.passwordDirty;
    },
  },
  methods: {
    iniciarSesion() {
    },
  },
};
</script>

<style scoped>

</style>