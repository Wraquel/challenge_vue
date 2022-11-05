import Vue from 'vue'
import App from './App.vue'
import store from './store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFloppyDisk, faTrashCan, faPenToSquare,faFaceMeh} from '@fortawesome/free-regular-svg-icons'


import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faFloppyDisk, faTrashCan, faPenToSquare,faFaceMeh)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
Vue.use(require('vue-moment'));

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
