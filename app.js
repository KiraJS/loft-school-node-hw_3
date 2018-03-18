const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static')

const koaBody = require('koa-body');

const Pug = require('koa-pug');
app.pug = new Pug({
  viewPath: './views'
});

const KoaRouter = require('koa-router');
const router = new KoaRouter();

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ users: [], skills: {}, products: [], emails: [] }).write();


/* GET home page. */
router.get('/', function(ctx){
  ctx.body = ctx.app.pug.render('pages/index');
});

/* GET login page. */
router.get('/login', function(ctx){
  ctx.body = ctx.app.pug.render('pages/login');
});

/* GET admin page. */
router.get('/admin', function(ctx){
  ctx.body = ctx.app.pug.render('pages/admin');
});

/* POST login page */
router.post('/login', function (ctx) {
  console.log(ctx.request, ctx.request.body);
  let currentUser = db.get('users').find({ email: ctx.request.body.email }).value();
  if(currentUser && ctx.request.body.password === currentUser.password) {
    db.get('users').push(ctx.request.body).write();
    console.log('Успешная авторизация');
    ctx.redirect('/admin');
  } else {
    db.get('users').push(ctx.request.body).write();
    console.log('Создан новый пользователь');
    ctx.redirect('/');
  }
});

/* POST admin/skills page */
router.post('/admin/skills', function (ctx) {
  db.set('skills', ctx.request.body).write();
});

/* POST admin/upload page */
router.post('/admin/upload', koaBody({
  multipart: true,
  formidable: {
    uploadDir: './uploads',
  }
}), function(ctx){
  const file = ctx.request.body.files[Object.keys(ctx.request.body.files)[0]];
  console.log(file.path);
  let product = {
    imgpath: file.path + '.' + file.name.split('.').pop(),
    name: ctx.request.body.fields.name,
    price: ctx.request.body.fields.price
  }
  db.get('products').push(product).write();
});

/* POST home page. */
router.post('/', function (ctx) {
  db.set('emails', ctx.request.body).write();
});

app.use(serve('./public'));
app.use(koaBody());
app.use(router.routes());

app.listen(5000);