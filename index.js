// 等所有DOM对象都加载完毕后，再执行
window.onload = function () {

    var imgIndex = 0;

    //为了防止变量互相污染，将每一个功能都放到一个函数中，再对函数进行调用

    //1、路径导航的数据渲染
    function navPathDataBind() {
        let navPath = document.getElementById('navPath');   //获取DOM元素对象

        //获取数据
        let path = goodData.path;   //此时path为一个数组

        //遍历数据
        for (let i = 0; i < path.length; i++) {
            if (i === path.length - 1) {
                let aNode = document.createElement('a');
                aNode.innerText = path[i].title;
                navPath.appendChild(aNode);
            } else {
                let aNode = document.createElement('a');
                aNode.href = path[i].url;
                aNode.innerText = path[i].title;

                let iNode = document.createElement('i');
                iNode.innerText = '/';

                navPath.appendChild(aNode);
                navPath.appendChild(iNode);
            }
        }
    }

    /* -------------------------------------------------------------------------*/
    //2、放大镜的移入、移出效果
    function bigClassBind() {
        //获取小图框DOM元素对象
        let smallPic = document.getElementById('smallPic');
        //获取leftTop元素
        let leftTop = document.getElementById('leftTop');

        //从data.js中获取图片数据
        let imagessrc = goodData.imagessrc;

        //设置鼠标移入事件
        smallPic.onmouseenter = function () {
            //动态创建蒙版元素及大图框和大图片元素
            let maskDiv = document.createElement('div');
            maskDiv.className = 'mask';

            let bigPic = document.createElement('div');
            bigPic.id = 'bigPic';

            let bigImg = document.createElement('img');
            bigImg.src = imagessrc[imgIndex].b;

            bigPic.appendChild(bigImg);
            smallPic.appendChild(maskDiv);
            leftTop.appendChild(bigPic);

            //鼠标移入后，若鼠标移出，则嵌套着在移入事件内写移出事件，移出后，取消大图框
            smallPic.onmouseleave = function () {
                //小图框内移除蒙版元素
                smallPic.removeChild(maskDiv);
                //在leftTop内移除大图框
                leftTop.removeChild(bigPic);
            }


            //鼠标移入后，蒙版元素的拖拽效果
            smallPic.onmousemove = function (event) {
                //计算出蒙版元素左边框距离小图框左边框的距离：
                //event.clientX为鼠标点距离浏览器左侧的值
                //smallPic.getBoundingClientRect().left是小图框元素距离浏览器左侧的值
                //maskDiv.offsetWidth / 2 是蒙版元素占位宽度的一半
                let left = event.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetWidth / 2;

                //同理：得到蒙版元素上边框距离小图框上边框的距离
                let top = event.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetHeight / 2;

                //确保蒙版元素不会离开小图框
                if (left < 0) {
                    left = 0;
                } else if (left > smallPic.clientWidth - maskDiv.offsetWidth) {
                    left = smallPic.clientWidth - maskDiv.offsetWidth;
                }
                if (top < 0) {
                    top = 0;
                } else if (top > smallPic.clientHeight - maskDiv.offsetHeight) {
                    top = smallPic.clientHeight - maskDiv.offsetHeight;
                }
                maskDiv.style.left = left + "px";
                maskDiv.style.top = top + "px";

                //蒙版元素与大图片比例关系 = 蒙版元素移动的距离 / 大图片元素移动的距离
                //蒙版元素移动的距离 = 小图框宽度 - 蒙版元素的宽度
                //大图片元素移动的距离 =  大图片宽度 - 大图框元素的宽度
                let scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (bigImg.offsetWidth - bigPic.clientWidth)
                bigImg.style.left = - left / scale + "px";
                bigImg.style.top = - top / scale + "px";
            }

        }
    }

    /* -------------------------------------------------------------------------*/
    //3、动态渲染产品缩略图的数据
    function thumbnailData() {
        //拿到页面的ul标签的DOM元素
        let ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #picList ul')

        //获取到图片数据（此处是从data.js中拿数据）
        let imagessrc = goodData.imagessrc;  //结果为一个数组，每一个元素都是一个对象

        //遍历数组，动态创建元素
        for (let i = 0; i < imagessrc.length; i++) {
            let newLi = document.createElement('li');
            let newImg = document.createElement('img');
            newImg.src = imagessrc[i].s;

            newLi.appendChild(newImg);
            ul.appendChild(newLi);
        }


    }

    /* -------------------------------------------------------------------------*/
    //4、点击缩略图，从而更新产品图片和大图片的效果
    function thumbnailClick() {
        //获取所有li元素，为其绑定单击响应事件
        let liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #picList ul li');

        //获取所有产品图片的img元素
        let smallPic_img = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic img');

        //从data.js中获取图片数据
        let imagessrc = goodData.imagessrc;

        for (let i = 0; i < liNodes.length; i++) {
            liNodes[i].onclick = function () {

                //大图片的初始路径放在另一个函数bigClassBind()中，这里牵扯到跨函数传递
                //我们可以在全局作用域声明一个变量，记录当前点击的缩略图的下标

                imgIndex = i;   //将当前点击的下标传递给全局变量imgIndex，从而使函数bigClassBind()也能获取到当前索引

                //对应更改产品图片路径
                smallPic_img.src = imagessrc[i].s
            }
        }
    }

    /* -------------------------------------------------------------------------*/
    //5、点击缩略图左右箭头，实现缩略图滑动的效果
    function thumbnailLeftRightClick() {
        //获取左右两端箭头按钮
        let prev = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.prev');
        let next = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.next');

        //获取ul元素
        let ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #picList ul')
        //获取所有li元素
        let liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #picList ul li');

        //计算：每点击一次箭头，图片向右/左走两张：相当于两张的图片大小 + 每个右边的20px的margin
        let start = 0;  //发生起点
        let step = (liNodes[0].offsetWidth + 20) * 2;

        //总体能移动的距离 = ul的宽度 - div的宽度
        let endPosition = (liNodes.length - 5) * (liNodes[0].offsetWidth + 20);

        //为左箭头绑定单击响应事件
        prev.onclick = function () {
            start -= step;
            if (start < 0) {
                start = 0;
            }
            ul.style.left = -start + 'px';
        }

        //为右箭头绑定单击响应事件
        next.onclick = function () {
            start += step;
            if (start > endPosition) {
                start = endPosition;
            }
            ul.style.left = -start + 'px';
        }

    }

    /* -------------------------------------------------------------------------*/
    //6、商品详情数据的动态渲染
    function rightTopData() {
        //获取rightTop元素对象
        let rightTop = document.querySelector('#wrapper #content .contentMain #center #right .rightTop')

        //获取数据（数据在data.js中）
        let goodsDetail = goodData.goodsDetail;

        //创建一个字符串变量(模板字符串)，用于在rightTop元素对象中添加内容
        //在模板字符串内替换数据
        let s = `
            <h3>${goodsDetail.title}</h3>
            <p>${goodsDetail.recommend}</p> 

            <div class="priceWrap">
                <div class="priceTop">
                    <span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
                    <div class="price">
                        <span>¥</span>
                        <p>${goodsDetail.price}</p>
                        <i>降价通知</i>
                    </div>
                    <p>
                        <span>累计评价</span>
                        <span>${goodsDetail.evaluateNum}</span>
                    </p>
                </div>
                <div class="priceBottom">
                    <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
                    <p>
                        <span>${goodsDetail.promoteSales.type}</span>
                        <span>${goodsDetail.promoteSales.content}</span>
                    </p>
                </div>
            </div>
                            
            <div class="support">
                <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
                <p>${goodsDetail.support}</p>
            </div>

            <div class="address">
                <span>配&nbsp;送&nbsp;至</span>
                <p>${goodsDetail.address}</p>
            </div>
        `;

        //重新渲染rightTop元素对象
        rightTop.innerHTML = s;
    }

    /* -------------------------------------------------------------------------*/
    //7、商品选择参数数据的动态渲染
    function rightBottomeData() {
        //获取chooseWrap类的元素对象（用于在里面动态添加元素）
        let chooseWrap = document.querySelector('#wrapper #content .contentMain #center #right .rightBottom .chooseWrap');
        //获取数据
        let crumbData = goodData.goodsDetail.crumbData;

        //拿到的数据是一个数组，进行遍历，每遍历到一个元素，就动态生成一个dl对象（包含dt和dd）
        for (let i = 0; i < crumbData.length; i++) {
            let dlNode = document.createElement('dl');
            let dtNode = document.createElement('dt');
            dtNode.innerText = crumbData[i].title;

            dlNode.appendChild(dtNode);

            //遍历crumbData数组中每一个对象元素内的data属性的数组
            for (let j = 0; j < crumbData[i].data.length; j++) {
                let ddNode = document.createElement('dd');
                ddNode.innerText = crumbData[i].data[j].type
                ddNode.setAttribute('price', crumbData[i].data[j].changePrice);
                dlNode.appendChild(ddNode);
            }

            chooseWrap.appendChild(dlNode);
        }
    }

    /* -------------------------------------------------------------------------*/
    //8、点击商品参数之后，颜色的排他效果，同时将点击的商品参数显示到参数结果中,并且实现将商品参数从结果中删除
    function clickddBind() {
        //拿到所有的dl元素，用于后续遍历
        let dlNodes = document.querySelectorAll('#wrapper #content .contentMain #center #right .rightBottom .chooseWrap dl');

        //创建一个数组，用于承装选中的所有参数（默认数组的内容都为0）
        let arr = new Array(dlNodes.length)   //数组长度为dl元素的个数
        arr.fill(0)   //数组的索引对应着dl元素的索引

        //获取chooseResult元素，用于添加元素结果
        let chooseResult = document.querySelector('#wrapper #content .contentMain #center #right .rightBottom .chooseResult');

        //-----------------------------------------
        //遍历dlNodes，拿到每一个dl标签对象
        for (let i = 0; i < dlNodes.length; i++) {
            //拿到某个dl元素内的所有dd元素
            let ddNodes = dlNodes[i].querySelectorAll('dd');

            //遍历该dl元素内所有的dd元素，为每一个dd元素添加点击事件
            for (let j = 0; j < ddNodes.length; j++) {

                //----------------为dd绑定单击事件--------------
                ddNodes[j].onclick = function () {
                    //先将当前dl元素内所有的dd元素的字体重置为#666颜色
                    for (let k = 0; k < ddNodes.length; k++) {
                        ddNodes[k].style.color = '#666'
                    }
                    //再将当前点击的dd元素字体设置为红色
                    ddNodes[j].style.color = 'red';

                    //同时，当点击了当前的dd元素后，将当前元素放在数组arr的对应位置
                    //每当点击了某个dd元素，都会重新将arr数组内的非0元素，渲染到页面上（但是渲染之前要先清空之前的）
                    chooseResult.innerHTML = ''   //先清空chooseResult内的元素
                    arr[i] = ddNodes[j];
                    changePriceBind(arr);   //调用这个函数用于更改价格

                    arr.forEach(function (element, index) {   //遍历数组arr
                        if (element !== 0) {  //对数组中所有非0元素进行创建标签
                            let markDiv = document.createElement('div');
                            markDiv.className = 'mark';
                            markDiv.innerText = element.innerText;
                            let aNode = document.createElement('a');
                            aNode.innerText = 'X';
                            //为a标签添加一个属性，用于标记这是数组arr哪个索引产生的a
                            aNode.setAttribute('index', index);
                            markDiv.appendChild(aNode);
                            chooseResult.appendChild(markDiv);
                        }
                    })

                    //---- 当点击dd后，就会将结果显示到页面上方，此时会同时生成a标签，在a标签生成的同时，为a标签添加单击----
                    //获取所有a标签
                    let aNodes = document.querySelectorAll('#wrapper #content .contentMain #center #right .rightBottom .chooseResult .mark a');

                    for (let n = 0; n < aNodes.length; n++) {
                        aNodes[n].onclick = function () {   //为每一个a标签添加点击事件
                            //获取点击的a标签身上的index属性
                            let index = aNodes[n].getAttribute('index');
                            arr[index] = 0;   //将数组对应位置元素清0

                            //找到对应index的dl元素的所有dd元素，将所有dd颜色重置，第一个dd设置为红色，
                            let dds = dlNodes[index].querySelectorAll('dd');
                            //先将当前dl元素内所有的dd元素的字体重置为#666颜色
                            for (let k = 0; k < dds.length; k++) {
                                dds[k].style.color = '#666'
                            }
                            dds[0].style.color = 'red';

                            //将结果栏中对应的dd删除
                            chooseResult.removeChild(aNodes[n].parentNode);

                            //调用价格函数
                            changePriceBind(arr);
                        }
                    }
                }
            }
        }
    }

    /* -------------------------------------------------------------------------*/
    //9、价格变动的函数声明（注意：这个函数不要自动调用，需要的时候在其他函数内调用）
        //该函数在点击dd时，或删除dd时进行调用
    function changePriceBind(arr){
        //获取价格标签元素：
        let oldPrice = document.querySelector('#wrapper #content .contentMain #center #right .rightTop .priceWrap .priceTop .price p');
        let price = goodData.goodsDetail.price;  //初始价格
        //给每一个dd标签身上都添加一个属性，用来记录其价格变化  (这一步我们在函数7中实现)

        //遍历arr数组，将dd身上的changePrice和最初价格进行相加
        for(let i = 0; i < arr.length; i++){
            if(arr[i] !== 0){
                let changePrice = Number(arr[i].getAttribute('price'));
                price = price + changePrice
            }
        }
        oldPrice.innerText = price;

        //将变化后的价格写到选择搭配区的左侧标签中
        //获取左侧价格标签
        let leftPrice = document.querySelector('#wrapper #content .contentMain .contentMidBottom .rightDetail .chooseBox .listWrap .left p');
        leftPrice.innerText = '¥' + price;

        //确保选择搭配区的右侧标签中的价钱，在没有任何选择时，与左侧价钱一样
        //获取所有复选框元素
        let ipts = document.querySelectorAll('#wrapper #content .contentMain .contentMidBottom .rightDetail .chooseBox .listWrap .middle li input');
        //获取右侧套餐价元素
        let newPrice = document.querySelector('#wrapper #content .contentMain .contentMidBottom .rightDetail .chooseBox .listWrap .right i');

        for(let i = 0; i < ipts.length; i++){
            if(ipts[i].checked === true){
                price = price + Number(ipts[i].value);
            }
        }
        newPrice.innerText = '¥' + price;
    }

    /* -------------------------------------------------------------------------*/
    //10、选择搭配中间区域复选框的选中，使价钱变动效果
    function choosePrice(){
        //获取所有复选框元素
        let ipts = document.querySelectorAll('#wrapper #content .contentMain .contentMidBottom .rightDetail .chooseBox .listWrap .middle li input');
        //获取基础价格
        let leftPrice = document.querySelector('#wrapper #content .contentMain .contentMidBottom .rightDetail .chooseBox .listWrap .left p');
        //获取右侧套餐价元素
        let newPrice = document.querySelector('#wrapper #content .contentMain .contentMidBottom .rightDetail .chooseBox .listWrap .right i')
        
        //遍历这些元素，将选中的元素的价格取出，与基础价格进行累加
        for(let i = 0; i < ipts.length; i++){
            //为每个复选框添加单击事件
            ipts[i].onclick = function(){
                let price = Number(leftPrice.innerText.slice(1));  //获取到具体的价格（去除¥符号）
                //当单击某一个复选框时，就需要重新将当前所有选中的复选框取出，拿到他们的价格
                for(let j = 0; j < ipts.length; j++){
                    if(ipts[j].checked === true){
                        price = price + Number(ipts[i].value);
                    }
                }
                //将新的价格写入套餐价元素
                newPrice.innerText = '¥' + price;
            }
        }

    }

    /* -------------------------------------------------------------------------*/
    //11、封装一个公共选项卡函数，当点击某个选项卡时，显示该选项卡相关内容
        //需要两个参数：被点击的选项卡元素(tabBtns)，待显示内容的元素(tabConts)
    function tab(tabBtns, tabConts){
        //为每一个选项卡元素添加单击响应事件
        for(let i = 0; i < tabBtns.length; i++){
            tabBtns[i].onclick = function(){
        
                //先将所有选项卡元素的className清空，选项卡对应的div元素的className也清空
                for(let j = 0; j < tabBtns.length; j++){
                    tabBtns[j].className = '';
                    tabConts[j].className = '';
                }
                //将当前点击的选项卡元素添加active类,对应的展示内容的div元素添加active类
                tabBtns[i].className = 'active';
                tabConts[i].className = 'active';
            }
        }
    }

    /* -------------------------------------------------------------------------*/
    //12、点击左侧选项卡
    function leftTab(){
        //获取选项卡元素
        let h4s = document.querySelectorAll('#wrapper #content .contentMain .contentMidBottom .leftAside .asideTop h4');
        //待显示内容的元素
        let divs = document.querySelectorAll('#wrapper #content .contentMain .contentMidBottom .leftAside .asideContent>div');

        tab(h4s, divs);
    }


    /* -------------------------------------------------------------------------*/
    //13、点击右侧选项卡
    function rightTab(){
        //获取选项卡元素
        let lis = document.querySelectorAll('#wrapper #content .contentMain .contentMidBottom .rightDetail .bottomDetail .tabBtns li');
        //待显示内容的元素
        let divs = document.querySelectorAll('#wrapper #content .contentMain .contentMidBottom .rightDetail .bottomDetail .tabContents div');

        tab(lis, divs);
    }

    /* -------------------------------------------------------------------------*/
    //14、右边侧边栏的点击效果
    function rightAsideBind(){
        //获取按钮元素
        let btns = document.querySelector('#wrapper #rightAside .btns');
        //获取侧边栏元素
        let rightAside = document.getElementById('rightAside');

        //记录初始状态
        let closed = true;

        //绑定点击事件
        btns.onclick = function(){
            if(closed === true){
                btns.className = 'btns btnsOpen';
                rightAside.className = 'asideOpen'
                closed = false;
            }else{
                btns.className = 'btns btnsClose';
                rightAside.className = 'asideClose';
                closed = true;
            }
        }
    }


    //对上面所有的函数进行调用
    navPathDataBind();
    bigClassBind();
    thumbnailData();
    thumbnailClick();
    thumbnailLeftRightClick();
    rightTopData();
    rightBottomeData();
    clickddBind();
    choosePrice();
    leftTab();
    rightTab();
    rightAsideBind();
}