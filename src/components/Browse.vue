<template>
    <div class="container">
      <div class="box" style="padding: 1rem; margin-top: 100px; margin-bottom: 100px">
        <div v-bind:key="item.id" v-for="item in list">
          <prop-card :item="item" :route="'/View/'+item.id" ></prop-card>
        </div>
        <span v-show="list==false">{{emptyMessage}}</span>
      </div>
    </div>
</template>

<script>
import propCard from './propCard.vue';
export default {
  data: function(){
    return {    
      list: [],
      emptyMessage: 'Nema učionica.'   
    }
  },
  created: function(){
      this.fetchProps();
  },
  components: { propCard },
  methods: {
      fetchProps(){

      }
  },
  props:{

  }
}
</script>

<style>

</style>