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
      default: '/unknow.png'
    }
  }
}
</script>
