import pkg from './package'

export default {
  server: {
    port: 8000, // default: 3000
    host: '0.0.0.0' // default: localhost
  },
  mode: 'spa',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.webtitle,
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: pkg.description
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },

  /*
   ** Global CSS
   */
  css: [],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/axios'],

  router: {
    middleware: ['auth']
  },
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:5000',
      ws: true,
      xfwd: true
    }
  },
  auth: {
    redirect: {
      callback: '/callback',
      logout: '/login',
      home: '/'
    },
    strategies: {
      google: {
        client_id:
          '170766219776-jtbcsc1ao0rnov1h2v3fv8i2l995tklu.apps.googleusercontent.com'
      }
    }
  },

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    '@nuxtjs/auth',
    '@nuxtjs/proxy'
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
