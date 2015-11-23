var Worker = require('./models/worker');
var Grant = require('./models/grant');
var Request = require('./models/request');
var path = require('path');
var crypto = require('crypto');
var multer  = require('multer');
var storageGrant = multer.diskStorage({
  destination: './public/img/uploads/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
});
var storageWorker = multer.diskStorage({
  destination: './public/img/workers/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
});

var uploadGrant = multer({ storage: storageGrant });
var uploadWorker = multer({ storage: storageWorker });

module.exports = function(app){
	
	/////////////////////////////
	// ROUTES
	/////////////////////////////

	app.get('/api/workers', function(req, res) {

        Worker.find({}, function(err, workers) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
            //res.send('hey');
            res.json(workers); // return all todos in JSON format
        });
    });

    app.post('/api/workers', uploadWorker.single('file'), function(req, res){
        console.log('req: ', req.body);
        console.log('files: ', req.file);
        Worker.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            department: req.body.department,
            skills: req.body.skill,
            bio: req.body.bio,
            image:req.file.filename
        }, function(err, worker){
            if (err)
                res.send(err)

            res.json(worker);
        })
    });

    app.get('/api/skills', function(req, res){
        Worker.aggregate([
            {$unwind:"$skills"},
            {$group:{_id:"$skills.name", "total":{"$sum":1}}},
            {$sort:{total:-1}},{$limit:10}],
        function(err, skills){
            if (err)
                res.send(err);

            res.send(skills);
        });
    });

    app.post('/api/grant', uploadGrant.array('file', 12), function(req, res){
        console.log('req: ', req.body);
        console.log('files: ', req.files);
        var images = [];
        for(var i = 0; i<req.files.length; i++){
            images.push(req.files[i].filename);
        };
        console.log(images)
        Grant.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            department: req.body.department,
            summary: req.body.summary,
            timeline:req.body.timeline,
            images:images
        }, function(err, application){
            if (err)
                res.send(err)

            res.json(application);
        })
    });

    app.post('/api/request', function(req, res){
        Request.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            department: req.body.department,
            numHours: req.body.numHours,
            perHour: req.body.perHour,
            description: req.body.description,
            worker: req.body.worker
        }, function(err, request){
            if (err)
                res.send(err)

            res.json(request);
        })
    })
}