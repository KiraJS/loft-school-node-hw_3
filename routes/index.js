const express = require('express');
const router = express.Router();

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ users: [], skills: {}, products: [], emails: [] }).write();

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Express' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('pages/login', { title: 'Express' });
});

/* GET admin page. */
router.get('/admin', function(req, res, next) {
  res.render('pages/admin', { title: 'Express' });
});

/* POST login page */
router.post('/login', function (req, res) {
  let currentUser = db.get('users').find({ email: req.body.email }).value();
  if(currentUser && req.body.password === currentUser.password) {
    db.get('users').push(req.body).write();
    console.log('Успешная авторизация');
    res.redirect('/admin');
  } else {
    db.get('users').push(req.body).write();
    console.log('Создан новый пользователь');
    res.redirect('/');
  }
});

/* POST admin/skills page */
router.post('/admin/skills', function (req, res) {
  db.set('skills', req.body).write();
});

/* POST admin page */
router.post('/admin/upload', upload.single('photo'), function (req, res, next) {
   let product = {
    imgpath: req.file.path + '.' + req.file.originalname.split('.').pop(),
    name: req.body.name,
    price: req.body.price
  }
  db.get('products').push(product).write();
});

/* POST home page. */
router.post('/', function (req, res) {
  db.set('emails', req.body).write();
});

module.exports = router;
