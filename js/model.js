console.log('model-script')

const updateRecordList = (data) => {
  let url = 'RecordServer/updateRecord'
  return axios.post(url, data).then(res => {
    return res.data
  })
}

const deleteMark = (data) => {
  let url = 'RecordServer/deleteMark'
  return axios.post(url, data).then(res => {
    return res.data
  })
}

const deleteRecord = (data) => {
  let url = 'RecordServer/deleteRecord'
  return axios.post(url, data).then(res => {
    return res.data
  })
}

const queryPageRecords = (data) => {
  let url = 'RecordServer/queryPageRecords'
  return axios.post(url, data).then(res => {
    return res.data
  })
}

const login = (data) => {
  let url = 'UserServer/login'
  return axios.post(url, data).then(res => {
    return res.data
  })
}

const signup = (data) => {
  let url = 'UserServer/signup'
  return axios.post(url, data).then(res => {
    return res.data
  })
}

const updateRecordTags = (data) => {
  let url = 'RecordServer/updateRecordTags'
  return axios.post(url, data).then(res => {
    return res.data
  })
}

export {
  queryPageRecords,
  updateRecordList,
  deleteMark,
  deleteRecord,
  login,
  signup,
  updateRecordTags
}