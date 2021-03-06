<template>
	<div class="search">
		<div class="search-box-wrapper">
			<search-box
			  ref="searchBox"
			  @query="onQuertChange"
			></search-box>
		</div>
		<div class="shortcut-wrapper"
		  ref="shortcutWrapper"
		  v-show="!query"
		>
		    <scroll class="shortcut"
		      ref="shortcut"
		      :data="shortcut"
		      :refreshDelay="refreshDelay"
		    >
		        <div>
		        	<div class="hot-key">
		        		<h1 class="title">热门搜索</h1>
		        		<ul>
		        			<li class="item"
		        			  v-for="item in hotKey"
		        			  @click="addQuery(item.k)"
		        			>
		        				<span>{{item.k}}</span>
		        			</li>
		        		</ul>
		        	</div>
		        	<div class="search-history" v-show="searchHistory.length">
		        		<h1 class="title">
		        			<span class="text">搜索历史</span>
		        			<span class="clear" @click="showConfirm">
		        				<i class="icon-clear"></i>
		        			</span>
		        		</h1>
		        		<search-list
		        		  :searches="searchHistory"
		        		  @select="addQuery"
		        		  @delete="deleteSearchHistory"
		        		></search-list>
		        	</div>
		        </div>	
		    </scroll>
		</div>
		<div class="search-result"
		  ref="searchResult"
		  v-show="query"
		>
			<Suggest 
			  :query="query"
			  ref="suggest"
			  @listScroll="bulrInput"
			  @select="saveSearch"
			></Suggest>
		</div>
		<confirm
		  ref="confirm"
		  @confirm="clearSearchHistory"
		  text="是否清空所有搜索历史"
		  confirmBtnText="清空"
		></confirm>
		<router-view></router-view>
	</div>
</template>

<script>
    import SearchBox from 'base/search-box/search-box'
    import Scroll from 'base/scroll/scroll'
    import Suggest from 'components/suggest/suggest'
    import SearchList from 'base/search-list/search-list'
    import Confirm from 'base/confirm/confirm'
    import { getHotKey } from 'api/search'
    import { ERR_OK } from 'api/config'
    import { playlistMixin, searchMixin } from 'common/js/mixin'
    import { mapActions,mapGetters } from 'vuex'

	export default{
		mixins: [playlistMixin, searchMixin],
		name: 'Search',
		data(){
			return{
				hotKey: [],
			}
		},
		components:{
			SearchBox,
			Scroll,
			Suggest,
			SearchList,
			Confirm
		},
		computed: {
			shortcut(){
				return this.hotKey.concat(this.searchHistory)
			}
		},
		methods:{
			handlePlaylist(playlist){
				const bottom = playlist.length > 0 ? '60px' : ''

		        this.$refs.searchResult.style.bottom = bottom
		        this.$refs.suggest.refresh()

		        this.$refs.shortcutWrapper.style.bottom = bottom
		        this.$refs.shortcut.refresh()
			},
			_getHotKey(){
				getHotKey().then((res)=>{
					if(res.code === ERR_OK){
						this.hotKey = res.data.hotkey.slice(0, 10)
					}
				})
			},
			addQuery(item){
				this.$refs.searchBox.setQuery(item)
			},
			
			onQuertChange(query){
				this.query = query.trim()
			},
			bulrInput(){
				this.$refs.searchBox.bulr()
			},
			saveSearch(){
				this.saveSearchHistory(this.query)
			},
			showConfirm(){
				this.$refs.confirm.show()
			},
			...mapActions([
		        'clearSearchHistory'
		    ])
		},
		created(){
			this._getHotKey()
		},
		watch: {
			query(newQuery){
				if(!newQuery){
					setTimeout(()=>{
						this.$refs.shortcut.refresh()
					},20)
				}
			}
		}
	}
</script>

<style lang='stylus' scoped>
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';

.search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>