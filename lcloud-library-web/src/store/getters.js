const getters = {
	sidebar: state => state.sidebar.sidebar,
	token: state => state.login.token,
	user: state => state.login.user,
	header_router:state => state.permission.header_router,
	siderbar_routers:state => state.permission.siderbar_routers,
	addRouters:state => state.permission.addRouters,
}
export default getters