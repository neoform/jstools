;if (typeof Neoform==="undefined"){Neoform = {};}

Neoform.Queue = (function() {
    var self  = {},
        items = [];

    self.add = function(item) {
        items.push(item);
    };

    self.peek = function() {
        return items[0];
    };

    self.get = function() {
        if (items.length === 0) {
            return;
        }
        return items.shift();
    };

    self.isEmpty = function() {
        return items.length === 0;
    };

    self.size = function() {
        return items.length;
    };

    return self;
});

Neoform.BlockingQueue = (function(processor, timeOut) {
    var self = {},
        items = [],
        waiter,
        timeOuter;

    self.add = function(item) {
        items.push(item);
    };

    self.isEmpty = function() {
        return items.length === 0;
    };

    self.size = function() {
        return items.length;
    };

    function processItem() {
        processor(items.shift());
    }

    function clearWaiter() {
        try {
            clearInterval(waiter);
        } catch (e) {

        }
    }

    function startTimeout() {
        if (timeOut > 0) {

            timeOuter = setTimeout(
                function() {
                    clearWaiter();
                    clearTimeout();
                    while (items.length > 0) {
                        processItem();
                    }
                },
                timeOut
            );
        }
    }

    function stopTimeout() {
        try {
            if (timeOut > 0 && timeOuter) {
                clearTimeout(timeOuter);
            }
        } catch (e) {

        }
    }

    self.terminate = function() {
        stopTimeout();
        clearWaiter();
    };

    function start() {
        /**
         * Init
         */
        waiter = setInterval(
            function() {
                if (items.length) {
                    stopTimeout();
                    while (items.length > 0) {
                        processItem();
                    }
                    startTimeout();
                }
            },
            50
        );

        startTimeout();
    }

    self.start = start;
    start();

    return self;
});
