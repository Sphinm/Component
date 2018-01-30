/**
 * 通用弹窗组件，提供给其他业务弹窗继承使用
 * 这里只提供基本的边框样式和隐藏显示功能以及父容器
 *
 * 业务弹窗提供相应的内容(自定义)和功能
 * */

(function () {
    let html = `<div class="m-modal"></div>`;

    function Modal(option) {
        // 继承配置
        _.extend(this, option);
        // 缓存节点
        this.container = _.html2node(html);
        this.container.innerHTML = this.content || '';
        this.parent.appendChild(this.container);
    }

    _.extend(Modal.prototype, _.emitter);
    _.extend(Modal.prototype, {

        show: function () {
            _.delClassName(this.container, 'f-dn');
        },

        hide: function () {
            _.addClassName(this.container, 'f-dn');
            this.emit('hide');
        },

        success: function () {
            this.emit('success');
            this.hide();
        }

    });

        window.Modal = Modal;

})();