const cloud = require('wx-server-sdk')
cloud.init({
  env:cloud.DYNAMIC_CURRENT_ENV
})
exports.main = async(event,context)=>{
    console.log(event);
    console.log(context);
    const WXcontext = cloud.getWXContext();
    return{
      event,
      openid:WXcontext.OPENID,
      appid:WXcontext.APPID,
      unionid:WXcontext.UNIONID,
      env:WXcontext.ENV
    }
}