const apiUrl = 'https://www.wodewone.com';
const getHeader = () => {
    const userToken = wx.getStorageSync('userToken');
    if (userToken) {
        const {token_type, access_token} = userToken;
        return {"Authorization": token_type + '_' + access_token};
    }
};
const _fetch = ({url, method, data, ...requestParams} = {}) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: apiUrl + url,
            data,
            method,
            ...requestParams,
            complete(res) {
                const {statusCode, data, errMsg} = res;
                if (~[20].indexOf(~~(statusCode) / 10)) {
                    resolve(data);
                } else {
                    reject(errMsg);
                }
            }
        });
    })
};

const http = _fetch;
http.get = (url, data, ...param) => _fetch({method: 'GET', url, data, ...param});
http.post = (url, data, ...param) => _fetch({method: 'POST', url, data, ...param});

export {
    apiUrl,
    http
};