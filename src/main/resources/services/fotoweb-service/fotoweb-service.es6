const root = 'https://mediearkiv.forsvaret.no';
const libs = {
    portal: require('/lib/xp/portal'),
    httpClient: require('/lib/http-client')
};

exports.get = (req) => {
    return {
        contentType: 'application/json',
        body: getItems(parseparams(req.params))
    }
}

function getItems(params) {
    const query = (params.query || '').trim();
    const resultArray = [];
    const archives = fetch('/fotoweb/archives/');
    if (archives && archives.data) {
        const searchUrls = archives.data.map((v) => v.searchURL);
        searchUrls.forEach((url) => {
            const data = parseResponse(getDataFromArchivesByQuery(url, query))
            resultArray.push(...data)
        })
    }
    return parseResults(resultArray, params)
}

function parseResults(resultArray, params) {
    return {
        hits: uniqBy(resultArray).slice(params.start, params.end),
        count: params.count,
        total: resultArray.length
    }
}

function parseResponse(data) {
    const filtered = data.filter((v) => v.previewcount > 0 && v.filename);
    return filtered.map((v) => ({
        id: root + v.previews[0].href,
        iconUrl: root + getSmallestPicture(v.previews).href,
        description: "",
        displayName: v.filename
    }))
}

function getSmallestPicture(previews) {
    return previews.sort((a, b) => (a.size > b.size) ? 1 : -1)[0]
}

function getDataFromArchivesByQuery(url, query) {
    const response = fetch(url.replace("{?q}", `?fn=${query}`))
    if (response && response.assets && response.assets.data) {
        return response.assets.data
    }
    return [];
}

function fetch(url) {
    try {
        const response = libs.httpClient.request({
            url: `${root}${url}`,
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            contentType: 'application/json',
            connectTimeout: 5000,
            readTimeout: 10000
        });
        if (response.status === 200) {
            return JSON.parse(response.body);
        }
    } catch (e) {
    }
    return null;
}

const uniqBy = (arr) => {
    const result = [];
    const map = [];
    arr.forEach((item) => {
        if (map.indexOf(item.id) === -1) {
            map.push(item.id);
            result.push(item);
        }
    });
    return result;
};

function parseparams(params) {

    let query = params['query'], start, count;
    try {
        start = Math.max(parseInt(params['start']) || 0, 0);
    } catch (e) {
        start = 0;
    }
    try {
        count = Math.max(parseInt(params['count']) || 15, 0);
    } catch (e) {
        count = 15;
    }

    return {
        query: query,
        start: start,
        end: start + count,
        count: count
    }
}
