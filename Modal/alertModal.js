/**
 * 警告弹窗子组件
 * 继承通用父类弹窗组件
 * */
(function () {
    let html = `<div class="m-alertmodal">
		<span class="close_btn u-icon u-icon-close"></span>
		<div class="modal_tt">
			<strong>Alert Information</strong>
		</div>
		<div class="modal_ct">
			<p class="alert_msg"></p>
			<button class="u-btn u-btn-primary submit_btn">确定</button>
			<button class="u-btn u-btn-primary cancel_btn">取消</button>
		</div>
	</div>`;

    function AlertModal(option) {

        // 传入content
        this.content = html;

        // 借调构造函数实现继承
        Modal.call(this, option);

        // 缓存节点
        this.alertMsg = this.container.querySelector('.alert_msg');
        this.submitBtn = this.container.querySelector('.submit_btn');
        this.cancel = this.container.querySelector('.cancel_btn');
        this.closeBtn = this.container.querySelector('.close_btn');

        this.initModal();
    }

    // 通过原型式继承会不会有什么问题？
    // 原型式继承得到的对象和对象属性浅拷贝得到的对象完全一致，让我比较困惑，后者也属于继承吗？如果不是的话有什么区别呢？
    AlertModal.prototype = Object.create(Modal.prototype);
    console.log(AlertModal.prototype);
    console.log(_.extend(AlertModal.prototype, Modal.prototype));

    // 事件触发器
    _.extend(AlertModal.prototype, _.emitter);

    _.extend(AlertModal.prototype, {
       initModal: function () {
           // 触发alert弹窗
           this.on('alert', this.showMsg.bind(this));

           _.addEvent(this.closeBtn, 'click', this.hide.bind(this));
           _.addEvent(this.submitBtn, 'click', this.hide.bind(this));
           _.addEvent(this.cancel, 'click', this.hide.bind(this));
       },

        showMsg: function (msg) {
            this.alertMsg.innerHTML = msg;
            this.show();
        }
    });


        // 直接暴露到全局
        window.AlertModal = AlertModal;

})();