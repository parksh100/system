import { createStore } from 'vuex'
import { user } from './user'
import persistedstate from 'vuex-persistedstate'

export default createStore({
  modules: {
    user: user
  },
  plugins: [persistedstate({ paths: ['user.userInfo'] })] // vue-persistedstate사용할 때 방법임. 새로고침해도 유지하고 싶은 값을 배열로 넣어준다.
})
