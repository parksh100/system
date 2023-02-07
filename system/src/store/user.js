import VueCookies from 'vue-cookies'

export const user = {
  namespaced: true,
  state() {
    return {
      userInfo: {} // 로그인 정보를 어떻게 저장할지가 관건이다. 정보를 넣기 위해서는 mutation setUser를 사용해야 한다.
    }
  },
  getters: {
    isLogin(state) {
      // === pertisitedstate 사용할때
      //   if (state.userInfo.name) {
      //     return true
      //   } else {
      //     return false
      //   }
      // }
      // ====vue-cookies 사용할때
      if (VueCookies.get('userInfo')) {
        return true
      } else {
        return false
      }
    }
  },
  mutations: {
    // 방법1. vue-cookies 설치 ; 시간설정 할수 있음.
    // 방법2. vuex-persistedstate 설치: 로컬스토리지에 저장됨.
    setUser(state, userInfo) {
      // userInfo는 로그인 후 받아온 정보이다.
      state.userInfo = userInfo
      // 새로고침해도 사용자 정보를 유지하기 위해 쿠키에 저장한다. ===================
      VueCookies.set('userInfo', userInfo, '3h')
    },
    logout(state) {
      state.userInfo = {} // vuex-persistedstate를 사용할때
      VueCookies.remove('userInfo') // vue-cookies를 사용할때
    }
  },
  actions: {
    // 비동기
    // 서버에 저장함.
  }
}
