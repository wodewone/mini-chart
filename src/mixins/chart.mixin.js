import numeral from "numeral";
import {http} from '@/lib/api.rest'
// import ScrollBar from '@antv/f2/lib/plugin/scroll-bar';
import pan from '@antv/f2/lib/interaction/pan';
import pinch from '@antv/f2/lib/interaction/pinch';

export default {
    data: {
        initChart(F2, config) {
            // F2.Chart.plugins.register([ScrollBar]);
            return new F2.Chart(config);
        },
        loading: false,
        chartTypeIndex: 0,
        chartLimitIndex: 2,
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
        chartLimitList: [
            {
                name: '周',
                value: 7,
            },
            {
                name: '月',
                value: 30,
            },
            {
                name: '季度',
                value: 90,
            },
            {
                name: '半年',
                value: 180,
            },
            {
                name: '年',
                value: 365,
            },
        ],
    },
    methods: {
        getChartType() {
            const {chartTypeList = {}, chartTypeIndex = 0} = this.data || {};
            return chartTypeList[chartTypeIndex].value || 'volume';
        },
        getChartLimit() {
            const {chartLimitList = {}, chartLimitIndex = 0} = this.data || {};
            return chartLimitList[chartLimitIndex].value || 10;
        },
        async changeChartType({detail: {value}}) {
            this.setData({chartTypeIndex: value});
            await this.changeChart();
        },
        async changeChartLimit({detail: {value}}) {
            this.setData({chartLimitIndex: value});
            await this.changeChart();
        },
        async fetchChartData(type, limit = 100) {
            this.setData({loading: true});
            const data = await http.get('/v1/hb/' + type, {limit, chart: 1});
            this.setData({loading: false});
            data.forEach(item => {
                item.time = +new Date(item.date);
            });
            return data;
        },
        async renderMarketChart(chart, data) {
            // this.chart.changeData(data);
            chart.clear();
            chart.source(data, {
                data: {
                    tickCount: 7,
                    formatter(value) {
                        return numeral(value).format('0.00 a');
                    }
                },
                fear: {
                    ticks: [0, 15, 30, 45, 60, 75, 90],
                },
                date: {
                    type: 'timeCat',
                    mask: 'MM-DD',
                    range: [0, 1],
                },
            });
            chart.legend();
            chart.tooltip({
                showCrosshairs: true,
                showItemMarker: false,
                background: {
                    radius: 2,
                    fill: '#1890FF',
                    padding: [3, 5]
                },
                nameStyle: {
                    fill: '#fff'
                },
                onShow({items}) {
                    items[0].name = items[0].title;
                }
            });
            chart.axis('fear', {grid: null});
            chart.interval().position('date*data').color('#4b9cfa');
            chart.line().position('date*fear').color('#facc14');
            chart.render();
        }
    },
    onResize({size}) {
        // const pixelRatio = wx.getSystemInfoSync().pixelRatio;
        // wx.createSelectorQuery().select('.f2-canvas').fields({
        //     node: true,
        //     size: true
        // }).exec((res) => {
        //     console.info(181, res);
        //     const [{node, width, height}] = res;
        //     node.width = width * pixelRatio;
        //     node.height = height * pixelRatio;
        //     this.chart.changeSize(width, height);
        //     this.chart.repaint();
        // });
    }
};