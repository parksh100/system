<template>
  <div class="container">
    <!-- 조회조건 -->
    <div class="row row-cols-lg-auto g-3 align-items-center mb-1">
      <div class="col-12">
        <input
          type="search"
          class="form-control"
          v-model.trim="searchName"
          @keyup.enter="getList"
          placeholder="Name"
        />
      </div>
      <div class="col-12">
        <button class="btn btn-primary me-1" @click="getList">조회</button>
        <button
          class="btn btn-success me-1"
          data-bs-toggle="modal"
          data-bs-target="#auditorModal"
          @click="goToUserCreate"
        >
          생성
        </button>
        <button class="btn btn-info me-1" @click="doExcel">엑셀다운로드</button>
      </div>
    </div>
    <table class="table table-bordered">
      <thead>
        <tr class="bg-light">
          <!-- <th style="width: 5%">ID</th> -->
          <th style="width: 10%">성명</th>
          <th style="width: 15%">이메일</th>
          <!-- <th style="width/: 7%">비밀번호</th> -->
          <th style="width: 10%">역할</th>
          <th style="width: 15%">QMS가능코드</th>
          <th style="width: 15%">EMS가능코드</th>
          <th style="width: 15%">OHSMS가능코드</th>
          <!-- <th>Status</th> -->
          <th style="width: 10%">비고</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="item.user_id" v-for="item in list">
          <!-- <td style="word-break: break-all">{{ item.user_id }}</td> -->
          <td style="word-break: break-all">{{ item.user_name }}</td>
          <td style="word-break: break-all">{{ item.user_email }}</td>
          <!-- <td style="word-break: break-all">{{ item.user_pw }}</td> -->
          <td style="word-break: break-all">{{ item.user_role }}</td>
          <td style="word-break: break-all">{{ item.user_qms_code }}</td>
          <td style="word-break: break-all">{{ item.user_ems_code }}</td>
          <td style="word-break: break-all">{{ item.user_ohsms_code }}</td>
          <!-- <td>{{ item.use_yn }}</td> -->
          <td>
            <button
              class="btn btn-success btn-sm me-1"
              data-bs-toggle="modal"
              data-bs-target="#auditorModal"
              @click="goToUserChange(item.user_id)"
            >
              수정</button
            ><button
              class="btn btn-danger btn-sm me-1"
              @click="doDelete(item.user_id)"
            >
              삭제
            </button>
            <!-- <button
              class="btn btn-warning btn-sm"
              @click="
                changeStatus(item.user_id, item.use_yn === 'Y' ? 'N' : 'Y')
              "
            >
              {{ item.use_yn === 'Y' ? '사용중지' : '사용' }}
            </button> -->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/firebase-config'

export default {
  computed: {
    user() {
      const data = this.$store.state.user
      console.log(data)
      return data
      // return this.$store.state.user.user
      // return this.$store.user.userInfo
    }
  },
  components: {},
  data() {
    return {
      headers: [
        { title: 'ID', key: 'user_id' },
        { title: '성명', key: 'user_name' },
        { title: '이메일', key: 'user_pw' },
        { title: '비밀번호', key: 'user_name' },
        { title: '역할', key: 'user_role' },
        { title: '심사가능코드', key: 'user_auditable_code' }
      ],
      list: [],
      searchName: '',
      selectedItem: {
        user_id: -1,
        user_email: '',
        user_pw: '',
        user_name: '',
        user_role: '',
        user_auditable_code: []
      }
    }
  },
  setup() {},
  created() {},
  async mounted() {
    if (this.user.userInfo.email === undefined) {
      alert('로그인이 필요합니다.')
      this.$router.push({ path: '/login' })
    }

    // const r = await this.$get('/api/auditor')
    // console.log(r)
    // this.list = r
    this.getUserList()
  },
  unmounted() {},
  methods: {
    async getUserList() {
      const userRef = collection(db, 'user')
      console.log(userRef)
      const fbUserData = []
      const querySnapshot = await getDocs(userRef)
      /* cities라는 컬렉션의 모든 문서를 담는 변수 */
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, ' => ', doc.data())
        /* 이 부분에서 console.log 대신 setState()를 이용해 원하는 변수에 담아주면 된다. */

        fbUserData.unshift(doc.data())
      })
      console.log(fbUserData.length)
      this.list = fbUserData
      // const loader = this.$loading.show({ canCancel: false })
      // const result = await this.$post('/api/auditor/search', {
      //   param: [`%${this.searchName.toLowerCase()}%`]
      // })
      // console.log(result)
      // this.list = result.data
      // loader.hide()
    },

    doExcel() {
      this.$ExcelFromTable(this.headers, this.list, 'auditors', {})
    },

    doDelete(id) {
      this.$swal({
        title: '심사원정보를 정말 삭제 하시겠습니까?',
        text: '삭제된 데이터는 복원되지 않습니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: '취소',
        confirmButtonText: '삭제'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const loader = this.$loading.show({ canCancel: false })

          const r = await this.$delete(`/api/auditor/${id}`)
          console.log(r)

          loader.hide()

          if (r.status === 200) {
            this.$swal('심사원 정보가 삭제 되었습니다.')
            this.getList()
          } else if (r.status === 501) {
            this.$swal(
              `삭제하려는 심사원의 심사정보가 ${r.count}건 존재합니다.`
            )
          }
        }
      })
    },
    changeStatus(id, useYN) {
      let title = '심사원 정보 사용을 \n중지하시겠습니까?'
      if (useYN === 'Y') {
        title = '심사원 정보를 \n다시 사용하시겠습니까?'
      }
      this.$swal({
        title: title,
        // text: '삭제된 데이터는 복원되지 않습니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: '취소',
        confirmButtonText: '상태변경'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const loader = this.$loading.show({ canCancel: false })

          const r = await this.$put(`/api/auditor/${id}`, {
            param: { use_yn: useYN }
          })
          console.log(r)

          loader.hide()

          if (r.status === 200) {
            this.$swal('카테고리가 상태가 \n변경 되었습니다.')
            this.getList()
          }
        }
      })
    },
    doSave() {
      this.$swal({
        title: '심사원 정보를 수정 하시겠습니까?',
        // text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: '취소',
        confirmButtonText: '저장'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const loader = this.$loading.show({ canCancel: false })

          const r = await this.$put(
            `/api/auditor/${this.selectedItem.user_id}`,
            {
              param: {
                user_name: this.selectedItem.user_name,
                user_email: this.selectedItem.user_email,
                user_pw: this.selectedItem.user_pw,
                user_role: this.selectedItem.user_role,
                user_auditable_code: JSON.stringify(
                  this.selectedItem.user_auditable_code
                )
              }
            }
          )

          loader.hide()

          if (r.status === 200) {
            this.$refs.btnClose.click()
            this.$swal('심사원 정보가 저장되었습니다.')
            this.getList()
          }
        }
      })
    },
    doCreate() {
      this.$swal({
        title: '심사원정보를 생성 하시겠습니까?',
        // text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: '취소',
        confirmButtonText: '생성'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const loader = this.$loading.show({ canCancel: false })

          const r = await this.$post('/api/auditor', {
            param: {
              user_id: this.selectedItem.user_id,
              user_email: this.selectedItem.user_email,
              user_pw: this.selectedItem.user_pw,
              user_name: this.selectedItem.user_name,
              user_role: this.selectedItem.user_role,
              user_auditable_code: JSON.stringify(
                this.selectedItem.user_auditable_code
              )
            }
          })

          loader.hide()

          console.log(r)

          if (r.status === 200) {
            this.$refs.btnClose.click()
            this.$swal('심사원정보가 생성 되었습니다.')
            this.getList()
          }
        }
      })
    },
    openModal(id) {
      if (id === undefined) {
        this.selectedItem = {
          user_id: -1,
          user_email: '',
          user_pw: '',
          user_name: '',
          user_role: '',
          user_auditable_code: []
        }
      } else {
        // this.selectedItem = JSON.parse(
        //   JSON.stringify(this.list.filter((item) => item.user_id === id)[0])
        this.selectedItem = this.list.filter((item) => item.user_id === id)[0]
      }
    },
    clearSelectedItem() {
      this.selectedItem = {
        user_id: -1,
        user_email: '',
        user_pw: '',
        user_name: '',
        user_role: '',
        user_auditable_code: []
      }
    },
    goToUserCreate() {
      this.$router.push({ name: 'userCreateView' })
    },
    goToUserChange(id) {
      console.log(id)
      this.$router.push({
        path: '/user/change',
        query: { user_id: id }
      })
    }
  }
}
</script>
<style scoped>
th {
  text-align: center;
}
</style>
