<template>
  <div>
    <Settings
      v-if="showSettings"
      @toggleShowSettings="toggleShowSettings"
    />
    <div class="py-5 px-4 w-full">
      <!-- Heading -->
      <section>
        <div class="flex justify-between">
          <h1 class="font-bold text-3xl">Pyuturs Bot</h1>
          <div>
            <button @click="toggleShowSettings" class="settings">
              <svg style="width:22px;height:22px" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
              </svg>
            </button>
          </div>
        </div>
        <small class="text-gray-400">{{ currentTime }} </small>
      </section>
      <section class="wrapper balances mt-5">
        <h1 class="text-lg">Available Balances</h1>
        <div class="mt-4">
          <div class="flex justify-between">
            <div class="flex items-center">
              <p>Leverage</p>
            </div>
            <p class="text-gray-400">{{ settings.leverage }}✕</p>
          </div>
          <div class="flex justify-between mt-3">
            <div class="flex items-center">
              <p>Size</p>
            </div>
            <p class="text-gray-400">{{ settings.size }}%</p>
          </div>
        </div>
      </section>
      <section class="mt-5">
        <div class="flex flex-col mb-8">
         <div class="flex has-svg">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="currentColor" d="M5.41,21L6.12,17H2.12L2.47,15H6.47L7.53,9H3.53L3.88,7H7.88L8.59,3H10.59L9.88,7H15.88L16.59,3H18.59L17.88,7H21.88L21.53,9H17.53L16.47,15H20.47L20.12,17H16.12L15.41,21H13.41L14.12,17H8.12L7.41,21H5.41M9.53,9L8.47,15H14.47L15.53,9H9.53Z" />
            </svg>
            <h1 class="text-lg ml-2">Coin name:</h1>
          </div>
          <div>
            <div class="relative">
              <input
                v-model="coin"
                type="text" 
                class="dark-input mt-2 uppercase"
                style="padding-left: 25px !important;"
              >
              <div class="hash">
                <p class="text-lg">#</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="mt-5 flex justify-between">
        <button 
          class="btn-long go-btn"
          @click="handleSubmit('long')"
        >
          <span>LONG</span>
        </button>
        <button 
          class="btn-short go-btn"
          @click="handleSubmit('short')"
        >
          <span>SHORT</span>
        </button>
      </section>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
import Settings from '../Settings/Settings.vue' 

const defaultBinanceData = {
  balance: null,
  type: null
}

export default {
  components: {
    Settings
  },
  data: () => ({
    currentTime: '',
    showSettings: false,
    coin: '',
    binanceData: null,
  }),
  computed: {
    ...mapGetters({
      loading: 'loading',
      settings: 'getSettings',
      client: 'nodeBinance'
    }),
  },
  created () {
    this.binanceData = cloneDeep(defaultBinanceData)
  },
  mounted () {
    this.getTime()
    setInterval(() => this.getTime(), 1000)
  },
  methods: {
    async handleSubmit (type) {
      this.coin = this.coin.trim().toUpperCase()
      this.binanceData.type = type
      if (!this.coin.length) {
        return
      }
      await this.handleOrder()
    },
    async handleOrder () {
      await this.getFutureBalace()
    },
    async openOrder () {
      const quantity = await this.getQuantity()
      const res = (this.binanceData.type === 'short') 
        ? await this.client.futuresMarketSell( `${this.coin}USDT`, quantity )
        : await this.client.futuresMarketBuy( `${this.coin}USDT`, quantity )
      
      this.coin = ''
      this.binanceData = cloneDeep(this.defaultBinanceData)
      this.$toasted.show('Successfully placed order.', {
        position: 'top-center',
        duration: 5000,
        singleton: true,
      })
    },
    async getQuantity () {
      const { markPrice } = await this.client.futuresMarkPrice( `${this.coin}USDT` )
      const cost = (this.binanceData.balance / 100) * this.settings.size
      const leverageCost = (cost * this.settings.leverage)
      let quantity = leverageCost / markPrice
      if (quantity % 1 === 0) {
        return quantity
      }
      if (this.countDecimals(quantity) > 3) {
        quantity = +this.toFixed(quantity, 3)
      }

      return quantity
    },
    async setMarginType () {
      await this.client.futuresMarginType( `${this.coin}USDT`, 'CROSSED' )
      this.openOrder()
    },
    async setLeverage () {
      if (!this.binanceData.balance) {
        return
      }
      const res = await this.client.futuresLeverage(
        `${this.coin}USDT`,
        this.settings.leverage
      )
      if (res.code !== undefined) {
        this.showToastError(res.msg)

        return
      }
      this.setMarginType()
    },
    async getFutureBalace () {
      const balances = await this.client.futuresBalance()
      const usdtBalance = balances.find(balance => balance.asset === 'USDT')
      if (usdtBalance) {
        this.binanceData.balance = usdtBalance.availableBalance
        this.setLeverage()

        return
      }
      this.showToastError('USDT balance not found')
    },
    getTime () {
      this.currentTime = moment(new Date().valueOf()).format("MMM DD YYYY h:mm:ss")
    },
    toggleShowSettings () {
      this.showSettings = !this.showSettings
    },
    countDecimals (num) {
      if (Math.floor(num.valueOf()) === num.valueOf()) return 0;

      var str = num.toString();
      if (str.indexOf(".") !== -1 && str.indexOf("-") !== -1) {
        return str.split("-")[1] || 0;
      } else if (str.indexOf(".") !== -1) {
        return str.split(".")[1].length || 0;
      }
      return str.split("-")[1] || 0;
    },
    toFixed(num, fixed) {
      var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
      return num.toString().match(re)[0];
    }
  }
}
</script>

<style lang="scss" scoped>
@import './MainScreen.scss';
</style>