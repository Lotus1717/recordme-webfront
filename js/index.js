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
  deleteMark,
  login,
  signup
} from './model.js'

// 记录列表
// {
//   url: '', 
//   title: '',
//   tag: ['', ''],
//   recordList: [{markText: '', record: ''}]
// }
let recordList = []
// 用户信息
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
$('#login').on('click', e => {
  let name = $('#name').val()
  let password = $('#pw').val()
  let param = {name, password}
  login(param).then(res => {
    if(res.result){
      param.userId = res.data.userId
      user = param
      localStorage.setItem('recordme-info', JSON.stringify(param))
      controlShowUser()
    }else{
      $('#error_tip').css('display', 'block')
    }
  }).catch(e => {
    console.log(e)
  })
})

// 用户注册点击事件
$('#sign').on('click', e => {
  let name = $('#name').val()
  let password = $('#pw').val()
  let param = {name, password}
  signup(param).then(res => {
    if(res.result){
      param.userId = res.data.userId
      user = param
      localStorage.setItem('recordme-info', JSON.stringify(param))
      controlShowUser()
    }else{
      $('#error_tip').css('display', 'block')
    }
  }).catch(e => {
    console.log(e)
  })
})

// 导航栏注册按钮点击事件
$('#nav_signup').on('click', e => {
  $('#sign').css('display', 'inline-block')
  $('#login').css('display', 'none')
  $('#nav_entry').css('display', 'inline-block')
  $('#nav_signup').css('display', 'none')
  $('#pw').attr('type', 'text')
})

// 导航栏登录按钮点击事件
$('#nav_entry').on('click', e => {
  $('#login').css('display', 'inline-block')
  $('#sign').css('display', 'none')
  $('#nav_signup').css('display', 'inline-block')
  $('#nav_entry').css('display', 'none')
  $('#pw').attr('type', 'password')
})

// 导航栏退出按钮点击事件
$('#nav_exit').on('click', e => {
  user = null
  localStorage.setItem('recordme-info', '')
  controlShowUser()
})

// $('delete_mark').on('click', e => {
//   let target = e.target
//   let parent = target.parentNode
//   let param = {
//     data: {
//       markText: parent.innerText.splice(parent.innerText.length - 1, 1)
//     },
//     userId: user.userId
//   }
//   deleteMark(param)
// })

/** 
 * 渲染记录列表
 * @param [array] data [{"recordId":15,"recordName":"","recordUrl":"","markList":[{"markId":1,"markText":""}]}...]
 */
let recordListRender = (list) => {
  function fillMarkDom (marks) {
    let dom = ``
    marks.forEach(val => {
      dom += `<li class="mark-text" mark-id="${val.markId}">${val.markText}<span class="icon-delete" id="delete_mark">×</span></li>`
    })
    return dom
  }
  let dom = ``
  list.forEach(val => {
    dom += `<details class="record-detail" record-id="${val.recordId}">
              <summary class="record-header">
                <span class="record-title">${val.recordName}</span>
                <a class="record-link" href=${val.recordUrl} target="_blank">🔗</a>
                <span class="icon-delete">×</span>
                <div class="label-list">
                    <span class="label-item">标签：</span>
                    <span class="icon-add-label">＋</span>
                </div>
              </summary>   
              <ol class="record-ol">
                ${fillMarkDom(val.markList)}
              </ol>
            </details>`
  })
  $('#content').html(dom)
}

// 控制是否显示登录页面
let controlShowUser = () => {
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
    initPageRecords()
  }
}

// 初始化获取记录列表
let initPageRecords = () => {
  if(user){
    queryPageRecords({userId: user.userId}).then(res => {
      if (res.result) {
        recordListRender(res.data)
      }
    })
  }
}

controlShowUser()
initPageRecords()
