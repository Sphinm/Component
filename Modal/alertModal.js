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
        this.closeBtn = this.container.querySelector('.close_btn');

        this.initModal();
    }

    // 通过原型式继承会导致AlertModal.prototype.constructor === Modal，需要手动指回去
    AlertModal.prototype = Object.create(Modal.prototype);
    AlertModal.prototype.constructor = AlertModal;

    // 事件触发器
    _.extend(AlertModal.prototype, _.emitter);

    _.extend(AlertModal.prototype, {
       initModal: function () {
           // 触发alert弹窗
           this.on('alert', this.showMsg.bind(this));

           _.addEvent(this.closeBtn, 'click', this.hide.bind(this));
           _.addEvent(this.submitBtn, 'click', this.success.bind(this));
       },

        showMsg: function (msg) {
            this.alertMsg.innerHTML = msg;
            this.show();
        }
    });


        // 直接暴露到全局
        window.AlertModal = AlertModal;

})();