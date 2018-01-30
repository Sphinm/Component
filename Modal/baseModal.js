/**
 * 通用弹窗组件，提供给其他业务弹窗继承使用
 * 这里只提供基本的边框样式和隐藏显示功能
 *
 * 业务弹窗提供父容器以及相应的内容(自定义)
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

    _.extend(Modal.prototype, {

        show: function () {
            _.delClassName(this.container, 'f-dn')
        },

        hide: function () {
            _.addClassName(this.container, 'f-dn')
        }

    });

        window.Modal = Modal;

})();