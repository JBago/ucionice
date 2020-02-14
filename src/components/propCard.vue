<template>
    <div class="card" id="itemCard">
          <div class="card-content" style="padding: 1rem">
            <nav class="level is-mobile">
              <div class="level-left">
                <div class="level-item">
                  <div  class="card-image is-128x128" >
                        <router-link :to="route"><img :src="item.cover || 'images/no-image.jpg'" height="128" width="128" style="object-fit: scale-down; height: 100%; margin:0"></router-link>
                  </div>
                </div>
              </div>
              <div class="level level-item">
                <div class="level-item">
                  <h1 class="title is-6">
                    <router-link :to="route"><p class="title is-4">
                    {{item.title}}
                    </p></router-link>
                    <br><br>
                    Lokacija:
                    {{item.location}}
                  </h1>
                </div>
                <div class="level-item"></div>
                <div class="level-item">
                  <h1 class="title is-5">
                    {{item.price}} 
                  </h1>
                </div>
              </div>
            </nav>
            </div>
          </div>
</template>

<script>
export default {
    name: "prop-card",
    data: function(){
    return {       
    }
    },
    created: function(){

    },
    components: { },
    methods: {
    },
    props:{
      item: Object,
      route: String
  }
}
</script>

<style>
  #itemCard{
    margin-top: 1rem;
  }
</style>