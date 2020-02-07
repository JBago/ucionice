<template>
  <div id="app">
    <div class="navbar is-fixed-top"></div>
    <div id="nav" class="navbar container is-fixed-top">   
      <div id="navbarBasicExample"  class="navbar-menu navbar-menu-custom ">
        <div class="navbar-start">
          <router-link to="/"  class="navbar-item nav-item-custom">
            <span class="is-family-primary">Naslovnica</span>
          </router-link>
          <router-link   to="/create" class="navbar-item nav-item-custom">
            <span class="is-family-primary">Pozivnice</span>
          </router-link>
          <router-link   to="/properties" class="navbar-item nav-item-custom">
            <span class="is-family-primary">Moje učionice</span>
          </router-link>
           <router-link to="/browse" class="navbar-item nav-item-custom">
            <span class="is-family-primary">Učionice</span>
          </router-link>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <router-link  to="/login">
              <a  class="button is-light">
                Prijavi se
              </a>
              <router-link   to="/register">
                <a class="button is-info">
                  <strong>Registriraj se</strong>
                </a>
              </router-link>
              </router-link>
              <a  class="button is-light" href="#" >
                Odjava
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <router-view />
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
            Julijan Bago
        </p>
  </div>
</footer>
  </div>
</template>

<script>
export default {
  components: {
    //Login
  },
  data: function () {
    return {
      loginVisible: 0
    }
  },
  created: function () {
    //this.read();
  },
  methods: {
  }
    
}
</script>

<style>

</style>