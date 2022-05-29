fetch('https://weibo-top-api.vercel.app/api').then(data => data.json()).then(data => {
    let html = '<div id="weibo-container">'
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
    for (let item of data) {
        html += '<div class="weibo-list-item"><div class="weibo-hotness ' + hotness[(item.hot || '荐')] + '">' + (item.hot || '荐') + '</div>' +
            '<span class="weibo-title"><a title="' + item.title + '"href="' + item.url + '" target="_blank" rel="external nofollow noreferrer">' + item.title + '</a></span>' +
            '<div class="weibo-num"><span>' + item.num + '</span></div></div>'
    }
    html += '</div>'
    document.getElementById('weibo').getElementsByClassName('item-content')[0].innerHTML = html
}).catch(function(error) {
    console.log(error);
});
