var express = require('express');
var router = express.Router();
//var productHelper=require('../helpers/product-helpers')
const adminHelper=require('../helpers/adminHelper')

/* GET users listing. */
router.get('/', function(req, res, next) {
  let user=req.session.user
  res.render('admin/admin1',{admin1:true,user});
});
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }
  else{res.redirect('/admin/login')}
  }
  router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/admin')
  })
router.get('/login', (req, res) => {
    if (req.session.loggedIn) { res.redirect('/admin/login') }
    else {

        res.render('admin/admin1', { "loginError": req.session.loginError ,admin1:true})
        req.session.loginError = false
    }
})
router.post('/login',(req,res)=>{
  adminHelper.doLogin(req.body).then((response)=>{
    if(response.Status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/admin/profile')
    }
    else{
      req.session.loginError=true
      res.redirect('/admin/login')
    }
  })
})
router.get('/signup',verifyLogin, (req, res) => {
  let user=req.session.user
  res.render('admin/signup',{admin1:true,user,"signuperror":req.session.signuperror})
  req.session.signuperror=false
})
router.get('/profile',(req,res)=>{
  let user=req.session.user
  res.render('admin/profile',{admin1:true,user})
})
router.post('/signup',(req,res)=>{
  adminHelper.doSignup(req.body).then((response)=>{
    console.log(response)
    if(response.status){
    res.render('admin/viewadmin',{admin1:true})}
    else{req.session.signuperror=true
      res.redirect('/admin/signup')}
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/admin')
})
router.get('/addcontent',(req,res)=>{
  let user=req.session.user
  adminHelper.getCategory(req.session.user._id).then((Category)=>{
  res.render('admin/addcontent',{admin1:true,user,Category})
  })
})
router.post('/addcontent',(req,res)=>{
  console.log(req.body);
  console.log(req.files.image);
  let user=req.session.user
  let Category= adminHelper.getCategory(req.session.user._id)
  adminHelper.addcontent(req.body,(id)=>{
    let image=req.files.image
    image.mv('./public/images/content/'+id+'.png')
    res.render("admin/addcontent",{admin1:true,user,Category})
  })
})
router.get('/viewcontent/',verifyLogin,(req,res)=>{
  adminHelper.getcontent().then((content)=>{
    let user=req.session.user
    console.log(content)
    res.render('admin/viewcontent',{admin1:true,user,content})
  })
  
})
router.get('/deletecontent/:id',(req,res)=>{
  let proId = req.params.id
  console.log(proId);
  adminHelper.deletecontent(proId).then((response)=>{
    res.redirect('/admin/viewcontent')
  })
})

router.get('/editcontent/:id',async(req,res)=>{
  let content=await adminHelper.getcontentdetails(req.params.id)
  console.log(content)
  res.render('admin/editcontent',{content})
  //let proId=req.params.id;
})
router.post('/editcontent/:id',(req,res)=>{
  adminHelper.editcontent(req.params.id,req.body).then(()=>{
    res.redirect('/admin/viewcontent')
    if (req.files) { 
      if(req.files.image){
        let image=req.files.image
        image.mv('./public/images/content/'+req.params.id+'.png')
      } }
    
  })
 
})
router.get('/viewworker/',verifyLogin,(req,res)=>{
  adminHelper.getworker().then((content)=>{
    let user=req.session.user
    console.log(content)
    res.render('admin/viewworker',{admin1:true,user,content})
  })
  
})
router.get('/addworker', (req, res) => { 
  res.render('admin/addworker',{admin1:true,"signuperror":req.session.signuperror})
  req.session.signuperror=false
})

router.post('/addworker',(req,res)=>{
  console.log(req.body);
  //console.log(req.files.image);

  adminHelper.addworker(req.body,(id)=>{
    
    let image=req.files.image
    image.mv('./public/images/worker/'+id+'.png')
    res.render("admin/addworker",{admin1:true})
  })
})
router.get('/home',(req,res)=>{
  let user=req.session.user
  res.render('index',{admin1:true,user})
})
router.get('/viewuser/',verifyLogin,(req,res)=>{
  adminHelper.getuser().then((content)=>{
   
    let user=req.session.user
    console.log(content)
    res.render('admin/viewuser',{admin1:true,user,content})
  })
  
})
router.get('/deleteuser/:id',(req,res)=>{
  let proId = req.params.id
  console.log(proId);
  adminHelper.deleteuser(proId).then((response)=>{
    res.redirect('/admin/viewuser')
  })
})
router.get('/deleteworker/:id',(req,res)=>{
  let proId = req.params.id
  console.log(proId);
  adminHelper.deleteworker(proId).then((response)=>{
    res.redirect('/admin/viewworker')
  })
})
router.get('/viewadmin',verifyLogin,(req,res)=>{
  adminHelper.getadmin().then((admin)=>{
   
    let user=req.session.user
    console.log(admin)
    res.render('admin/viewadmin',{admin1:true,user,admin})
  })
  
})
router.get('/deleteadmin/:id',(req,res)=>{
  let proId = req.params.id
  console.log(proId);
  adminHelper.deleteadmin(proId).then((response)=>{
    res.redirect('/admin/viewadmin')
  })
})
router.get('/content',(req,res)=>{
  let user=req.session.user
 adminHelper.getcontent().then((work12)=>{
    res.render('admin/content',{work12,user,admin1:true})
  })
})
router.get('/view/:id',async(req,res)=>{
  let user=req.session.user
  adminHelper.getview(req.params.id).then((content)=>{
    res.render('admin/view',{content,user,admin1:true})
  })
  
  //let proId=req.params.id;
})
router.get('/works',(req,res)=>{
  let user=req.session.user
  adminHelper.getwork().then((work12)=>{
    res.render('admin/works',{work12,user,admin1:true})
  })
})
router.get('/workview/:id',async(req,res)=>{
  let user=req.session.user
  adminHelper.getworkview(req.params.id).then((content)=>{
    res.render('admin/workview',{content,user,admin1:true})
  })
  
  //let proId=req.params.id;
})

router.get('/worker',(req,res)=>{
  let user=req.session.user
  adminHelper.getworker().then((work12)=>{
    res.render('admin/worker',{work12,user,admin1:true})
  })
})
router.get('/workerview/:id',async(req,res)=>{
  let user=req.session.user
  adminHelper.getworkerview(req.params.id).then((content)=>{
    res.render('admin/workerview',{content,user,admin1:true})
  })
})
router.get('/unworker/',verifyLogin,(req,res)=>{
  adminHelper.getunworker().then((content)=>{
    let user=req.session.user
    console.log(content)
    res.render('admin/unworker',{admin1:true,user,content})
  })
  
})
router.get('/verifyworker/:id',async(req,res)=>{
  let user=req.session.user
  let content=await adminHelper.getunworkerdetails(req.params.id)
  console.log(content)
  res.render('admin/verifyworker',{content,user,admin1:true})
  //let proId=req.params.id;
})
router.post('/verifyworker/:id',(req,res)=>{
  adminHelper.deleteunworker(req.params.id)
  adminHelper.verifyworker(req.body).then((data)=>{
    res.redirect('/admin/unworker')
    if (req.files) { 
      if(req.files.image){
        let image=req.files.image
        image.mv('./public/images/worker/'+id+'.png')
      } }
      
  })
  let del=adminHelper.deleteunworker(req.params.id)
})
router.get('/message/',verifyLogin,(req,res)=>{
  adminHelper.getmessage().then((content)=>{
    let user=req.session.user
    console.log(content)
    res.render('admin/message',{admin1:true,user,content})
  })
})
module.exports = router;
