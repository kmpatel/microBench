# microBench
simply JS benchmark function

	Usage:
	    results = uBench( fn [, [fnArgs], duration, title ] )

	first argument:
      fn    function or string of JS commands to be benchmarked
              string fn will be encapsulated into function, i.e. fn = new Function(fn)
              empty/null/undefined/false/'' will benchmark 'function() {}'
      
	optional parameters (order does not matter):
	  [fnArgs]   (array)  array of arguments for fn
	  duration   (number) fn will be benchmarked over a period of 'duration' seconds in length
	  title      (string) title of benchmark test, to be inserted in "results"
   
	 NOTE: binding an object to a function via .bind, .call, or .apply can dramatically 
      affect performance of said function. Consequently, uBench does not offer to bind any object 
      to function fn.  For example, "uBench(document.querySelectorAll,['div'])" will NOT work 
      because 'querySelectorAll' is not actually bound to 'document', nor does uBench offer to 
      do it. Examples of proper methods to benchmark "querySelectorAll" are:

        uBench( document.querySelectorAll.bind(document), ['div']  )
        uBench( document.querySelectorAll.bind(document,'div')     )
        uBench( "document.querySelectorAll('div')"                 )
        uBench( function(){ document.querySelectorAll('div') }     )
        uBench( function(s){document.querySelectorAll(s)}, ['div'] )
        uBench( () => document.querySelectorAll('div')             )  // for browser with arrow-func
        uBench( s  => document.querySelectorAll(s), ['div']        )  

	output:
      results['op/sec']       calculated operations per second, formatted string
      results['operations']   measured number of operations performed (fn was call)
      results['elapsed']      measured elapsed time (sec) in performing measured number of operations
      results['fn'    ]       stringified version of tested function
      results['title' ]       title provided in argument or name of function provided (if available)

