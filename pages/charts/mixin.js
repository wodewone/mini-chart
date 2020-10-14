const app = getApp();
import numeral from 'numeral';

const {http} = app.require('/lib/api.rest');
const ScrollBar = app.require('@antv/f2/lib/plugin/scroll-bar');

const mixin = {
    // initChartConfig(domId) {
    //     return new Promise((resolve) => {
    //         const query = wx.createSelectorQuery();
    //         query.select(domId)
    //             .fields({
    //                 node: true,
    //                 size: true
    //             })
    //             .exec(([{
    //                 node,
    //                 width,
    //                 height
    //             }]) => {
    //                 const context = node.getContext('2d');
    //                 const pixelRatio = wx.getSystemInfoSync().pixelRatio;
    //                 node.width = width * pixelRatio;
    //                 node.height = height * pixelRatio;
    //                 resolve({
    //                     context,
    //                     width,
    //                     height,
    //                     pixelRatio
    //                 });
    //             });
    //     });
    // },
    initChart(F2, config) {
        // F2.Chart.plugins.register(ScrollBar);
        return new F2.Chart(config);
    },
    async fetchChartData(type, limit = 100) {
        this.setData({loading: true});
        const data = await http.get('/v1/hb/' + type, {limit, chart: 1});
        this.setData({loading: false});
        return data;
    },
    async changeChart() {
        const type = this.getChartType();
        const limit = this.getChartLimit();
        const _d = await this.fetchChartData(type, limit);
        if (!this.chart) {
            const {chart} = this.selectComponent('.f2-chart');
            this.chart = chart;
        }
        this.chart.clear();
        if (type === 'market') {
            let data = [];
            _d.forEach((item, index) => {
                const _i = index - _d.length / 2;
                if (item.type === 'Vol')
                    data.push(item);
                else
                    data[_i].fear = item.data;
            });
            this.renderMarketChart(this.chart, data);
        } else {
            this.renderChart(this.chart, _d);
        }
    },
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
    renderChart(chart, data) {
        chart.source(data, {
            date: {
                range: [0, 1],
                type: 'timeCat',
                mask: 'MM-DD'
            },
            data: {
                type: 'linear',
                formatter(value) {
                    return numeral(value).format('0.00 a');
                },
            }
        });
        chart.axis('date', {
            label(text, index, total) {
                return index === 0 ? {
                    textAlign: 'left'
                } : index === total - 1 ? {
                    textAlign: 'right'
                } : {};
            }
        });
        chart.legend();
        chart.tooltip({
            showCrosshairs: true
        });
        chart.line().position('date*data').color('type');
        chart.render();
    },
    async renderMarketChart(chart, data) {
        chart.source(data, {
            data: {
                tickCount: 7,
                formatter: function formatter(value) {
                    return numeral(value).format('0.00 a');
                }
            },
            fear: {
                ticks: [0, 15, 30, 45, 60, 75, 90],
            },
            date: {
                type: 'timeCat',
                range: [0, 1],
            },
        });
        chart.axis('fear', {
            grid: null
        });
        chart.interval().position('date*data').color('#4b9cfa');
        chart.line().position('date*fear').color('#facc14');
        chart.point().position('date*fear').size(2).color('#fab31e');
        chart.interaction('pan');
        // chart.scrollBar();
        chart.render();
    }
};
export default mixin;