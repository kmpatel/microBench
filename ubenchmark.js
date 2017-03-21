// MIT License

// Copyright (c) 2017 Ketan M. Patel

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

(function(bindTo) {

	const block_duration = 500; // do benchmark in blocks of 'block_duration' milliseconds 

	const formatNumber = function(value) {
		value = value.toString();
		var blocks = [];
		do {
			blocks.unshift(value.slice(-3));
			value   = value.slice(0,-3);
		} while (value);

		return blocks.join(',');
	};

	const timeFn = function(_fn,_N) {
		const fn = _fn, N  = _N;  // in case JS compiler optimizes for it

		const tic = new Date();
		for (var n = 0; n < N; n++) fn();
		return new Date() - tic;
	};

	const calibrateFn = function(fn) {
		const duration = 100;	// minimum test duration (milliseconds) to estimate op/sec
		var N = 1, elapsed = 0;

		do {	
			N = Math.floor( N * ( elapsed ? 1.1*duration/elapsed : duration ) );
			elapsed = timeFn(fn,N);
		} while ( elapsed < duration );

		return Math.floor( N / elapsed );	// estimated op/millisecond over 'duration' milliseconds
	};

	const uBenchmark = function(fn, _args, _title, _duration) {
		var args, title, duration, fnString;

		// parse arguments
		for(var param, i = 1; i < arguments.length; i++) 
			switch ( (param = arguments[i]).constructor ) {
				case Array : args 		= param; continue;
				case Number: duration	= param; continue;
				case String: title 		= param; continue;
			};

		args 	 = args  || [];
		title 	 = title || (fn||{}).name;
		duration = (duration || 2) * 1000;

		fn = ( typeof fn === 'string' ) ? new Function(fn) : ( fn || function(){} );
		
		fnString = fn.toString();
		
		// bind arguments
		if (args.length > 0)  
			fn = Function.bind.apply(fn, [null].concat(args));

		// estimate op/sec and calculate # iteration for desired block duration
		const N = calibrateFn(fn) * block_duration;

		// benchmark fn
		const I = Math.ceil( duration / Math.min(block_duration,duration) );
		var   i = 0, elapsed = 0;

		while (i++ < I)
			elapsed += timeFn(fn,N);

		// calculate results
		const ops = Math.round( 1000 * I * N / elapsed );
		const uSeconds = Math.round( 1e6/ops * 10000 ) / 10000; //round to 1/10th of nanosecod

		const results = { 'op/sec': formatNumber(ops),  microseconds: uSeconds, ops:ops, fn : fnString };
		if (title) results.title = title;
		return results;
	}

	calibrateFn(function(){});	// make sure everything is loaded into memory
	bindTo.uBench = uBenchmark;

})(window);
