<template>
	<div class="ebook">
		<TitleBar 
		:ifTitleAndMenuShow="ifTitleAndMenuShow"
		></TitleBar>
		<div class="read-wrapper">
			<div id="read"></div>
			<div class="mask">
				<div class="left" @click='prevPage'></div>
				<div class="center" @click='toggleTitleAndMenu'></div>
				<div class="right" @click='nextPage'></div>
			</div>
		</div>
		<MenuBar 
		:ifTitleAndMenuShow="ifTitleAndMenuShow"
		:fontSizeList="fontSizeList"
		:defaultFontSize="defaultFontSize"
		@setFontSize="setFontSize"
		:themeList="themeList"
		:defaultTheme="defaultTheme"
		@setTheme="setTheme"
		:bookAvailable="bookAvailable"
		@onProgressChange="onProgressChange"
		@jumpTo="jumpTo"
		@setProcess="setProcess"
		:navigation="navigation"
		ref="MenuBar"
		></MenuBar>
	</div>
</template>

<script>
import Epub from 'epubjs'
import TitleBar from '@/components/TitleBar'
import MenuBar from '@/components/MenuBar'
const DOWNLOAD_URL = '/static/中国人史纲.epub'
global.epub = Epub
export default {
	data(){
		return{
			ifTitleAndMenuShow: false,
			fontSizeList: [
			    {fontSize:12},
			    {fontSize:14},
			    {fontSize:16},
			    {fontSize:18},
			    {fontSize:20},
			    {fontSize:22},
			    {fontSize:24},
			],
			defaultFontSize:16,
			themeList:[
			    {
			    	name: 'default',
			    	style:{
			    		body:{
			    			'color': '#000', 'background': '#fff'
			    		}
			    	}
			    },
			    {
			    	name: 'eye',
			    	style:{
			    		body:{
			    			'color': '#000', 'background': '#ceeaba'
			    		}
			    	}
			    },
			    {
			    	name: 'night',
			    	style:{
			    		body:{
			    			'color': '#ccc', 'background': '#000'
			    		}
			    	}
			    },
			    {
			    	name: 'gold',
			    	style:{
			    		body:{
			    			'color': '#000', 'background': 'rgb(241, 236, 226)'
			    		}
			    	}
			    },
			],
			defaultTheme:0,
			//图示是否处于可用状态
			bookAvailable: false,
			navigation:{}
		}
	},
	components:{
		TitleBar,
		MenuBar
	},
	methods:{
		//电子书的解析和渲染
		showEpub(){
			//生成Book
			this.book = new Epub(DOWNLOAD_URL)
			//生成Rendition
			this.rendition = this.book.renderTo('read',{
				width: window.innerWidth,
				height: window.innerHeight
			})
			//通过Rendition.display方法渲染电子书
			this.rendition.display()
			//获取Theme对象
			this.themes = this.rendition.themes
			this.setFontSize(this.defaultFontSize)
			//主题注册
			//this.themes.register(name,styles)
			//主题选择
			//this.themes.select(name)
			this.registerTheme()
			// this.themes.select('night')
			this.setTheme(this.defaultTheme)
			//获取Location对象
			//通过epubjs的钩子函数来实现
			this.book.ready.then(() =>{
				this.navigation = this.book.navigation
				console.log(this.navigation)
				return this.book.locations.generate()
			}).then(result =>{
				this.locations = this.book.locations
				console.log(this.locations)
				this.bookAvailable = true
				// this.onProgressChange(50)
			})
		},

		//翻页功能
		prevPage(){
			if(this.rendition && this.bookAvailable){
				this.rendition.prev().then(() => {
				});				
			}
			this.ifTitleAndMenuShow = false;
            this.$refs.MenuBar.hideSetting()
		},
		nextPage(){
			if(this.rendition && this.bookAvailable){
				this.rendition.next().then(() => {
				});
			}
			this.ifTitleAndMenuShow = false;
            this.$refs.MenuBar.hideSetting()
		},
		toggleTitleAndMenu(){
			this.ifTitleAndMenuShow = !this.ifTitleAndMenuShow
			if(!this.ifTitleAndMenuShow){
				this.$refs.MenuBar.hideSetting()
			}
		},
		hideTitleAndMenu(){
			this.ifTitleAndMenuShow = false
			this.$refs.MenuBar.hideSetting()
			this.$refs.MenuBar.hideContent()
		},
		setFontSize(fontSize){
			this.defaultFontSize = fontSize
			if(this.themes){
				this.themes.fontSize(fontSize + 'px')
			}
		},
		registerTheme(){
			this.themeList.forEach(theme =>{
				this.themes.register(theme.name,theme.style)
			})
		},
		setTheme(index){
			this.themes.select(this.themeList[index].name)
			this.defaultTheme = index
		},
		//progress 进度条的数值 0-100
		onProgressChange(progress){
			const percentage = progress /100
			const location = percentage > 0 ?this.locations.cfiFromPercentage(percentage) : 0
			console.log(location)
			this.rendition.display(location)
		},
		jumpTo(href){
			this.rendition.display(href)
			this.hideTitleAndMenu()
		},
		//在查看进度条时更新进度条
		setProcess(){
			if(this.bookAvailable){
				let currentLocation = this.rendition.currentLocation()
			    let currentPage = this.locations.percentageFromCfi(
			        currentLocation.start.cfi
			    )
			    // console.log(Math.round(currentPage * 100))
			    this.$refs.MenuBar.progress = Math.round(currentPage * 100)
			    this.$refs.MenuBar.onProgressInput(this.$refs.MenuBar.progress)
			}
		}



	},
	mounted(){
		this.showEpub()
	}
} 
</script>

<style lang='scss' scoped>
@import './assets/styles/global';
.ebook{
	position: relative;
	.read-wrapper{
		.mask{
			position: absolute;
			top: 0;
			left: 0;
			z-index: 100;
			display: flex;
			width: 100%;
			height:100%;
			.left{
				flex: 0 0 px2rem(130);
			}
			.center{
				flex: 1;
			}
			.right{
				flex: 0 0 px2rem(130);
			}
		}
	}
}
</style>