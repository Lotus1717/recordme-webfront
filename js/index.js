/**
 * index-script
 * 
 * 概述：管理网页记录
 * 
 * 功能：点击浏览器插件图标，可以查看新建的笔记(√)，打标记，或删除网页记录
 * 
 * @author Qiutm 2018-10-26 10:31:02
 * @version 1.0.0
 */

console.log('index script')

import {
  queryPageRecords,
  updateRecordList,
  updateRecordTags,
  deleteMark,
  deleteRecord,
  login,
  signup
} from './model.js'

// 记录列表
// [{
//   "recordId": 0,
//   "recordName": "",
//   "recordUrl": "",
//   "markList": [{
//     "markId": 0,
//     "markText": ""
//   }],
//   "tagList": [{
//     "tagId": 0,
//     "tagName": ""
//   }]
// }]
let recordList = []
// 用户信息
// {"name":"","password":"","userId":1}
let user

// document.getElementById('save_record').addEventListener('click', e => {
//   // 如果没有用户信息，则直接返回
//   if(!user){
//     return
//   }
//   let param = {
//     data: recordList,
//     userId: user.userId
//   }
//   updateRecordList(param)
//   let target = e.target
//   target.style.filter = 'opacity(1)'
// })

// 用户登录点击事件
$(document).on('click', '#login', () => {
    let name = $('#name').val()
    let password = $('#pw').val()
    let param = {
      name,
      password
    }
    login(param).then(res => {
      if (res.result) {
        param.userId = res.data.userId
        user = param
        localStorage.setItem('recordme-info', JSON.stringify(param))
        init()
      } else {
        $('#error_tip').css('display', 'block')
      }
    }).catch(e => {
      console.log(e)
    })
  })

  // 用户注册点击事件
  .on('click', '#sign', () => {
    let name = $('#name').val()
    let password = $('#pw').val()
    let param = {
      name,
      password
    }
    signup(param).then(res => {
      if (res.result) {
        param.userId = res.data.userId
        user = param
        localStorage.setItem('recordme-info', JSON.stringify(param))
        init()
      } else {
        $('#error_tip').css('display', 'block')
      }
    }).catch(e => {
      console.log(e)
    })
  })

  // 导航栏注册按钮点击事件
  .on('click', '#nav_signup', () => {
    $('#sign').css('display', 'inline-block')
    $('#login').css('display', 'none')
    $('#nav_entry').css('display', 'inline-block')
    $('#nav_signup').css('display', 'none')
    $('#pw').attr('type', 'text')
  })

  // 导航栏登录按钮点击事件
  .on('click', '#nav_entry', () => {
    $('#login').css('display', 'inline-block')
    $('#sign').css('display', 'none')
    $('#nav_signup').css('display', 'inline-block')
    $('#nav_entry').css('display', 'none')
    $('#pw').attr('type', 'password')
  })

  // 导航栏退出按钮点击事件
  .on('click', '#nav_exit', () => {
    user = null
    localStorage.removeItem('recordme-info')
    init()
  })

  // 删除标注
  .on('click', '.delete-mark', (e) => {
    let $mark = $(e.target).parent()
    let param = {
      data: {
        markId: $mark.attr('mark-id'),
        recordId: $mark.parents('record-detail').attr('record-id')
      },
      userId: user.userId
    }
    deleteMark(param).then(res => {
      if (res.result) {
        $mark.remove()
      }
    })
  })

  // 删除记录
  .on('click', '.delete-record', (e) => {
    let $record = $(e.target).parent().parent()
    let param = {
      data: {
        recordId: $record.attr('record-id')
      },
      userId: user.userId
    }
    deleteRecord(param).then(res => {
      if (res.result) {
        $record.remove()
      }
    })
  })

  // 编辑标签
  .on('click', '.edit-tag', (e) => {
    e.preventDefault()
    let $wrapper = $(e.target).parent()
    let $tags = $wrapper.children('.tag')
    let tags = []
    $tags.each((i, t) => {
      tags.push($(t).text())
    })
    let dom = `<input value="${tags.join(' ')}" class="input-text input-edit-tag"/>              
              <span class="cancel-edit-tag">no</span>
              <span class="save-tag">ok</span>`
    $wrapper.html(dom)
    $wrapper.find('.input-edit-tag').focus()
  })

  // 保存编辑的标签信息
  .on('click', '.save-tag', (e) => {
    e.preventDefault()
    let $input = $(e.target).prev().prev()
    let $wrapper = $(e.target).parent()
    let $record = $input.parents('.record-detail')
    let value = $input.val().trim()
    let recordId = parseInt($record.attr('record-id'))
    let arr = recordList.filter(val => val.recordId === recordId)
    if (arr.length) {
      if (arr[0].tagList.length === 0 && value === '') {
        return
      }
    }
    let tags = value.split(/\s+/)
    let param = {
      data: {
        tags: tags,
        recordId: parseInt($record.attr('record-id'))
      },
      userId: user.userId
    }
    updateRecordTags(param).then(res => {
      if (res.result) {       
        recordList.forEach(val => {
          if(val.recordId === recordId){
            val.tagList = res.data
          }
        })
        let dom = ``
        res.data.forEach(val => {
          dom += `<span class="tag" tag-id="${val.tagId}">${val.tagName}</span>`
        })
        dom += '<img src="../img/icon-edit-active.png" class="icon-edit-label edit-tag"/>'
        $wrapper.html(dom)
      }
    })
  })

  // 取消编辑标签信息
  .on('click', '.cancel-edit-tag', (e) => {
    e.preventDefault()
    let $wrapper = $(e.target).parent()
    let recordId = $(e.target).parents('.record-detail').attr('record-id')
    let arr = recordList.filter(val => val.recordId === parseInt(recordId))
    let tags = arr.length > 0 ? arr[0].tagList : []
    let dom = ``
    tags.forEach(val => {
      dom += `<span class="tag" tag-id="${val.tagId}">${val.tagName}</span>`
    })
    dom += '<img src="../img/icon-edit-active.png" class="icon-edit-label edit-tag"/>'
    $wrapper.html(dom)
  })

const fillTagDom = (tags) => {
  let dom = ``
  if(tags){
    tags.forEach(val => {
      dom += `<span class="tag" tag-id="${val.tagId}">${val.tagName}</span>`
    })
  } 
  return dom
}

/** 
 * 渲染记录列表
 * @param [array] data [{"recordId":15,"recordName":"","recordUrl":"","markList":[{"markId":1,"markText":""}]}...]
 */
const recordListRender = (list) => {
  function fillMarkDom(marks) {
    let dom = ``
    marks.forEach(val => {
      dom += `<li class="mark-text" mark-id="${val.markId}">${val.markText}<span class="icon-delete delete-mark">×</span></li>`
    })
    if (marks.length === 0) {
      dom = '<div class="nothing">没有标注哦( ･´ω`･ )</div>'
    }
    return dom
  }
  let dom = ``
  list.forEach(val => {
    dom += `<details class="record-detail" record-id="${val.recordId}">
              <summary class="record-header">
                <span class="record-title">${val.recordName}</span>
                <a class="record-link" href=${val.recordUrl} target="_blank">🔗</a>
                <span class="icon-delete delete-record">×</span>
                <div class="label-list">
                    <img src="../img/icon-tag.png" class="icon-tag"/>
                    <div class="label-list-content">
                      ${fillTagDom(val.tagList)}
                      <img src="../img/icon-edit-active.png" class="icon-edit-label edit-tag"/>
                    </div>                 
                </div>
              </summary>   
              <ol class="record-ol">
                ${fillMarkDom(val.markList)}
              </ol>
            </details>`
  })
  if (list.length === 0) {
    dom = '<div class="nothing">没有记录哦( ･´ω`･ )</div>'
  }
  $('#content').html(dom)
}

// 初始化 -- 1.控制用户登录页面显示和登录，注册，退出按钮的显示隐藏；2.获取记录
const init = () => {
  let userInfo = localStorage.getItem('recordme-info')
  if (userInfo) {
    user = JSON.parse(userInfo)
  }
  if (!user) {
    $('#content').css('display', 'none')
    $('#nav_signup').css('display', 'inline-block')
    $('#nav_exit').css('display', 'none')
    $('#login_wrap').css('display', 'block')
    $('#user_name').html('')
  } else {
    $('#content').css('display', 'block')
    $('#nav_signup').css('display', 'none')
    $('#nav_entry').css('display', 'none')
    $('#nav_exit').css('display', 'inline-block')
    $('#login_wrap').css('display', 'none')
    $('#user_name').html(user.name + '的摘抄本')
    fetchPageRecords()
  }
}

// 初始化获取记录列表
const fetchPageRecords = () => {
  if (user) {
    queryPageRecords({
      userId: user.userId
    }).then(res => {
      if (res.result) {
        recordList = res.data
        recordListRender(res.data)
      }
    })
  }
}

// 初始化
init()