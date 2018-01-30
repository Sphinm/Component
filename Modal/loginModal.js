/**
 * 登录弹窗有一个title = '欢迎回来'，
 * 右上角和底部的button , 右上角需要一些文字比如'还没有账号需要立即注册'
 * 内容区有三个input表单, 最后一个做保持登录勾选框，忘记密码暂时不实现
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

        // 缓存节点
        this.userName = this.container.querySelector('#username');
        this.password = this.container.querySelector('#password');
        this.logins = document.querySelector('.m-login');
        this.registers = document.querySelector('.m-register');
        this.loginInfo = document.querySelector('.m-login-info');
        this.close = this.container.querySelector('.modal-tt .modal-cancel');
        this.submit = this.container.querySelector('.u-btn-primary');
        this.remember = this.container.querySelector('.u-checkbox');
        this.ErrorParent = this.container.querySelector('.u-error');
        this.nError = this.container.querySelector('.errorMsg');
        this.goregister = this.container.querySelector('#goregister');

        // 初始化登录弹窗
        this.initLoginEvent();
    }

    // 继承父类Modal的原型
    LoginModal.prototype = Object.create(Modal.prototype);
    LoginModal.prototype.constructor = LoginModal;

    // 事件发射器
    _.extend(LoginModal.prototype, _.emitter);

    _.extend(LoginModal.prototype,{
        // 初始化登录弹窗组件并绑定事件
        initLoginEvent: function () {
            this.on('showLoginModal', this.show.bind(this));

            _.addEvent(this.close, 'click', this.hide.bind(this));
            _.addEvent(this.goregister, 'click', function(){
                this.hide();
                // 此处不实现真实的注册弹窗
                this.emit('showRegisterModal');
            }.bind(this));
            _.addEvent(this.submit, 'click', this._submit.bind(this));
        },

        // 检查用户名和密码是否为空以及长度判断
        check: function () {
            let isValid = true,
                flag = true;

            // 验证用户名
            flag = _.isPhone(this.userName.value) && flag;
            flag = !_.isNotEmpty(this.userName.value) && flag;
            flag ? _.delClassName(this.userName, 'error') : _.addClassName(this.userName, 'error');
            isValid = isValid && flag;

            // 验证密码
            flag = true;
            flag = !_.isNotEmpty(this.password.value) && flag;
            flag = _.pwdLength(this.password.value) && flag;
            flag ? _.delClassName(this.password, 'error') : _.addClassName(this.password, 'error');
            isValid = isValid && flag;

            isValid || (this.nError.innerText = '账号或密码错误，请输入正确密码~');

            this.showError();

            isValid ? _.addClassName(this.ErrorParent, 'f-dn'): this.showError();

            return isValid;
        },

        showError: function () {
            _.delClassName(this.ErrorParent, 'f-dn');
        },

        // 提交用户信息前先阻止默认事件
        // 检查cookie状态，并设置选中‘保持登录’的失效时间
        _submit: function (event) {
            let that = this;
            event.preventDefault();

            let user = {
                username: that.userName.value.trim(),
                password: hex_md5(that.password.value),
                remember: !!that.remember.checked
            };

            // 这里不做真实登录，仅做一下演示
            if (that.check()) {
                console.log(user);
                that.emit('showLoginModal');
                that.hide();
                // _.ajax({
                //     url: '/api/login',
                //     method: 'POST',
                //     data: user,
                //     success: function (data) {
                //         let dataOrz = JSON.parse(data);
                //         console.log(data)
                //         if (dataOrz.code === 200) {
                //             that.hide();
                //             that.emit('login', data.result);
                //             that.lastSuc();
                //             _.setCookie('loginSuc', 'loginSuc');
                //         } else {
                //             that.hide();
                //         }
                //     },
                //     fail: function () {}
                // })
            }
        }

    });

    window.LoginModal = LoginModal;
})();