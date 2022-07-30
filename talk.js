const apiUrl = 'https://kkapi-open-xi.vercel.app/api/ispeak?author=62cfe22a3a91f6ac8ea6803f'
var items = []
var br = /<\/*br>|^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
var re_forimg = /<img(.*?)src=[\"|\']?(.*?)[\"|\']?(.*?)>|!\[(.*?)\]\((.*?)[jpg|png|gif]\)/g;
var passName = location.pathname


window.addEventListener('DOMContentLoaded', () => {
    if (passName == '/talk/') {
        pageTalk();
    } else {
        let bb = document.getElementById('bber-talk')
        bb.innerHTML += '<i style="margin-right: 10px;" class="fa-regular fa-message"></i><ul class="talk-list">' + '<li><span class="datatime">通知</span>：说说加载中。。。</li>' + '</ul><i class="fa-solid fa-angles-right pass bber-icon"></i>'
        bb.addEventListener('click', () => {
            window.location.pathname = '/talk/'
        });
        indexTalk();
    }
})

// 渲染数据
function indexTalk() {
    clearInterval(time)
    let data = JSON.parse(localStorage.getItem('indexTalk'));
    let nowTime = Date.now();
    let ls;
    if (data == null || nowTime - data.time > 1800000) {
        indexData();
        return
    }
    ls = JSON.parse(data.ls)
    let html = ''
    ls.forEach((item, i) => {
        html += '<li class="item item-' + (i + 1) + '">' +
            '<span class="datatime">' + timeFormat(item.createdAt) + '</span>' + '： ' +
            toText(item.content, '<i class="fa-solid fa-image"></i>') + '</li>'
    });
    document.getElementById("bber-talk").innerHTML = '<i style="margin-right: 10px;" class="fa-regular fa-message"></i><ul class="talk-list">' + html + '</ul><i class="fa-solid fa-angles-right pass bber-icon"></i>'
    var time = setInterval(Roll, 3000);
}

// 时间格式化
function timeFormat(time) {
    let d = new Date(time)
    let date = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    return timeago.format(date, 'zh_CN');
}

// 获取数据
function indexData() {
    fetch(apiUrl)
        .then(res => res.json())
        .then((data) => {
            data = { time: Date.now(), ls: JSON.stringify(data.data.items) }
            localStorage.setItem('indexTalk', JSON.stringify(data))
        })
        .then(indexTalk)
}

// 格式化
function toText(str, img) {
    str = str.replace(br, '');
    str = str.replace(re_forimg, img);
    return str
}

// 轮播
function Roll() {
    try {
        let list_li = Array.prototype.slice.call(document.querySelectorAll('.talk-list li'));
        let tmp = list_li[0];
        list_li.splice(0, 1);
        list_li.push(tmp);
        let list = document.querySelector('ul.talk-list')
        list_li.forEach((item) => {
            list.appendChild(item)
        });
    } catch (error) {}
};


// 说说页面

function pageTalk() {
    fetch(apiUrl + '&pageSize=30').then(res => res.json()).then((res) => {
        items = res.data.items
    }).then(() => {
        let bb = document.getElementById('talk')
        bb.innerHTML = ''
        if (items.length == 30) {
            document.querySelector('.limit').style.display = 'block'
        }
        items.forEach((item) => {
            bb.innerHTML += '<div class="bb-box"><div class="bb-content">' + contentFormat(item.content) + '</div><div class="bb-bottom"><span class="time">' + timeFormat(item.createdAt) + '</span> <span style="margin-left:5px;"><i class="fa-solid fa-tag"></i> ' + item.tag.name + '</span> <a href="javascript:;" onclick="goComment(\'' + toText(item.content, '[图片]') + '\')"><span class="icon"><i class="fa-solid fa-message fa-fw"></i></span></a> </div></div>'
        })
        scrollFn();
    })
}


// 评论
function goComment(e) {
    var n = document.querySelector(".el-textarea__inner")
    n.value = "> " + e + "\n\n";
    n.focus();
    btf.snackbarShow("无需删除空行，直接输入评论即可", !1, 2e3);
}

// content格式化
function contentFormat(s) {
    let ls = s.match(/(http(.*).[jpg|png|gif])/g)
    s = s.replace(re_forimg, '')
    s = s.replace(br, '')
    let html = '<br>'
    if (ls) {
        ls.forEach((e) => {
            html += '<a href="' + e + '" target="_blank" data-fancybox="group" class="fancybox"><img src="' + e + '"></a>'
        })
    }
    s += html
    return s
}
const scrollFn = function() {
    const $rightside = document.getElementById('rightside')
    const innerHeight = window.innerHeight + 56

    // 當滾動條小于 56 的時候
    if (document.body.scrollHeight <= innerHeight) {
        $rightside.style.cssText = 'opacity: 1; transform: translateX(-58px)'
        return
    }

    // find the scroll direction
    function scrollDirection(currentTop) {
        const result = currentTop > initTop // true is down & false is up
        initTop = currentTop
        return result
    }

    let initTop = 0
    let isChatShow = true
    const $header = document.getElementById('page-header')
    const isChatBtnHide = typeof chatBtnHide === 'function'
    const isChatBtnShow = typeof chatBtnShow === 'function'

    window.scrollCollect = () => {
        return btf.throttle(function(e) {
            const currentTop = window.scrollY || document.documentElement.scrollTop
            const isDown = scrollDirection(currentTop)
            if (currentTop > 56) {
                if (isDown) {
                    if ($header.classList.contains('nav-visible')) $header.classList.remove('nav-visible')
                    if (isChatBtnShow && isChatShow === true) {
                        chatBtnHide()
                        isChatShow = false
                    }
                } else {
                    if (!$header.classList.contains('nav-visible')) $header.classList.add('nav-visible')
                    if (isChatBtnHide && isChatShow === false) {
                        chatBtnShow()
                        isChatShow = true
                    }
                }
                $header.classList.add('nav-fixed')
                if (window.getComputedStyle($rightside).getPropertyValue('opacity') === '0') {
                    $rightside.style.cssText = 'opacity: 0.8; transform: translateX(-58px)'
                }
            } else {
                if (currentTop === 0) {
                    $header.classList.remove('nav-fixed', 'nav-visible')
                }
                $rightside.style.cssText = "opacity: ''; transform: ''"
            }

            if (document.body.scrollHeight <= innerHeight) {
                $rightside.style.cssText = 'opacity: 0.8; transform: translateX(-58px)'
            }
        }, 200)()
    }

    window.addEventListener('scroll', scrollCollect)
}