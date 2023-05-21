export function fileSizeFormat(bytes: number): string {
  if (bytes === 0) return '-'
  if (bytes === -1) return '未知'
  let k = 1024
  let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}

export function isMobile(): boolean {
  let flag = !!navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  return flag || window.innerWidth < 768
}

export function dateFormat(time: number | string): string {
  if (!time) {
    return time.toString()
  }
  let date = new Date(time)
  let year = date.getFullYear()
  let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
  let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
  let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
  return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
}