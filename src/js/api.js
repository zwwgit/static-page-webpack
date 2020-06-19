
import config from "./config"
export const listSelectNews = function(params){
  return $.get(config.apiHost+'/info/news/listSelectNews.shtml',params)
}
export const addSelectNewsViews = function(params){
  return $.get(config.apiHost+'/info/news/addSelectNewsViews.shtml',params)
}
export const getSelectNewsListPager = function(parsms){
  return $.get(config.apiHost+'/info/news/getSelectNewsListPager.shtml',parsms)
}