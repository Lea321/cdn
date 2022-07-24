try {
    let w = document.getElementById('weibo').clientWidth
    if (w) {
        weibo();
    }
} catch (error) {}

function weibo() {
    let hotness = {
        '爆': 'weibo-boom',
        '热': 'weibo-hot',
        '沸': 'weibo-boil',
        '新': 'weibo-new',
        '荐': 'weibo-recommend',
        '影': 'weibo-jyzy',
        '剧': 'weibo-jyzy',
        '综': 'weibo-jyzy'
    }
    let html = '<div id="weibo-container">'
    let data = JSON.parse(localStorage.getItem('weibo'));
    let nowTime = Date.now();
    let ls;
    if (data == null || nowTime - data.time > 600000) {
        getData();
        return
    } else {
        ls = JSON.parse(data.ls)
    };
    for (let item of ls) {
        html += '<div class="weibo-list-item"><div class="weibo-hotness ' + hotness[(item.hot || '荐')] + '">' + (item.hot || '荐') + '</div>' +
            '<span class="weibo-title"><a title="' + item.title + '"href="' + item.url + '" target="_blank" rel="external nofollow noreferrer">' + item.title + '</a></span>' +
            '<div class="weibo-num"><span>' + item.num + '</span></div></div>'
    }
    html += '</div>'
    document.getElementById('weibo').getElementsByClassName('item-content')[0].innerHTML = html
}

function getData() {
    fetch('https://weibo-top-api.vercel.app/api').then(data => data.json()).then(data => {
        data = { time: Date.now(), ls: JSON.stringify(data) }
        localStorage.setItem('weibo', JSON.stringify(data))
        console.log('微博热搜获取完成！');
    }).then(() => {
        weibo();
    });

}