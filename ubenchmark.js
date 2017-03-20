(function(bindTo) {

	const cal_duration   = 100;
	const block_duration = 500;

	const formatNumber = function(value) {
		value = value.toString();
		var blocks = [];
		do {
			blocks.unshift(value.slice(-3));
			value   = value.slice(0,-3);
		} while (value);

		return ('          '+blocks.join(',')).slice(-13);
	};

	const timeFn = function(_fn,_N) {
		const fn = _fn, N  = _N;

		const tic = new Date();
		for (var n = 0; n < N; n++) fn();
		return new Date() - tic;
	};

	const calibrateFn = function(_fn, duration) {
		const fn = _fn;
		var dN = 10000, repeat = 0;

		do {	
			const elapsed = timeFn(fn,dN);
			dN = Math.floor(dN * ( elapsed ? duration/elapsed : duration ));
			repeat = repeat ? (repeat + 1) : elapsed < duration;
		} while (repeat < 3);

		return dN;
	}

	const uBenchmark = function(_fn, title, test_duration) {

		_fn = _fn || function(){};
		const fn = ( typeof _fn === 'string' ) ? new Function(_fn) : _fn;

		if (typeof title === 'number') {
			test_duration = title;
			title = '';
		};
		title = title || fn.name;

		test_duration = (test_duration || 2) * 1000;	// milliseconds

		// figure out how many iterations can be done in 'block_duration' millisecords		
		const dN = Math.floor(calibrateFn(fn,cal_duration) * block_duration / cal_duration );

		// benchmark fn
		const I = test_duration / block_duration;
		var   i = 0, elapsed = 0;

		while (i++ < I)
			elapsed += timeFn(fn,dN);

		// calculate results
		const ops = Math.floor( 1000 * I * dN / elapsed );

		const results = { 'op/sec': formatNumber(ops), ops:ops,  microseconds: 1e6/ops, title: title, fn : fn.toString() }
		return results;
	}

	bindTo.uBench = uBenchmark;

})(window);

