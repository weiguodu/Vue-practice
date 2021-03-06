<template>
	<div class="seller" ref="seller">
		<div class="seller-content">
			<div class="overview">
				<h1 class="title">{{seller.name}}</h1>
				<div class="desc">
					<sell-star :size="36" :score="seller.score"></sell-star>
					<span class="text">({{seller.ratingCount}})</span>
					<span class="text">月售{{seller.sellCount}}单</span>
				</div>
				<ul class="remark">
					<li class="block">
						<h2>起送价</h2>
						<div class="content">
							<span class="stress">{{seller.minPrice}}</span>元
						</div>
					</li>
					<li class="block">
						<h2>商家配送</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryPrice}}</span>元
						</div>
					</li>
					<li class="block">
						<h2>平均配送时间</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryTime}}</span>分钟
						</div>
					</li>
				</ul>
				<div class="favorite">
					<i class="icon iconfont icon-favorite" 
					  :class="{'active':favorite}"
					  @click="toggleFavorite"
					></i>
					<span class="text">{{favoriteText}}</span>
				</div>
			</div>
			<split></split>
			<div class="bulletin">
				<h1 class="title">公告与活动</h1>
				<div class="content-wrapper">
					<p class="content">{{seller.bulletin}}</p>
					<ul v-if="seller.supports" class="supports">
						<li class="support-item"
						  v-for="(item,index) in seller.supports"
						>						
							<span class="icon" :class="classMap[item.type]"></span>
							<span class="text">{{item.description}}</span>
						</li>
					</ul>
				</div>
			</div>
			<split></split>
			<div class="pics">
				<h1 class="title">商家实景</h1>
				<div class="pic-wrapper" ref="picWrapper">
					<ul class="pic-list" ref="picList">
						<li class="pic-item" v-for="pic of seller.pics">
							<img :src="pic" width="120" height="90">
						</li>
					</ul>
				</div>
			</div>
			<split></split>
			<div class="info">
				<h1 class="title">商家信息</h1>
				<ul>
					<li class="info-item" v-for="info of seller.infos">
						{{info}}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import Bscroll from 'better-scroll'
import Split from '@/components/Split/Split'
import SellStar from '@/components/Star/Star'
import {saveToLocal, loadFromLocal} from '@/common/js/store'

export default{
	name: 'SellSeller',
	data(){
		return{
			favorite: (()=>{
				return loadFromLocal(this.seller.id, 'favorite', false)
			})()
		}
	},
	props:{
		seller:{
			type: Object
		}
	},
	components:{
		Split,
		SellStar
	},
	methods:{
		initScroll(){
			if(!this.scroll){
				this.scroll = new Bscroll(this.$refs.seller,{
					click: true
				});
			}else{
				this.scroll.refresh();
			}
		},
		initPics(){
			if(this.seller.pics){
				let picWidth = 120;
				let margin = 6;
				let width = (picWidth + margin) * this.seller.pics.length - margin;
				this.$refs.picList.style.width = width + 'px';
				this.$nextTick(()=>{
					if(!this.picScroll){
						this.picScroll = new Bscroll(this.$refs.picWrapper,{
							scrollX: true,
							eventPassthrough: 'vertical'
						})
					}else{
						this.picScroll.refresh();
					}
				})
			}
		},
		toggleFavorite(){
			if (!event._constructed) {
	          return;
	        }
			this.favorite = !this.favorite;
			saveToLocal(this.seller.id, 'favorite', this.favorite)
		}
	},
	computed:{
		favoriteText(){
			return this.favorite? '已收藏' : '收藏';
		}
	},
	watch: {
      'seller'() {
        this.$nextTick(() => {
          this.initScroll();
          this.initPics();
        });
      }
    },
	created(){
		this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
	},
	mounted(){
		this.initScroll();
		this.initPics();
	}
}
</script>

<style lang='scss' scoped>
@import '@/assets/styles/global.scss';
.seller{
	position: absolute;
	top: 174px;
	bottom: 0;
	width: 100%;
	overflow: hidden;
	.seller-content{
		.overview{
			position: relative;
			padding: 18px;
			.title{
				font-size: 14px;
				color: rgb(7, 17, 27);
				line-height: 14px;
				margin-bottom: 8px;
				font-weight: 700;
			}
			.desc{
				font-size: 0;
				.star{
					display: inline-block;
					margin-right: 8px;
					vertical-align: top;
				}
				.text{
					display: inline-block;
					font-size: 10px;
					color: rgb(77, 85, 93);
					line-height: 18px;
					margin-right: 12px;
				}
			}
			.remark{
				display: flex;
				margin-top: 18px;
				padding-top: 18px;
				border-top: 1px solid rgba(7, 17, 27, .1);
				text-align: center;
				.block{
					flex: 1;
					border-right: 1px solid rgba(7, 17, 27, .1);
					&:last-child{
						border-right: none;
					}
					h2{
						font-size: 10px;
						color: rgb(147, 153, 159);
						line-height: 10px;
						margin-bottom: 4px;
					}
					.content{
						font-size: 10px;
						font-weight: 200;
						color: rgb(7, 17, 27);
						line-height: 24px;
						.stress{
							font-size: 24px;
						}
					}
				}
			}
			.favorite{
				width: 36px;
				position: absolute;
				right: 18px;
				top: 18px;
				text-align: center;
				.icon-favorite{
					display: block;
					font-size: 24px;
					line-height: 24px;
					color: #d4d6d9;
					&.active{
						color: rgb(240, 20, 20);
					}
				}
				.text{
					font-size: 10px;
					line-height: 10px;
					color: rgb(77, 85, 93);
				}
			}
		}
		.bulletin{
			padding: 18px 18px 0 18px;
			.title{
				font-size: 14px;
				color: rgb(7, 17, 27);
				line-height: 14px;
				margin-bottom: 8px;
				font-weight: 700;
			}
			.content-wrapper{
				.content{
					font-size: 12px;
					font-weight: 200;
					line-height: 24px;
					color: rgb(240, 20, 20);
					padding: 0 12px;
				}
				.supports{
					margin-top: 16px;
					.support-item{
						padding: 16px 12px;
						border-top: 1px solid rgba(7, 17, 27, .1);
						font-size: 0;
						&:last-child{
						}
						.icon{
							display: inline-block;
							vertical-align: top;
							width: 16px;
							height: 16px;
							margin-right: 6px;
							background-size: 16px 16px;
							background-repeat: no-repeat;
							&.decrease{
							    @include bg-img(decrease_4);
							}
							&.discount{
								@include bg-img(discount_4);
							}
							&.guarantee{
								@include bg-img(guarantee_4);
							}
							&.invoice{
								@include bg-img(invoice_4);
							}
							&.special{
								@include bg-img(special_4);
							}
				        }
				        .text{
				        	font-size: 12px;
				        	line-height: 16px;
				        	color: rgb(7, 17, 27);
				        	font-weight: 200;
				        }
					}
				}
			}
		}
		.pics{
			padding: 18px;
			.title{
				font-size: 14px;
				color: rgb(7, 17, 27);
				line-height: 14px;
				margin-bottom: 12px;
				font-weight: 700;
			}
			.pic-wrapper{
				width: 100%;
				overflow: hidden;
				white-space: nowrap;
				.pic-list{
					font-size: 0;
					.pic-item{
						display: inline-block;
						margin-right: 6px;
						width: 120px;
						height: 90px;
						&:last-child{
							margin-right: 0;
						}
					}
				}
			}
		}
		.info{
			padding: 18px 18px 0 ;
			.title{
				font-size: 14px;
				color: rgb(7, 17, 27);
				line-height: 14px;
				margin-bottom: 12px;
				font-weight: 700;
			}
			.info-item{
				padding: 16px 12px;
				font-size: 12px;
				font-weight: 200;
				color: rgb(7, 17, 27);
				line-height: 16px;
				border-top: 1px solid rgba(7, 17, 27, .1);
			}
		}
	}
}
</style>