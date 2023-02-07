<template>
  <main class="form-signin w-100 m-auto">
    <div>
      <img
        class="mb-4 mt-5 mx-auto d-block"
        src="@/assets/KAI.png"
        alt=""
        width=""
        height="200"
      />
      <h1 class="h3 mb-3 fw-normal text-center">Please sign in</h1>

      <div class="form-floating">
        <input
          type="email"
          class="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          v-model.trim="user.email"
        />
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating">
        <input
          type="password"
          class="form-control"
          id="floatingPassword"
          placeholder="Password"
          v-model.trim="user.pw"
        />
        <label for="floatingPassword">Password</label>
      </div>

      <!-- <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me" /> Remember me
        </label>
      </div> -->
      <button class="w-100 btn btn-lg btn-primary mt-3" @click="login">
        Sign in
      </button>
      <p class="mt-5 mb-3 text-muted">&copy; KAI Certification Inc. 2022</p>
    </div>
  </main>
</template>
<script>
// import auth module
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/firebase-config'

export default {
  components: {},
  data() {
    return {
      user: {
        email: '',
        pw: '',
        name: ''
      }
    }
  },
  setup() {},
  created() {},
  mounted() {},
  unmounted() {},
  methods: {
    login() {
      // const auth = getAuth()
      const email = this.user.email
      const password = this.user.pw
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          this.$swal('로그인 성공')
          const user = userCredential.user
          console.log(user)
          console.log(user.email)
          this.user.email = user.email

          this.$store.commit('user/setUser', {
            //             name: res.data.userData.user_name,
            email: user.email
            //             role: res.data.userData.user_role,
            //             id: res.data.userData.user_id,
            //             pw: res.data.userData.user_pw,
            //             code: res.data.userData.user_auditable_code,
            //             yn: res.data.userData.user_yn
            //           })
          })
          this.$router.push({ path: '/user/list' })
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message
          console.log(errorCode, errorMessage)
          // this.$swal('로그인 실패!, 다시 시도해주세요.')
          switch (errorCode) {
            case 'auth/invalid-email':
              this.$swal('이메일 형식이 올바르지 않습니다.')
              break
            case 'auth/user-disabled':
              this.$swal('사용자가 비활성화 되었습니다.')
              break
            case 'auth/user-not-found':
              this.$swal('존재하지 않는 사용자입니다.')
              break
            case 'auth/wrong-password':
              this.$swal('비밀번호가 일치하지 않습니다.')
              break
            default:
              this.$swal('로그인 실패!, 다시 시도해주세요.')
          }
        })
    }

    // login() {
    //   this.$store.commit('user/setUser', {
    //     name: 'Sunghoon Park',
    //     email: 'spark616@gmail.com'
    //   })
    //   this.$router.push({ path: '/home' })
    // }
    // async login() {
    //   await this.$post('/login', {
    //     user: this.user
    //   })
    //     .then(
    //       (res) => {
    //         // 로그인 성공
    //         console.log(res)
    //         // alert(res.data.message)
    //         this.$swal(res.data.message)
    //         // console.log(res.data.userData.user_name)
    //         if (res.data.success === true) {
    //           this.$store.commit('user/setUser', {
    //             name: res.data.userData.user_name,
    //             email: res.data.userData.user_email,
    //             role: res.data.userData.user_role,
    //             id: res.data.userData.user_id,
    //             pw: res.data.userData.user_pw,
    //             code: res.data.userData.user_auditable_code,
    //             yn: res.data.userData.user_yn
    //           })
    //           // this.$router.push({ path: '/customer/list/auditor' })
    //           this.$router.push({ path: '/mgt/pw/change' })
    //         }
    //       },
    //       (err) => {
    //         console.log(err)
    //         // 로그인 실패
    //         this.$swal('로그인 실패')
    //       }
    //     )
    //     .catch((err) => {
    //       this.$swal(err)
    //     })
    // }
  }
}
</script>
<style scoped>
html,
body {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  max-width: 330px;
  padding: 15px;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type='email'] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type='password'] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
