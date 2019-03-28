<template>
  <section class="container">
    <b-row class="pt-3">
      <b-col xs="3">
        <UserImg :imgurl="info.img" />
      </b-col>
      <b-col xs="5">
        <UserInfo :info="info" />
      </b-col>
      <b-col md="4">
        <p>{{ targetStudentID }}</p>
        <SearchBox :target="targetStudentID" @selectperson="SearchConfirm" />
      </b-col>
    </b-row>
    <Footer />
  </section>
</template>

<script>
import Footer from '~/components/Footer.vue'
import UserInfo from '~/components/UserInfo.vue'
import UserImg from '~/components/UserImg.vue'
import SearchBox from '~/components/SearchBox.vue'

export default {
  // auth: false, // Temp disable auth
  components: {
    Footer,
    UserInfo,
    UserImg,
    SearchBox
  },
  data() {
    return {
      info: {
        img: '/unknow.png',
        name: 'กรุณาระบุคำค้น',
        surname: '',
        en_name: ' ',
        year: '',
        stdid: '',
        dep: ''
      },
      targetStudentID: ''
    }
  },
  async created() {
    await this.$http.get('/auth/check')
  },
  methods: {
    SearchConfirm(SearchData) {
      const thisyear = 61
      this.info.img = '/api/student/image?id=' + SearchData.StudentID
      this.info.stdid = SearchData.StudentID
      this.info.name = SearchData.Name
      this.info.surname = SearchData.Surname
      this.info.en_name = SearchData.ENName + ' ' + SearchData.ENSurname
      this.info.year =
        thisyear - Math.floor(SearchData.StudentID / 100000000) + 1
      this.$http
        .get('/student/info', {
          params: {
            id: SearchData.StudentID
          }
        })
        .then(resp => {
          this.info.name = resp.data.thainame.split(' ')[1]
          this.info.surname = resp.data.thainame.split(this.info.name + ' ')[1]
          this.info.en_name = resp.data.engname
          this.info.dep = resp.data['major-id']
        })
    }
  }
}
</script>
