<template>
  <v-container>
    <v-container  d-flex justify-space-between>
      <h1> {{ data.dataTitle }}</h1>

    </v-container>
    <v-divider horizontal></v-divider>
    <v-container>
      <v-row class="my-1" align="center">
        <strong class="mx-4 info--text text--darken-2">
          Tâches restantes: {{ remainingTasks }}
        </strong>

        <v-divider vertical></v-divider>

        <strong class="mx-4 success--text text--darken-2">
          Tâches terminées : {{ completedTasks }}
        </strong>

        <v-spacer></v-spacer>

        <v-progress-circular :value="progress" class="mr-2"></v-progress-circular>
      </v-row>
    </v-container>

    <v-divider horizontal></v-divider>
  
    <v-container class="new-todo">
      <v-form method="post"  @submit.prevent="createTask">
        <input type="text"  v-model="dataInput.name" name="name" placeholder="Ajouter une tâche" style="color:beige"/>
        <v-btn small elevation="2" color="primary" type="submit" > Ajouter une tâche </v-btn>
      </v-form>
    </v-container>

    <v-container  v-show="hasTasks">
      <div  class="d-flex">
        <v-checkbox class="toggle-all" v-model="allCompleted"></v-checkbox>
        <p class="mx-0 ma-5">Tout valider</p>
      </div>
      <div>
        <v-btn class="delete-completed" color="red" small @click.prevent="deleteCompleted" v-show="completedTasks"> Supprimer les tâches terminées</v-btn>
      </div>   
    </v-container>

    <v-container >
      <v-card  v-if="tasks.length > 0">
        <v-slide-y-transition class="py-0" group tag="v-list">
          <v-list-item class="task  d-flex justify-space-around" v-for="(task, i) in tasks" :key="`${i}`">
            <v-list-item class="view">  
              <v-checkbox v-model="task.isCompleted" @click.prevent="completeTaskinBDD(task._id)" :color="task.isCompleted && 'grey' || 'primary'"></v-checkbox>
              <input type="text" v-model="task.name" @change.prevent="editTask(task._id)" :class="task.isCompleted && 'grey--text' || 'primary--text'">
            </v-list-item>
            <v-btn class="delete-task" small color="red" @click.prevent="deleteTask(task._id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>

            <v-scroll-x-transition>
              <v-icon v-if="task.isCompleted" color="success">
                mdi-check
              </v-icon>
            </v-scroll-x-transition>
            
          </v-list-item>
        </v-slide-y-transition>
      </v-card>
    </v-container>
  </v-container>
</template>


<script>
import axios from 'axios';
  export default {
    data (){
      return {
        tasks: [],
        newTask:'',
        test:'',
        dataInput :{
          name: '',
          isCompleted:false,
        }
      }
    },
    props: {
      data:Object
    },

    created () {
      //Affichage des tasks déjà présentes en BDD
      axios
        .get(`http://localhost:8000/todos`)
        .then ( task => {
          this.tasks = task.data ; 
        })
        
    },

    methods: {
      deleteCompleted () { 
      try {
          const trueTasks = this.tasks.filter(task => task.isCompleted !== false);
          console.log("indexDelete", trueTasks)
          console.log("this.tasks avant boucle", this.tasks)
          trueTasks.forEach( function(task) {
            console.log("task dans boucle avant axios", task)
            axios
              .delete(`http://localhost:8000/todos/${task._id}`)
            })
            const falseTasks = this.tasks.filter(task => task.isCompleted === false);
            this.tasks = falseTasks
              
        } catch (e) {
          console.error(e)
        }
      },

      createTask() {
        try { 
          axios
            .post(`http://localhost:8000/todos`, this.dataInput)
            .then( response => {
              this.tasks.push(response.data)
              this.dataInput.name =''
            })
        } catch (e) {
          console.error(e)
        }
      },

      editTask(id) {
        try {
          const taskToUpdate = this.tasks.find( task => task._id === id)
          axios.patch(`http://localhost:8000/todos/${id}`, {
            name:taskToUpdate.name
          })
        } catch (e) {
          console.error(e)
        }
      },

      deleteTask(id) {
        try {
          const indexDelete = this.tasks.filter( task => task._id !== id)
          axios
          .delete(`http://localhost:8000/todos/${id}`)
          .then( response => {
              this.tasks = indexDelete
          })
        } catch (e) {
          console.error(e)
        }
      },

      completeTaskinBDD(id) {
        try {
          const taskToComplete = this.tasks.find( task => task._id === id)
          axios.patch(`http://localhost:8000/todos/${id}/completed`, {
            isCompleted:taskToComplete.isCompleted
          })
          console.log("tableau tasks après", this.tasks)
        } catch (e) {
          console.error(e)
        }
      },
    },

    computed: {
      
      completedTasks () {
        return this.tasks.filter(task => task.isCompleted).length
        },
      progress () {
        return this.completedTasks / this.tasks.length * 100 || 0
      },
      remainingTasks () {
        return this.tasks.length - this.completedTasks
      },
      allCompleted:{
        get () {
          return this.remainingTasks === 0
        },
        set (value) {
          this.tasks.forEach( task => {
            task.isCompleted = value
          })
          console.log("this.tasks",this.tasks)
        }
      },
      hasTasks() {
        return this.tasks.length > 0
      },
    }
  }
</script>