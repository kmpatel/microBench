(function(bindTo) {

	const block_duration = 500; // do benchmark in blocks of 'block_duration' milliseconds 

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

	const calibrateFn = function(fn) {
		const cal_duration = 100;
		var dN = 100, elapsed = 0;

		do {	
			dN = Math.floor(dN * ( elapsed ? 1.1*cal_duration/elapsed : cal_duration ));
			elapsed = timeFn(fn,dN);
		} while ( elapsed < cal_duration);

		return Math.floor( dN / elapsed);	// estimated op/millisecond over 'cal_duration' milliseconds
	}

	calibrateFn(function(){});	// make sure everything is loaded into memory

	const uBenchmark = function(_fn, title, test_duration) {

		// parse arguments
		_fn = _fn || function(){};
		const fn = ( typeof _fn === 'string' ) ? new Function(_fn) : _fn;

		if (typeof title === 'number') {
			test_duration = title;
			title = '';
		};

		title = title || fn.name;
		test_duration = (test_duration || 2) * 1000;


		// figure out how many iterations can be done in 'block_duration' milliseconds
		const dN = calibrateFn(fn) * block_duration;

		// benchmark fn
		const I = Math.ceil(test_duration/block_duration);
		var   i = 0, elapsed = 0;

		while (i++ < I)
			elapsed += timeFn(fn,dN);

		// calculate results
		const ops = Math.floor( 1000 * I * dN / elapsed );
		const uSeconds = Math.floor(100e9/ops)/100000;

		const results = { 'op/sec': formatNumber(ops),  microseconds: uSeconds, ops:ops, title: title, fn : fn.toString() }
		return results;
	}

	bindTo.uBench = uBenchmark;

})(window);

