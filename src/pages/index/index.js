import "../../js/head"
import share from "../../js/share_v2"
import "../../scss/reset.css"
import "../../scss/index.scss"
import "../../scss/swiper.min.css"
import {listSelectNews,addSelectNewsViews} from "../../js/api"
import config from "../../js/config"
function previous() {
  let start = getQueryString("startDate").replace(/-/g, '/')
  let end = getQueryString("endDate").replace(/-/g, '/')
  let startDate = new Date(start).valueOf()
  let endDate = new Date(end).valueOf()
  startDate -= 1000 * 60 * 60 * 24 * 7
  endDate -= 1000 * 60 * 60 * 24 * 7
  start = new Date(startDate)
  end = new Date(endDate)
  let startFormat = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate()
  let endFormat = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate()
  window.location.href = config.webHost+"/morningPaper/index.html?startDate=" + startFormat + "&endDate=" + endFormat
}
function next() {
  let start = getQueryString("startDate").replace(/-/g, '/')
  let end = getQueryString("endDate").replace(/-/g, '/')
  //alert(start)
  let startDate = new Date(start).valueOf()
  let endDate = new Date(end).valueOf()
  startDate += 1000 * 60 * 60 * 24 * 7
  endDate += 1000 * 60 * 60 * 24 * 7
  start = new Date(startDate)
  end = new Date(endDate)
  let startFormat = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate()
  let endFormat = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate()
  window.location.href = config.webHost+"/morningPaper/index.html?startDate=" + startFormat + "&endDate=" + endFormat
}
function toList() {
  window.location.href = config.webHost+"/morningPaper/list.html"
}
function formatDate(date) {
  var day = ''
  switch (date.getDay()) {
    case 0: day = '星期日'; break;
    case 1: day = '星期一'; break;
    case 2: day = '星期二'; break;
    case 3: day = '星期三'; break;
    case 4: day = '星期四'; break;
    case 5: day = '星期五'; break;
    case 6: day = '星期六'; break;
  }
  return {
    month: date.getMonth() + 1,
    date: date.getDate(),
    day: day
  }
}
function setDate(date) {
  var dateEl1 = document.getElementById('date1')
  var dateEl2 = document.getElementById('date2')
  dateEl1.innerText = date.month + "月" + date.date + "日 " + date.day
  dateEl2.innerText = date.date
}
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }else{
    let now = new Date()
    let day = now.getDay()
    day = day>0?day:7
    let nowTime = now.getTime()
    let startDate = new Date(nowTime-24*(day+7)*60*60*1000)
    let endDate = new Date(nowTime-24*day*60*60*1000)
    let startFormat = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate()
    let endFormat = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate()
    window.location.href = config.webHost+"/morningPaper/index.html?startDate=" + startFormat + "&endDate=" + endFormat
  }
}
//今日热点
(function () {
  const startDate = getQueryString("startDate"),endDate = getQueryString("endDate")
  listSelectNews({ startDate, endDate}).then((rs)=>{
    if (rs.selectList.length > 0) {
      var topNews = rs.selectList.slice(0, 3)
      var moreNews = rs.selectList.slice(3)
      var wrapper = document.getElementById("swiper-wrapper")
      var title = document.getElementById("title-box")
      var titleList = []
      $('#previous-btn').attr('disabled', !rs.isPrevious).on('click',previous)
      $('#next-btn').attr('disabled', !rs.isNext).on('click',next)
      $('#toList-btn').on('click',toList)
      topNews.forEach(function (h, i) {
        var img = document.createElement('img')
        img.className = 'swiper-slide'
        img.src = h.picUrl
        img.addEventListener('click', function () {
          addSelectNewsViews({ id: h.id }).then(rs=>{
            window.location.href = h.url
          })
        }, false)
        wrapper.appendChild(img)

        var h4 = document.createElement('h4')
        h4.innerText = h.title
        if (i == 0) h4.className = "hover"
        title.appendChild(h4)
        titleList.push(h4)
        topNews[i].date = formatDate(new Date(h.addtime))
      })
      setDate(topNews[0].date)
      var mySwiper = new Swiper('.swiper-container', {
        observer: true,
        observeParents: true,
        autoHeight: true,
        autoplay: {
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        on: {
          slideChangeTransitionStart: function () {
            titleList.forEach(function (h) {
              h.className = ""
            })

            titleList[this.activeIndex].className = "hover"
            var date = topNews[this.activeIndex].date
            setDate(date)
          }
        }
      })
      titleList.forEach(function (h, i) {
        h.addEventListener('click', function () {
          mySwiper.slideTo(i)
        })
      })
      var investList = document.getElementById('investList')
      moreNews.forEach(function (h, i) {
        var li = document.createElement('li')
        li.addEventListener('click', function () {
          addSelectNewsViews({ id: h.id }).then(rs=>{
            window.location.href = h.url
          })
        }, false)
        li.innerHTML = `<a>
          <div class="sense_l">
            <p class="sense_t">${h.title}</p>
            <span class="cense_c">${h.views}人看过</span>
          </div>
          <img class="sense_r" src="${h.picUrl}"
            alt="${h.title}">
        </a>`
        investList.appendChild(li)
      })

      share(rs.selectList[0].picUrl, rs.ticket)
    } else {

    }
  })


})();