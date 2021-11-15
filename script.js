function _(type) {
	return document.createElement(type.toUpperCase())
}

const hex = '0123456789abcdef'

function toHex(num) {
	num = Math.round(num)
	if (num > 255) {num = 255}
	if (num < 0)   {num = 0}
	var o = hex[num%16]
	num /= 16
	num = Math.floor(num)
	var s = hex[num%16]
	return s + o
}

function fromHex(arg) {
	arg = arg.toLowerCase()
	return hex.indexOf(arg[0]) * 16 + hex.indexOf(arg[1])
}

class RGB {
	constructor(r,g,b) {
		if (typeof(r) == 'string') {
			var rgb = /#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(r)
			this.r = fromHex(rgb[1])
			this.g = fromHex(rgb[2])
			this.b = fromHex(rgb[3])
		} else {
			this.r = r
			this.g = g
			this.b = b
		}
	}
	hex() {
		return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`
	}
	lerp(bot,top,mid=0.5){
		var r = ((top.r - bot.r) * mid) + bot.r
		var g = ((top.g - bot.g) * mid) + bot.g
		var b = ((top.b - bot.b) * mid) + bot.b
		return new RGB(r,g,b)
	}
}

function lerp(bot, top, mid=0.5) {
	return bot + (top-bot) * mid
}

function lxrp(bot, top, num) {
	return (num-bot) / (top-bot)
}

var bench = []

for (year in get) {
	var mark = {
		'year':year,
		'color':new RGB(get[year])
	}
	if (year < 1500) {
		mark.myear = lerp(1300,1500,lxrp(-10000,1500,year))
	}
	bench.push(mark)
}

bench.sort((a, b) => (a.year > b.year) ? 1 : -1)

function color(year) {
	var i = 0
	while (bench[i].year < year) i++
	prior = bench[i-1]
	after = bench[i]
	var delta = after.year - prior.year
	var mid = year - prior.year
	mid /= delta
	return new RGB().lerp(prior.color,after.color,mid)
}

function str(year) {
	year = Math.floor(year)
	if (year > 1000) {
		return String(year)
	} else if (year > 0) {
		return `c. ${year} AD`
		// return 'c. AD '+String(year)
	} else {
		return `c. ${-year} BC`
		// return 'c. '+String(-year) + ' BC'
	}

}

const ticks = true

$(document).ready(function() {

	for (var i = 1; i <= 118; i++) {
		// var element = $('.e'+i)
		// element[0].style.backgroundColor = color(disc[i]).hex()
		// element.children()[4].innerText = str(disc[i])
		var element = $('#e'+i)
		element[0].style.backgroundColor = color(disc[i]).hex()
		element.children()[4].innerText = str(disc[i])
		if (disc[i] < 1500) {
			$(element).addClass("ancient");
		}
	}

	var legend = $('#legend')
	for (var i = 1; i < bench.length; i++) {
		prior = bench[i-1]
		after = bench[i]
		pc = prior.color.hex()
		ac = after.color.hex()
		var entry = _('div')
		if (ticks) {
			entry.innerText = bench[i].year
			$(entry).addClass('barright')
		}
		legend.append(entry)
		entry.style.backgroundImage = `linear-gradient(to right, ${pc} , ${ac})`
		entry.style.width = String(((after.myear ? after.myear : after.year) - (prior.myear ? prior.myear : prior.year))*2) + 'px'
	}

})
