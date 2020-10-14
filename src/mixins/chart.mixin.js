const app = getApp();

const {http} = app.require('/lib/api.rest');

export default {
    initChart(F2, config) {
        return new F2.Chart(config);
    },
};