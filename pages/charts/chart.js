const app = getApp();

import mixin from './mixin';

Page({
    f2Chart: null,
    data: {
        // onInitChart: this.initF2Chart,
        loading: false,
        chartTypeIndex: 0,
        chartTypeList: [
            {
                name: '交易额',
                value: 'volume',
            },
            {
                name: '恐慌指数',
                value: 'fear',
            },
            {
                name: 'USDT',
                value: 'otc'
            },
            {
                name: '成交额+恐慌指数',
                value: 'market'
            }
        ],
    },
    async onLoad() {
        for (const key in mixin) {
            this[key] = mixin[key];
        }
        this.setData({initF2Chart: this.initChart});
        this.renderChart();
    },
    async onShow() {
        console.info(this.data.initF2Chart);
    }
});