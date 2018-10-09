import Cookies from 'js-cookie'

const sidebar = {
  state: {
    sidebar: {
      isOpen:!+Cookies.get('sidebarStatus')
    }
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      state.sidebar.isOpen = !state.sidebar.isOpen
       if (state.sidebar.isOpen) {
        Cookies.set('sidebarStatus', 0)
      } else {
        Cookies.set('sidebarStatus', 1)
      }

    }
   
  },
  actions: {
    toggleSideBar({ commit }) {
      console.log(Cookies.get('sidebarStatus'))
      commit('TOGGLE_SIDEBAR')
    }  
  }
}

export default sidebar
