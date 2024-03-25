/**
 * @desc 上传文件
 * @params image_file[] 文件file
 * @params type  上传类型
 */
export function uploadMedia(data, config = { headers: { 'Content-Type': 'multipart/form-data' } }) {
  return request.post('/user/uploadmedia', data, config)
}
