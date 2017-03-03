<template>
 <div class="goods">
   <div class="menu-wrapper"  ref="menuWrapper">
     <ul>
       <li v-for="(item, index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
         <span class="text">
           <span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>
           {{item.name}}
         </span>
       </li>
     </ul>
   </div>
   <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook" rel="foodList">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFoods(food, $event)" v-for="food in item.foods" class="food-item">
              <div class="icon">
                <img width="57" height="57" :src="food.icon" >
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月销{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol @add="addFood" :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
   </div>
   <shopcart ref="shopcart" :selectFood="selectFood" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
   <food  @add="addFood" :food="selectedFood" ref="food"></food>
 </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart.vue';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import food from 'components/food/food';
  // 定义组件
   const ERR_OK = 0;
   export default {
       // 接收数据
   props: {
           seller: {
               type: Object
           }
       },
   data() {
       return {
         goods: [],
         listHeight: [],
         scrollY: 0,
         selectedFood: {}
       };
     },
   computed: {
     currentIndex() {
         for (var i = 0; i < this.listHeight.length; i++) {
           var height1 = this.listHeight[i];
           var height2 = this.listHeight[i + 1];
           if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
             return i;
           }
         }
         return 0;
       },
     selectFood() {
         let foods = [];
         this.goods.forEach((good) => {
           good.foods.forEach((food) => {
             if (food.count) {
               foods.push(food);
             }
           });
         });
         return foods;
       }
     },
     created() {
           this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

           this.$http.get('/api/goods').then((response) => {
               response = response.body;
               if (response.errno === ERR_OK) {
                   this.goods = response.data;
                   this.$nextTick(() => {
                       this._initScroll();
                       this._calculateHeight();
                   });
               }
           });
     },
   methods: {
       selectMenu(index, event) {
         if (!event._constructed) {
             return;
         }
         let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
         let el = foodList[index];
         this.foodsScroll.scrollToElement(el, 300);
       },
       selectFoods(food, event) {
         if (!event._constructed) {
             return;
         }
         this.selectedFood = food;
         this.$refs.food.show();
       },
       addFood(target) {
         this._drop(target);
       },
       _drop(target) {
         this.$nextTick(() => {
             this.$refs.shopcart.drop(target);
         });
       },
       _initScroll() {
           this.meunScroll = new BScroll(this.$refs.menuWrapper, {
               click: true
           });
           this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
               click: true,
               probeType: 3
           });
           this.foodsScroll.on('scroll', (pos) => {
               this.scrollY = Math.abs(Math.round(pos.y));
           });
        },
       _calculateHeight() {
           var foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
           var height = 0;
           this.listHeight.push(height);
           for (var i = 0; i < foodList.length; i++) {
               var item = foodList[i];
               height += item.clientHeight;
               this.listHeight.push(height);
           }
       }
     },
   components: {
       shopcart,
       cartcontrol,
       food
     }
   };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
    .goods
       display: flex
       position: absolute
       top: 174px
       bottom: 46px
       width: 100%
       overflow: hidden
       .menu-wrapper
         flex: 0 0 80px
         width: 80px
         background: #f3f5f7
         .menu-item
           display: table
           height: 54px
           width: 56px
           padding: 0 12px
           line-height 14px
           font-size 12px
           &.current
              position: relative
              margin-top: -1px
              z-index: 10
              font-weight: 700
              background: #fff
              .text
                  border-none()
           .icon
             display: inline-block
             width: 16px
             height: 16px
             vertical-align: top
             margin-right: 2px
             background-size: 16px 16px
             background-repeat: no-repeat
             &.decrease
               bg-image('decrease_3')
             &.discount
               bg-image('discount_3')
             &.guarantee
               bg-image('guarantee_3')
             &.invoice
               bg-image('invoice_3')
             &.special
               bg-image('special_3')
           .text
              display table-cell
              vertical-align: middle
              font-size 12px
              font-weight: 200
              line-height: 14px
              border-1px(rgba(7, 17, 27, 0.1))

      .foods-wrapper
         flex: 1
         .title
           padding-left 14px
           height: 26px
           font-size: 12px
           line-height: 26px
           color: rgb(147, 153, 159)
           border-left: 2px solid #d9dde1
           background: #f3f5f7
        .food-item
           display: flex
           margin: 18px
           padding-bottom: 18px
           border-1px(rgba(7, 17, 27, 0.1))
           &:last-child
              border-none()
              margin-bottom: 0
           .icon
             flex: 0 0 57px
             margin-right: 10px
           .content
             flex 1
             .name
                margin 2px 0 8px 0
                font-size 14px
                line-height 14px
                color: rgb(7, 17, 27)
             .desc, .extra
               line-height: 12px
               font-size: 10px
               color: rgb(147, 153, 159)
             .desc
                margin-bottom: 8px
             .extra
                .count
                    margin-right: 12px
             .price
                font-weight: 700
                line-height: 24px
                .now
                   margin-right: 8px
                   font-size: 14px
                   color: rgb(240, 20, 20)
                .old
                   text-decoration: line-through
                   font-size: 10px
                   color: rgb(147, 153, 159)
             .cartcontrol-wrapper
                position: absolute
                right: 0
                bottom: 12px
</style>
