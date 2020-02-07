<template>
    <div class="card" id="itemCard">
        <router-link :to="route"><div  style="z-index: 10;" class="is-overlay"></div></router-link>
          <div class="card-content" style="padding: 1rem">
            <nav class="level is-mobile">
              <div class="level-left">
                <div class="level-item">
                  <div  class="card-image is-128x128" >
                        <img :src="item.cover || 'images/no-image.jpg'" height="128" width="128" style="object-fit: scale-down; height: 100%; margin:0">
                  </div>
                </div>
              </div>
              <div class="level level-item">
                <div class="level-item">
                  <h1 class="title is-6">
                    Name:
                    {{item.title}}
                    <br><br>
                    Location:
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

</style>