<template>
  <div class="container">
    <div class="header d-flex justify-content-between mb-4 align-items-center">
      <h1>Next events</h1>
      <div>
        <input type="text" placeholder=" Search" v-model="search" />
      </div>
    </div>

    <ul class="list-group" v-if="data != ''">
      <li
        class="list-group-item p-0 border-custom"
        v-for="(event, index) in dataComputed"
        :key="index"
      >
        <div :class="availability(index)">
          <div
            class="event d-flex justify-content-between ms-4 py-3 align-items-center"
          >
            <div class="text-start">
              <h1 class="mb-0">{{ event.name }}</h1>
              <p class="small-text mt-n1">
                {{ event.eventStart | moment("DD.MM.YYYY") }} from
                {{ event.eventStart | moment("HH:mm") }} to
                {{ event.eventEnd | moment("HH:mm") }}
                ({{ durationEventTime(event) }}h)
              </p>
            </div>
            <div class="d-flex justify-content-between">
              <div class="text-end me-5">
                <p class="availability-text mb-0">Availability</p>
                <p class="ratio-availability-text mt-n1">
                  {{ event.booked }}/{{ event.capacity }}
                </p>
              </div>
              <div>
                <!-- button expand open  -->
                <button
                  class="button btn-open-cancel mx-3"
                  @click="buttonOpenCard(index)"
                >
                  <a href="#" v-if="thisItem == index && expandedCard">
                    Close</a
                  >
                  <a href="#" v-else> Open</a>
                </button>
              </div>
            </div>
          </div>
          <!-- expanded view -->
          <div v-show="thisItem == index && expandedCard">
            <div
              class="d-flex justify-content-between ps-3 pb-2 align-items-center"
            >
              <div
                class="description"
                v-show="thisItem == index && openEdition"
              >
                <textarea
                rows="4"
                cols="6"
                  class="text-description"
                  v-model="description"
                ></textarea>
              </div>
              <div
                class="description"
                v-show="thisItem == index && !openEdition"
              >
                <p class="text-description">{{ event.description }}</p>
              </div>
              <div class="me-2">
                <!-- button save -->
                <button
                  class="button btn-save mx-1"
                  @click="saveUpdate(index)"
                  v-show="thisItem == index && openEdition"
                >
                  <font-awesome-icon
                    id="icon"
                    icon="fa-regular fa-floppy-disk"
                  />
                  <a href="#"> Save</a>
                </button>
                <!-- button cancel  -->
                <button
                  class="button btn-open-cancel mx-1"
                  @click.prevent="buttonCancelEdit(index)"
                  v-show="thisItem == index && openEdition"
                >
                  <font-awesome-icon id="icon" icon="fa-regular fa-face-meh" />
                  <a href="#"> Cancel</a>
                </button>
                <!-- button open edition  -->
                <button
                  @click.prevent="buttonOpenEdit(index)"
                  class="button btn-edit mx-1"
                  v-show="thisItem == index && !openEdition"
                >
                  <font-awesome-icon
                    id="icon"
                    icon="fa-regular fa-pen-to-square"
                  />
                  <a href="#"> Edit</a>
                </button>

                <!-- button delete  -->
                <button
                  @click="deleteEvent(event)"
                  class="button btn-delete mx-1"
                >
                  <font-awesome-icon id="icon" icon="fa-regular fa-trash-can" />
                  <a href="#"> Delete</a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <div v-else>{{ this.$store.state.errorMessage }}</div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "NextEvents",

  data() {
    return {
      expandedCard: false,
      openEdition: false,
      description: "",
      thisItem: "",
      search: "",
    };
  },
  methods: {
    saveUpdate(index) {
      this.openEdition = !this.openEdition;
      if (this.description != "") {
        const updateEvent = {
          booked: this.$store.state.events[index].booked,
          capacity: this.$store.state.events[index].capacity,
          description: this.description,
          eventEnd: this.$store.state.events[index].eventEnd,
          eventStart: this.$store.state.events[index].eventStart,
          id: this.$store.state.events[index].id,
          name: this.$store.state.events[index].name,
        };
        this.$store.dispatch("SAVE_UPDATE", updateEvent);
      }
      this.description = "";
    },
    deleteEvent(event) {
      //console.log(event);
      this.$store.dispatch("DELETE_EVENT", event);
    },
    availability(index) {
      let availability =
        ((this.dataComputed[index].capacity - this.dataComputed[index].booked) *
          100) /
        this.dataComputed[index].capacity;
      if (availability <= 20) return "card highAvailability";
      else if (availability >= 21 && availability <= 90)
        return "card mediumAvailability";
      else return "card lowAvailability";
    },
    buttonOpenCard(index) {
      this.expandedCard = !this.expandedCard;
      this.openEdition = false;
      this.thisItem = index;
    },
    buttonOpenEdit(index) {
      this.openEdition = !this.openEdition;
      this.thisItem = index;
      this.description = this.$store.state.events[index].description;
    },
    buttonCancelEdit(index) {
      this.openEdition = !this.openEdition;
      this.thisItem = index;
      this.description = "";
    },
    durationEventTime(event) {
      const { eventEnd, eventStart } = event;
      const to = moment(eventEnd);
      const from = moment(eventStart);
      const durationTime = moment.duration(to.diff(from)).as("hours");
      return durationTime;
    },
  },
  computed: {
    data() {
      return this.$store.state.events;
    },
    dataComputed() {
      let searchEvents = this.data;
      if (this.search != "" && this.search) {
        searchEvents = searchEvents.filter((item) => {
          return (
            item.name.toUpperCase().includes(this.search.toUpperCase()),
            item.description.toUpperCase().includes(this.search.toUpperCase())
          );
        });
      }
      return searchEvents;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header h1 {
  font-size: 14pt;
  font-weight: 500;
  color: #4b536b;
  margin-bottom: 0;
  margin-left: 10px;
}
.event h1 {
  font-size: 16pt;
  font-weight: 500;
  color: #4b536b;
}
textarea:focus,
input:focus {
  outline: none;
}
textarea {
  border: none;
  padding: 5px;
  width: 100%;
  height: 100%;
  resize: none;
}
input {
  font-size: 11pt;
  border: 1px solid #d3d7db;
  padding: 4px;
}
button a {
  color: #fff;
  text-decoration: none;
}

.container {
  width: 70%;
  height: 70%;
}
.card {
  border-top: none;
  border-left: 18px solid;
  border-radius: 0;
  background-color: #f6f7f9;
}
.availability-text {
  font-size: 12pt;
  font-weight: 400;
  color: #979797;
}
.ratio-availability-text {
  font-size: 12pt;
  font-weight: 500;
  color: #4b536b;
}
.text-description {
  font-size: 12pt;
  font-weight: 400;
  color: #4b536b;
}
.small-text {
  font-size: 10pt;
  font-weight: 400;
  color: #979797;
}
.highAvailability {
  border-left-color: #6ac951;
}
.lowAvailability {
  border-left-color: #ff5533;
}
.mediumAvailability {
  border-left-color: #ffc764;
}
.mt-n1 {
  margin-top: -0.25rem !important;
}
.border-custom {
  border-left: 0;
  border-top: 0;
  border-right: 0;
  border-radius: 0;
  border-bottom: 1px solid #d3d7db;
}
.description {
  text-align: justify;
  margin-left: 0.5rem;
  width: 45%;
}

.button {
  padding: 10px 22px;
  border-radius: 5px;
}
.button a {
  font-size: 12pt;
  font-weight: 400;
  color: #fff;
}
.btn-open-cancel {
  border: 1px solid #d3d7db;
  background: #f1f1f8;
}

.btn-open-cancel a {
  color: #4b536b;
}
.btn-open-cancel #icon {
  color: #4b536b;
}
.btn-edit {
  background: #00a9f0;
  border-color: rgba(75, 83, 107, 0.4);
}
.btn-delete {
  border: 1px solid;
  background: #f16c64;
  border-color: rgba(74, 82, 106, 0.35);
}
.btn-save {
  border: 1px solid;
  background: #6ac951;
  border-color: rgba(74, 82, 106, 0.35);
}
#icon {
  color: #fff;
}
</style>
