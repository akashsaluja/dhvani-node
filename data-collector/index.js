module.exports = function (context, req) {
    context.log('Data Collector functions has started functioning.');
    var inshorts = require('./news/inshorts');
    inshorts.getDataInshorts(context).then(
        (items) => {
            console.log(items);
            context.done();
        }
    );
    // context.bindings.outputQueueItem = "Name passed to the function: " + 
    // (req.query.name || req.body.name);
};
