<template>
  <div class="container">
    <div class="header d-flex justify-content-between mb-2 align-items-center">
      <h2>Next events</h2>
      <div>
        <input
          v-model="searchValue"
          type="text"
          class="form-control"
          id="search-input"
          placeholder="Search Event"
        />
      </div>
    </div>
    <ul class="list-group">
      <li
        v-for="(event, index) in eventsComputed"
        :key="index"
        class="list-group-item"
      >
        <div :class="availabilityBar(index)">
          <div
            class="event-item d-flex justify-content-between ms-2 mt-3 align-items-center"
          >
            <div class="name-event text-start">
              <h1 class="mb-0">{{ event.name }}</h1>
             
              <p class="small-text mt-n1">
                {{ event.eventStart | moment("DD.MM.YYYY") }} from
                {{ event.eventStart | moment("HH:mm") }} to
                {{ event.eventEnd | moment("HH:mm") }} 
                
                <!-- 
                  let to = moment(eventEnd);
                  let from = moment(eventStart);
                  durationTime = moment.duration(to.diff(from)).as("hours"); -->
                  () HOURS
                </p>
            </div>
            <div class="d-flex justify-content-between">
              <div class="text-end me-5">
                <p class="small-text mb-0">Availability</p>
                <p class="ratio-availability">
                  {{ event.booked }}/{{ event.capacity }}
                </p>
              </div>
              <div>
                <button
                  @click.prevent="buttonOpen(index)"
                  class="custom-button btn-open-cancel mx-3"
                >
                  <a href="#" v-if="index == activeEvent && seenOpen"> Close</a>
                  <a href="#" v-else> Open</a>
                </button>
              </div>
            </div>
          </div>
          <!-- EXPENDEND OPEN -->
          <div v-show="index == activeEvent && seenOpen">
            <div
              class="d-flex justify-content-between ms-2 mt-3 mb-2 align-items-center"
            >
              <div
                v-show="index == activeEvent && seenEdit"
                class="description"
              >
                <textarea v-model="description" class="text-description">
                </textarea>
              </div>
              <div
                v-show="index == activeEvent && !seenEdit"
                class="description"
              >
                <p class="text-description">{{ event.description }}</p>
              </div>
              <div class="me-2">
                <button
                  v-show="index == activeEvent && seenEdit"
                  @click="saveUpdate(index)"
                  class="custom-button btn-save mx-1"
                >
                  <font-awesome-icon
                    id="icon"
                    icon="fa-regular fa-floppy-disk"
                  />
                  <a href="#"> Save</a>
                </button>
                <button
                  class="custom-button btn-open-cancel mx-1"
                  v-show="index == activeEvent && seenEdit"
                  @click.prevent="buttonEdit(index)"
                >
                  <font-awesome-icon id="icon" icon="fa-regular fa-face-meh" />
                  <a href="#"> Cancel</a>
                </button>
                <button
                  class="custom-button btn-edit mx-1"
                  v-show="index == activeEvent && !seenEdit"
                  @click.prevent="buttonEdit(index)"
                >
                  <font-awesome-icon
                    id="icon"
                    icon="fa-regular fa-pen-to-square"
                  />
                  <a href="#"> Edit</a>
                </button>
                <button
                  @click="deleteEvent(event)"
                  class="custom-button btn-delete mx-1"
                >
                  <font-awesome-icon id="icon" icon="fa-regular fa-trash-can" />
                  <a href="#">Delete</a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
//import moment from 'moment'
export default {
  name: "NextEvents",
  data() {
    return {
      description: "",
      activeEvent: "",
      seenEdit: false,
      seenOpen: false,
      searchValue: "",
    };
  },
  methods: {
    saveUpdate(index) {
      this.seenEdit = !this.seenEdit;
      if (this.description != "") {
        const updatEvents = {
          booked: this.$store.state.events[index].booked,
          capacity: this.$store.state.events[index].capacity,
          description: this.description,
          eventEnd: this.$store.state.events[index].eventEnd,
          eventStart: this.$store.state.events[index].eventStart,
          id: this.$store.state.events[index].id,
          name: this.$store.state.events[index].name,
        };
        this.$store.dispatch("SAVE_UPDATE", updatEvents);
      }
      this.description = "";
    },

    deleteEvent(event) {
      console.log(event);
      this.$store.dispatch("DELETE_EVENT", event);
    },
    availabilityBar(index) {
      let availability =
        ((this.eventsComputed[index].capacity -
          this.eventsComputed[index].booked) *
          100) /
        this.eventsComputed[index].capacity;
      if (availability <= 20) return "highAvailability";
      else if (availability >= 21 && availability <= 90)
        return "mediumAvailability";
      else return "lowAvailability";
    },
    buttonOpen(index) {
      this.seenOpen = !this.seenOpen;
      this.seenEdit = false;
      this.activeEvent = index;
    },
    buttonEdit(index) {
      this.seenEdit = !this.seenEdit;
      this.activeEvent = index;
      this.description = "";
    },
  },
  computed: {
    allEvents() {
      return this.$store.state.events;
    },
    eventsComputed() {
      let searchEvents = this.allEvents;
      if (this.searchValue != "" && this.searchValue) {
        searchEvents = searchEvents.filter((item) => {
          return (
            item.name.toUpperCase().includes(this.searchValue.toUpperCase()),
            item.description
              .toUpperCase()
              .includes(this.searchValue.toUpperCase())
          );
        });
      }
      return searchEvents;
    },
  
    // durationTime(){
    //   let to = moment(eventEnd);
    //               let from = moment(eventStart);
    //               durationTime = moment.duration(to.diff(from)).as("hours")
    //   return this.$store.state.events.map((event)=>({
    //     ...event,
    //     eventEnd: moment(event.eventEnd).format("DD.MM.YYYY")
      
    //   }))
    // },

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  width: 70%;
  height: 70%;
}
.highAvailability {
  border: 1px solid #d3d7db;
  border-left: 18px solid;
  border-left-color: #6ac951;
}
.list-group-item {
  background: #fcfafa;
}
.lowAvailability {
  border: 1px solid #d3d7db;
  border-left: 18px solid;
  border-left-color: #ff5533;
}

.mt-n1 {
  margin-top: -0.25rem !important;
}
.mediumAvailability {
  border: 1px solid #d3d7db;
  border-left: 18px solid;
  border-left-color: #ffc764;
}

h2 {
  margin-bottom: 0;
  margin-left: 10px;
  color: #4b536b;
  font-size: 18pt;
  font-weight: 500;
}
h1 {
  color: #4b536b;
  font-size: 18pt;
  font-weight: 500;
}
.description {
  margin-left: 0.5rem;
  width: 45%;
  text-align: justify;
}
.text-description {
  color: #4b536b;
  font-size: 11pt;
  font-weight: 400;
}
.small-text {
  color: #979797;
  font-size: 10pt;
  font-weight: 400;
}
.ratio-availability {
  color: #4b536b;
  font-size: 12pt;
  font-weight: 500;
}
a {
  text-decoration: none;
  color: #fff;
}
.custom-button {
  padding: 10px 22px;
  border-radius: 5px;
}
.custom-button a {
  font-size: 10pt;
  font-weight: 500;
  color: #fff;
}
.btn-open-cancel {
  background: #f1f1f8;
  border: 1px solid #d3d7db;
}
.btn-open-cancel a {
  color: #4b536b;
}
.btn-open-cancel #icon {
  color: #4b536b;
}
.btn-delete {
  background: #f16c64;
  border: 1px solid #4a526a;
}
.btn-save {
  background: #6ac951;
  border: 1px solid #4a526a;
}
.btn-edit {
  background: #00a9f0;
  border: 1px solid #4b536b;
}
#icon {
  color: #fff;
}
</style>
