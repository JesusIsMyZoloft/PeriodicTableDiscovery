function getparams() {
	var search = window.location.search
	if (search[0] == '?') {search = search.substring(1)}
	if (!search) {return {}}
	var params = search.split('&')
	var object = {}
	for (var i = 0; i < params.length; i++) {
		let pair = params[i].split('=')
		let key = pair[0]
		let val = pair[1]
		object[key] = val
	}
	return object
}

const get = getparams()