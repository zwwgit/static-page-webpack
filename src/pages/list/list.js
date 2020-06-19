import "../../js/head"
import share from "../../js/share_v2"
import "../../scss/reset.css"
import "../../scss/list.scss"
import {getSelectNewsListPager} from '../../js/api'

Array.prototype.myIndexOf = function (p, v) {
  var index = -1;
  for (var i = 0; i < this.length; i++) {
    if (this[i][0][p] == v) {
      index = i
      return index;
    }
  }
  return index;
}
var NewsList = (function () {
  var NewsListFunc = function () {
    this.page = 1
    this.list = []
  }
  NewsListFunc.prototype.init = function () {
    let _this = this
    getSelectNewsListPager().then(rs=>{
      _this.list = groupingByMonth(rs.list)
      _this.render()
      share('https://img1.nz86.com/upload/picture/system/20200323/logo.png', rs.ticket)
    })
  }
  NewsListFunc.prototype.render = function () {
    let _this = this
    const container = document.getElementById('list-outter')
    container.innerHTML = ''
    this.list.slice((this.page - 1) * 2, this.page * 2).forEach(function (item, index) {
      let p = document.createElement('p')
      p.className = 'date'
      p.innerText = item[0].date
      let ul = document.createElement('ul')
      ul.className = 'list-box'
      let html = '';
      item.forEach(function (h, i) {
        html += `<li><a href="${h.url}"><span class="stage">第${formatStage(h.stage)}期</span><span class="desc">${h.title}</span></a></li>`
      })
      ul.innerHTML = html
      container.appendChild(p)
      container.appendChild(ul)
    })
    this.appendPage()
  }
  NewsListFunc.prototype.appendPage = function () {
    let _this = this
    const pageList = document.getElementById('page-list')
    pageList.innerHTML = ''
    let next = document.createElement('a')
    next.innerText = '下一页'
    next.setAttribute('disabled', 'disabled')
    next.addEventListener('click', function () {
      _this.next()
    })
    let pre = document.createElement('a')
    pre.innerText = '上一页'
    pre.addEventListener('click', function () {
      _this.pre()
    })
    pageList.appendChild(pre)
    let length = Math.ceil(this.list.length / 2)
    let start = 1
    if(length>5){
      start = this.page>2?this.page<length-2? this.page-2:length-4:1
    }else{
      start=1
    }
    //let start = length>5?this.page > 2 ? this.page - 2 : 1:1
    let end = start + 4 <= length ? start + 4 :length
    for (let i = start; i <= end; i++) {
      let el = document.createElement('a')
      el.id = "page-" + i
      el.innerText = i
      if(i==this.page){
        el.className="current"
      }
      el.addEventListener('click',function(){
        console.log(i)
        _this.page=i
        _this.render()
      })
      pageList.appendChild(el)
    }
    pageList.appendChild(next)
  }
  NewsListFunc.prototype.next = function () {
    if (this.page < Math.ceil(this.list.length / 2)) {
      this.page++
      this.render()
    }
  }
  NewsListFunc.prototype.pre = function () {
    if (this.page > 1) {
      this.page--
      this.render()
    }
  }
  function groupingByMonth(list) {
    let result = []
    let stage = list.length
    list.forEach(function (h) {
      h.stage = stage--
      let date = new Date(h.addtime)
      const y = date.getFullYear()
      let m = date.getMonth() + 1
      const key = y + '年' + m + '月'
      let index = result.myIndexOf('date', key)
      if (index > -1) {
        h.date = key
        result[index].push(h)
      } else {
        h.date = key
        result.push([h])
      }
    })
    return result
  }
  function formatStage(s) {
    if (s < 10) {
      return '000' + s
    } else if (s < 100) {
      return '00' + s
    } else if (s < 1000) {
      return '0' + s
    } else {
      return s
    }
  }
  return NewsListFunc
})()
var newsList = new NewsList().init()