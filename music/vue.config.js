const axios = require('axios')
const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}


module.exports = {
	devServer: {
		before: app => {
			
			app.get('/api/getDiscList',function(req,res){
				const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

				axios.get(url, {
					    headers: {
					    	referer: 'https://c.y.qq.com/',
                            host: 'c.y.qq.com'	            	
					    },
				    params: req.query
				}).then((response) => {
					res.json(response.data)
				}).catch((e) => {
					console.log(e)
				})
			})
		}
	},
	chainWebpack: config => {
		config.resolve.alias
		    .set('api', resolve('src/api'))
		    .set('base', resolve('src/base'))
		    .set('common', resolve('src/common'))
		    .set('components', resolve('src/components'))
		    .set('store', resolve('src/store'))

	}
}