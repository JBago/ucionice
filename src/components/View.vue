<template>
<div>
  <section class="section" >
    <div class="container box">
      <div class="columns">
        <div class="column">
            <img :src="'/images/' + selectedObject.filename + '/' + selectedObject.cover">
        </div>
        <div class="column">
          <span class="is-size-4 has-text-weight-medium is-family-primary">
                  {{selectedObject.title}}
          </span><br>
          <div class="has-text-left">
            <span class="is-size-6 is-family-primary">
                  <br><br>
                  Lokacija:  {{selectedObject.location.name}}
                  <br>
                  Vlasnik:  {{selectedObject.user.username}}
                  <br>
                  Broj telefona: {{selectedObject.user.phone_number || 'N/A'}}
                  <br>
                  Opis:
                  <br> 
                  {{selectedObject.description}}
                  <br>
                  <br>
            </span>
          </div> 
        </div>
        </div>
    </div>
  </section>
</div>
</template>


<script>
export default {
  name: 'View',
  data: function(){
    return {
        selectedObject: {},
    }
  },
  watch: {	},
  created: function(){
    this.fetchData();
  },
  methods: {
          fetchData(){
          this.axios.get('/api/property/' + this.$route.params.id).then((response) => {
              this.selectedObject= response.data[0];
            })
          },
  }
}
</script>

<style>

</style>
