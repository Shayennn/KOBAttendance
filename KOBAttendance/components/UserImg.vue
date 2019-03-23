<template>
  <div>
    <b-img :src="imgurl" fluid-grow thumbnail />
  </div>
</template>

<script>
export default {
  props: {
    imgurl: {
      type: String,
      default: 'http://bucroccs.bu.ac.th/image/person.png'
    }
  }
}
</script>
