/**
 * 轮播图组件
 * 添加轮播图需要添加img和cursor，可否只添加img
 * 根据图片的数量设定指示器节点的数量是否合理？
 * 如果需要很多图做轮播呢？
 *
 * */

(function(){

    var template =
        `<div class="m-slider" >
          <div class="slide"></div>
          <div class="slide"></div>
          <div class="slide"></div>
        </div>`;


    function Slider(opt){
        _.extend(this, opt);

        // 容器节点，如果没有传入container，默认为body节点，
        // 强制设置视口hidden样式
        this.container =  this.container || document.body;
        this.container.style.overflow = 'hidden';

        // 组件节点，并转换为数组
        this.slider = this._layout.cloneNode(true);
        this.slides = [].slice.call(this.slider.querySelectorAll('.slide'));

        // 根据节点显示当前图片的数量
        this.showNum = this.slides.length;

        // 拖拽相关
        this.offsetWidth = this.container.offsetWidth;
        this.breakPoint = this.offsetWidth / this.showNum;


        // 内部数据结构
        // pageIndex[0~pageNum]: 当前图片下标
        // slideIndex[0~2]: slide下标
        // offsetAll: 容器(.m-slide)的偏移下标
        this.slideIndex = 1;
        this.pageIndex = this.pageIndex || 0;
        this.offsetAll = this.pageIndex;

        // 把dom节点渲染到HTML
        this.container.appendChild(this.slider);



        // 轮播项数量
        this.pageNum =  this.images? this.images.length : this.showNum;

        // 动画设置
        this.fadeTime = this.fadeTime || 500;

        // 响应鼠标移动上去暂停轮播事件移出后重新计时
        // 根据需要手动设定
        if(this.auto) {
            this.intervalTime = this.intervalTime || 5000;
            this._initAuto();
        }

        // 如果需要拖拽切换，根据需要手动设定
        if(this.drag) this._initDrag();
    }

    // 事件发射器
    _.extend( Slider.prototype, _.emitter);

    _.extend( Slider.prototype, {

        _layout: _.html2node(template),

        // 直接跳转到指定页
        nav: function(pageIndex){
            this.pageIndex = pageIndex;
            this.slideIndex = typeof this.slideIndex === 'number'? this.slideIndex: (pageIndex+1) % this.showNum;
            this.offsetAll = pageIndex;
            this.slider.style.transitionDuration = '0s';
            this._calcSlide();
        },

        // 下一页
        next: function(){
            this._step(1);
        },
        // 上一页
        prev: function(){
            this._step(-1);
        },
        // 单步移动
        _step: function(offset){
            this.offsetAll += offset;
            this.pageIndex += offset;
            this.slideIndex +=offset;
            this.slider.style.transitionDuration = '0.5s';
            this._calcSlide();
        },
        // 执行Slide
        // 每个slide的left = (offsetAll + offset(1, -1)) * 100%;
        // 外层容器 (.m-slider) 的偏移 = offsetAll * 宽度
        _calcSlide: function(){
            var showNum = this.showNum;
            var pageIndex = this.pageIndex= this._normIndex(this.pageIndex, this.pageNum);
            var slideIndex = this.slideIndex= this._normIndex(this.slideIndex, this.showNum);
            var prevslideIndex = this._normIndex(this.slideIndex-1,showNum);
            var nextslideIndex = this._normIndex(this.slideIndex+1,showNum);
            var offsetAll = this.offsetAll;
            var slides = this.slides;

            // 三个slide的偏移
            slides[slideIndex].style.left = (offsetAll) * 100 + '%';
            slides[prevslideIndex].style.left = (offsetAll-1) * 100 + '%';
            slides[nextslideIndex].style.left = (offsetAll+1) * 100 + '%';

            // 设置动画
            this._fadeIn(slides[slideIndex]);

            // 容器偏移
            // translateZ(0) 触发硬件加速
            this.slider.style.transform = 'translateX('+ (-offsetAll * 100)+'%) translateZ(0)';

            // 当前slide 添加 'z-active'的className
            slides.forEach(function(node){ _.delClassName(node, 'z-active') });
            _.addClassName(slides[slideIndex], 'z-active');

            // 图片url处理
            this._onNav(this.pageIndex, this.slideIndex);
        },

        // 淡入效果
        _fadeIn: function(ele) {
            var stepLength = 1/50;
            var setIntervalId = setInterval(step, this.fadeTime/100);
            if (parseFloat(ele.style.opacity)) {
                ele.style.opacity = 0;
            }
            function step() {
                if (parseFloat(ele.style.opacity)+stepLength < 1) {
                    ele.style.opacity = parseFloat(ele.style.opacity)+stepLength;
                } else {
                    ele.style.opacity = 1;
                    clearInterval(setIntervalId);
                }
            }
        },

        // index标准化下标
        _normIndex: function(index, len){
            return (len + index) % len
        },

        // 跳转时完成的逻辑，这里是设置图片的url
        _onNav: function(pageIndex, slideIndex){
            var slides = this.slides;

            // 图片下标和slide下标由0开始
            for(var i =-1; i<= this.showNum-1; i++){
                var index = this._normIndex((slideIndex+i), this.showNum);
                var img = slides[index].querySelector('img');
                if(!img){
                    img = document.createElement('img');
                    slides[index].appendChild(img);
                }

                img.src = '../img/banner' + (this._normIndex(pageIndex + i, this.pageNum) + 1)  + '.jpg';
            }

            // 触发nav事件
            this.emit('nav', {
                pageIndex: pageIndex,
                slideIndex: slideIndex
            })

        },

        // 点击事件和鼠标移入时候停止计时，移出传送带再开始计时
        _initAuto: function() {
            this.timmer = null;
            this.autoStart();
            _.addEvent(this.container, 'click', this._autoEnd.bind(this));
            _.addEvent(this.slider, 'mouseenter', this._autoEnd.bind(this));
            _.addEvent(this.slider, 'mouseleave', this._autoStart.bind(this));
        },

        _autoStart: function() {
            var time = this.intervalTime;
            // 为防止也越来越快，在重复调用时，先清除
            clearInterval(this.timmer);
            this.timmer = setInterval(this._step.bind(this, 1), time);
        },

        _autoEnd: function() {
            var timmer = this.timmer;
            if(!timmer) return;
            clearInterval(this.timmer);
        },

        // 自动轮播
        autoStart: function(time) {
            this.intervalTime = time || this.intervalTime;
            this._autoStart();
        },

        // 拖拽
        _initDrag: function(){
            this._dragInfo = {};
            _.addEvent(this.slider, 'mousedown', this._dragstart.bind(this));
            _.addEvent(this.slider, 'mousemove', this._dragmove.bind(this));
            _.addEvent(this.slider, 'mouseup', this._dragend.bind(this));
            _.addEvent(this.slider, 'mouseleave', this._dragend.bind(this));
        },

        // 阻止默认事件是为了防止拖出视口容器
        // 记录初始坐标，transitionDuration设置为0s
        _dragstart: function(ev){
            var dragInfo = this._dragInfo;
            dragInfo.start = {x: ev.pageX, y: ev.pageY};
            ev.preventDefault();
        },

        _dragmove: function(ev){
            var dragInfo = this._dragInfo;
            // 如果还没有开始拖拽则退出
            if(!dragInfo.start) return;
            ev.preventDefault();
            this.slider.style.transitionDuration = '0s';

            // 清除恼人的选区
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            } else if (window.document.selection) {
                window.document.selection.empty();
            }

            var start = dragInfo.start;
            // 加translateZ 分量是为了触发硬件加速
            this.slider.style.transform =
                'translateX(' +  (-(this.offsetWidth * this.offsetAll - ev.pageX+start.x)) + 'px) translateZ(0)'
        },

        // 通过步长判断图片是否翻页
        _dragend: function( ev ){
            var dragInfo = this._dragInfo;
            if(!dragInfo.start) return;

            ev.preventDefault();
            var start = dragInfo.start;
            this._dragInfo = {};
            var pageX = ev.pageX;

            // 看走了多少距离
            var deltX = pageX - start.x;
            if( Math.abs(deltX) > this.breakPoint ){
                this._step(deltX>0? -1: 1)
            }else{
                this._step(0)
            }
        }
    });

    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global

    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = Slider;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return Slider
        });
    } else {
        // 直接暴露到全局
        window.Slider = Slider;
    }

}());
