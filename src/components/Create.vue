<template>
    <div class="section">
      <div class="container">
        <div class="notification is-danger" v-if="has_error && !success">
          <p>Greška, pokušajte ponovo!</p>
        </div>
        <div class="notification is-success" v-if="success">
          <p>Učionica uspješno dodana.</p>
        </div>
        <div class="card" v-if="!success">
          <div class="card-header">
            <p class="card-header-title">
              Dodaj Učionicu
            </p>
          </div>
        <div class="card-content" style="padding-bottom: 2.5rem;">
          <div class="columns">
          <div class="column">
            <div id="cover-box" class="box">
                <img  :src="cover" style="object-fit: scale-down">
            </div>
          <div class="file is-primary">
            <label class="file-label">
              <input @change="uploadCover" class="file-input" type="file" name="resume">
              <span class="file-cta">
                <span class="file-icon">
                  <i class="mdi mdi-upload"></i>
                </span>
                <span class="file-label">
                  Odaberi sliku...
                </span>
              </span>
            </label>
            </div>
          </div>
          <div class="column">
          <form id="create_form" autocomplete="off" @submit.prevent="create" method="post">
            <div class="field">
                <label for="name">Naziv:</label>
                <div class="control">
                  <input type="text" id="name" class="input" v-model="name" required>
                </div>
            </div>
                <label for="price">Cijena:</label>
            <div class="field has-addons">
                <div class="control" style="width:20%">
                  <input type="text" id="price" class="input"  v-model.number="price" required>
                </div>
                <div class="control"><a class="button is-primary is-static">KM/h</a></div>
            </div>
            <div class="field">
                <label for="name">Lokacija:</label>
                <div class="control">
                  <input type="text" id="location" class="input" v-model="location" required>
                </div>
            </div>
            <div class="field">
                <label for="description">Opis:</label>
                <div class="control">
                  <textarea class="textarea" id="description"  v-model="description"></textarea>
                </div>
            </div>
            <button id="send" hidden type="submit"></button>
          </form>
          </div></div>
        </div>

        <footer class="card-footer">
          <button @click="onSubmit" class="button is-primary card-footer-item" style="height: auto; border-radius: 0; padding: 0.6rem">
            <span class="has-text-weight-medium" style="font-size: 1.15rem">Create</span>
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    components: {},
    data() {
      return {
        name: '',
        price: '',
        location: '',
        description: '',
        has_error: false,
        error: '',
        cover: null,
        errors: {},
        success: false,
      }
    },
    computed: {
      csrf_token() {
        let token = document.head.querySelector('meta[name="csrf-token"]')
        return token.content
      }
    },
    methods: {
      onSubmit() {
            document.getElementById('send').click();
      },
      create() {
        var app = this;
        this.axios.post('/api/properties/create',
          {
            title: app.name,
            user_id: app.$auth.user().id,
            price: app.price+'€',
            description: app.description,
            location: app.location,
            cover: app.cover,
            photos: photosArray
          }) .then(function (response) {
            app.success = true;
          })
             .catch(function (error) {
            console.log(error.response.data.errors);
            app.has_error = true;
          })
      },
      uploadCover(){
          const image = event.target.files[0];
          const that = this;
          const reader = new FileReader();
          reader.readAsDataURL(image);
          reader.onload = event =>{
            that.cover = event.target.result;
          } 
        }
      }
    }
</script>

<style>
  #card-container {
    margin-top: 100px;
  }
  #cover-box{
    width: 100%;
    height: 80%;
  }
</style>