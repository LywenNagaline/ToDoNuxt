<template>
  <v-container>
    <div
      class="d-flex flex-column"
      v-for="(data, index) in dataList"
      :key="index"
      style="gap: 0.5rem"
    >
    <v-card
        v-if="data.activeButton"
        :width="$vuetify.breakpoint.mdAndDown ? 200 : 344"
        rounded="lg"
    >
      <v-btn style="color:deepskyblue" block small @click="addNewTask(index, true)">
          Add list
      </v-btn>
    </v-card>

    <!-- Cette div active la carte pour entrer le titre -->
    <div v-show="data.openForm">

      <!-- ? -->
      <div v-if="!data.cardTitle">

        <!-- Champs d'ajout du titre -->
        <v-card-text class="px-2">
            <v-text-field
                ref="form"
                color="red accent-2"
                solo
                label="Card Title"
                dense
                @keypress.enter="
                    addTitleCard(index)
                "
                v-model="data.dataTitle"
            ></v-text-field>
        </v-card-text>

        <!-- Boutons -->
        <v-card-actions class="d-flex justify-space-between pt-0">
          <!-- Ce bouton repasse le openForm à false et donc revient sur la vue de base -->
            <v-btn color="red" plain @click="addNewTask(index, false)">
                Cancel
            </v-btn>

            <!-- Ce bouton rajoute le tite -->
            <v-btn color="success" plain @click="addTitleCard(index)">
                Add List
            </v-btn>
        </v-card-actions>
    </div>

    <v-container  v-else>
      <todos
        :taskIndex="index"
        :data="data"
    />

    <v-btn
        depressed small
        @click="deleteList(data.dataTitle)"
        color="red accent-2 white--text"
      >
        Supprimer la liste
      </v-btn>


    </v-container>


      </div>
    </div>
  </v-container>
</template>


<script>
import Todos from '../components/ToDoList.vue'

export default {
  components: { Todos },
  data() {
    return {
      dataList: [
        {
          cardTitle: '',
          openForm: false,
          dataTitle: '',
          activeButton: true,
          todoList: [],
        },
      ],
    };
  },

  methods: {
    addNewTask(index, value) {
      if (value) {
        this.dataList[index].openForm = value;
        this.dataList[index].activeButton = false;
      } else {
        this.dataList[index].openForm = value;
        this.dataList[index].activeButton = true;
      }
    },
    addTitleCard(index) {
      this.dataList[index].cardTitle = this.dataList[index].dataTitle;
      this.dataList.push({
        cardTitle: '',
        openForm: false,
        dataTitle: '',
        activeButton: true,
        todoList: [],
      });
    },
    deleteList (title) {
      this.dataList = this.dataList.filter(data => data.dataTitle !== title);
    },
  }
}

</script>