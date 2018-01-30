/**
 * 登录弹窗有一个title，内容区有两个input表单
 * 右上角和底部的button
 * 之前项目里并没有用继承的方式去实现，现在通过继承来做一次
 * */

(function () {
    let html = `<div class="modal-cnt">
                   <div class="modal-tt">
                        <strong>欢迎回来 </strong>
                        <i class="modal-cancel"></i>
                        <span>还没有账号？ <a class="u-link" id="goregister">立即注册</a></span>
                    </div>
                    <form class="m-form">
                        <div class="u-formitem"><input id="username" type="text" autocomplete="off" placeholder="手机号" class="u-input"> </div>
                        <div class="u-formitem u-formitem1"><input id="password" autocomplete="off" type="password" placeholder="密码" class="u-input"> </div>
                        <div class="u-formitem u-formitem2">
                            <div class="u-check">
                                <input type="checkbox" id="remember" class="u-checkbox">
                                <label for="remember"></label>
                                <span class="keep-login">保持登录</span>
                            </div>
                            <span class="f-forget"><a class="u-link">忘记密码？</a></span>
                        </div>
                        <div class="u-error f-dn">
                            <span class="u-icon-error"></span>
                            <span class="errorMsg"></span>
                        </div>
                        <button class="u-btn-primary" type="submit">登&nbsp;&nbsp;录</button>
                    </form>
                </div>`;


    function LoginModal(options) {
        // 传入登录弹窗内容
        this.content = html;
        
        Modal.call(this, options);
    }
})();