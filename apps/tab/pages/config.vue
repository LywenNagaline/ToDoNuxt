<template>
  <div>
    <v-btn  style="color:crimson;" @click.prevent="entrerApp()">Entrer dans l'app Red</v-btn >
  </div>
</template>

<script>
import { app, pages } from "@microsoft/teams-js";
export default {

  async mounted() {
    await app.initialize();
  },
  

  methods: {
    entrerApp () {
          pages.config.registerOnSaveHandler((saveEvent) => {
              const configPromise = pages.config.setConfig({
                  websiteUrl: "https://localhost:3000/config",
                  contentUrl: `https://localhost:3000/`,
                  suggestedDisplayName: "To Do List"
              });
              configPromise.
                  then((result) => {saveEvent.notifySuccess()}).
                  catch((error) => {saveEvent.notifyFailure("failure message")});
          });
          pages.config.setValidityState(true);
      },

    }
  }
</script>