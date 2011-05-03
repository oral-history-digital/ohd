var settings = {
	/** Player versions to test. **/
	players: {
		'5.0':'players/5.0/player.swf',
		'5.1':'players/5.1/player.swf',
		'5.2':'players/5.2/player.swf'
	},
	/** Available JW4 plugins to test. **/
	plugins: {
		hd:'../hd.swf'
	},
	/** PNG skins to test. **/
	skins: {
		'':' ',
		beelden:'http://developer.longtailvideo.com/player/skins/beelden/beelden.xml',
		bekle:'http://developer.longtailvideo.com/player/skins/bekle/bekle.xml',
		bluemetal:'http://developer.longtailvideo.com/player/skins/bluemetal/bluemetal.xml',
		classic:'http://developer.longtailvideo.com/player/skins/classic/classic.xml',
		five:'http://developer.longtailvideo.com/player/skins/five/five.xml',
		icecreamsneaka:'http://developer.longtailvideo.com/player/skins/icecreamsneaka/icecreamsneaka.xml',
		lulu:'http://developer.longtailvideo.com/player/skins/lulu/lulu.xml',
		modieus:'http://developer.longtailvideo.com/player/skins/modieus/modieus.xml',
		playcasso:'http://developer.longtailvideo.com/player/skins/playcasso/playcasso.xml',
		snel:'http://developer.longtailvideo.com/player/skins/snel/snel.xml',
        stormtrooper:'http://developer.longtailvideo.com/player/skins/stormtrooper/stormtrooper.xml',
		' ':' ',
		bekle_swf:'http://developer.longtailvideo.com/player/skins/bekle/bekle.swf',
		bluemetal_swf:'http://developer.longtailvideo.com/player/skins/bluemetal/bluemetal.swf',
		classic_swf:'http://developer.longtailvideo.com/player/skins/classic/classic.swf',
		five_swf:'http://developer.longtailvideo.com/player/skins/five/five.swf',
		icecreamsneaka_swf:'http://developer.longtailvideo.com/player/skins/icecreamsneaka/icecreamsneaka.swf',
		modieus_swf:'http://developer.longtailvideo.com/player/skins/modieus/modieus.swf',
		playcasso_swf:'http://developer.longtailvideo.com/player/skins/playcasso/playcasso.swf',
		snel_swf:'http://developer.longtailvideo.com/player/skins/snel/snel.swf',
		stijl:'http://developer.longtailvideo.com/player/skins/stijl/stijl.swf',
	},
	/** All the setup examples with their flashvars. **/
	examples: {
		'': {},
		'No HD file': {
			file:'http://developer.longtailvideo.com/player/testing/files/bunny.flv',
			height:240,
			width:500,
			plugins:'hd',
			dock:'true'
		},
		'No HD file, HD Enabled': {
			file:'http://developer.longtailvideo.com/player/testing/files/bunny.flv',
			height:240,
			width:500,
			plugins:'hd',
			dock:'true',
			'hd.state': 'true'
		},
		'No HD file, HD Enabled, Autostart enabled': {
			file:'http://developer.longtailvideo.com/player/testing/files/bunny.flv',
			height:240,
			width:500,
			plugins:'hd',
			dock:'true',
			'hd.state': 'true',
			autostart: true
		},
		'Progressive Download HD File': {
			file:'http://developer.longtailvideo.com/player/testing/files/bunny.flv',
			height:240,
			width:500,
			plugins:'hd',
			dock:'true',
			'hd.file':'http://developer.longtailvideo.com/player/testing/files/bunny.mp4'
		},
		'Progressive Download HD File, HD Enabled': {
			file:'http://developer.longtailvideo.com/player/testing/files/bunny.flv',
			height:240,
			width:500,
			plugins:'hd',
			dock:'true',
			'hd.state': 'true',
			'hd.file':'http://developer.longtailvideo.com/player/testing/files/bunny.mp4'
		},
		'Progressive Download HD File, HD Enabled, autostart enabled': {
			file:'http://developer.longtailvideo.com/player/testing/files/bunny.flv',
			height:240,
			width:500,
			plugins:'hd',
			dock:'true',
			'hd.state': 'true',
			autostart: true,
			'hd.file':'http://developer.longtailvideo.com/player/testing/files/bunny.mp4'
		},
		'HTTP Streaming HD File': {
			file:'http://content.bitsontherun.com/videos/LJSVMnCF-327.mp4',
			height:240,
			width:500,
			plugins:'hd',
			dock:'true',
			type:'http',
			'hd.file':'http://content.bitsontherun.com/videos/LJSVMnCF-67067.mp4',
			'http.startparam': 'starttime'
		},
		'HTTP Streaming HD File, HD Enabled': {
			file:'http://content.bitsontherun.com/videos/LJSVMnCF-327.mp4',
			height:240,
			width:500,
			plugins:'hd',
			dock:'true',
			type:'http',
			'hd.file':'http://content.bitsontherun.com/videos/LJSVMnCF-67067.mp4',
			'hd.state':'true',
			'http.startparam': 'starttime'
		},
		'HTTP Streaming HD File, HD Enabled, Autostart Enabled': {
			file:'http://content.bitsontherun.com/videos/LJSVMnCF-327.mp4',
			height:240,
			width:500,
			plugins:'hd',
			dock:'true',
			type:'http',
			'hd.file':'http://content.bitsontherun.com/videos/LJSVMnCF-67067.mp4',
			'hd.state':'true',
			autostart:'true',
			'http.startparam': 'starttime'
			
		},
		'RTMP Streaming HD File': {
			file:'videos/8Juv1MVa-483.mp4',
			streamer: 'rtmp://fms.12E5.edgecastcdn.net/0012E5',
			height:240,
			width:500,
			plugins:'hd',
			dock:'true',
			type:'rtmp',
			'hd.file':'videos/8Juv1MVa-67727.mp4'
		},
		'RTMP Streaming HD File, HD Enabled': {
			file:'videos/8Juv1MVa-483.mp4',
			streamer: 'rtmp://fms.12E5.edgecastcdn.net/0012E5',
			height:240,
			width:500,
			plugins:'hd',
			dock:'true',
			type:'rtmp',
			'hd.file':'videos/8Juv1MVa-67727.mp4',
			'hd.state':'true'
		},
		'RTMP Streaming HD File, HD Enabled, Autostart Enabled': {
			file:'videos/8Juv1MVa-483.mp4',
			streamer: 'rtmp://fms.12E5.edgecastcdn.net/0012E5',
			height:240,
			width:500,
			plugins:'hd',
			dock:'true',
			type:'rtmp',
			'hd.file':'videos/8Juv1MVa-67727.mp4',
			'hd.state':'true',
			autostart:'true'			
		},
		'HD playlist': {
			file:'files/hd.xml',
			height:240,
			width:800,
			controlbar:'over',
			playlist:'right',
			playlistsize:400,
			plugins:'hd'
		}
	}
}
