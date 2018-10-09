import Vue from 'vue'
import Vuex from 'vuex'
import sidebar from './modules/sidebar'
import login from './modules/login'
import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		sidebar,
		login,
		permission
	},
  	getters
})

export default store
