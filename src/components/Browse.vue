<template>
    <div class="container">
      <div class="box" style="padding: 1rem; margin-top: 100px; margin-bottom: 100px">
        <div v-bind:key="item.id" v-for="item in list">
          <prop-card :item="item" :route="'/view/'+item.id" ></prop-card>
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
      list: [{
        id: "1",
        title: "Ucionica 1",
        price: "20KM/h",
        cover: "https://images.unsplash.com/photo-1510531704581-5b2870972060?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1052&q=80",
        location: "Fakultet strojarstva, računarstva i elektrotehnike Mostar"

      },{
        id: "2",
        title: "Ucionica 2",
        price: "25KM/h",
        cover: "https://images.unsplash.com/photo-1510531704581-5b2870972060?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1052&q=80",
        location: "Fakultet strojarstva, računarstva i elektrotehnike Mostar"

      },{
        id: "3",
        title: "Ucionica 3",
        price: "15KM/h",
        cover: "https://images.unsplash.com/photo-1510531704581-5b2870972060?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1052&q=80",
        location: "Fakultet strojarstva, računarstva i elektrotehnike Mostar"

      }],
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