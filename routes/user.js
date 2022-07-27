var express = require('express');
const customerHelper = require('../helpers/customerHelper');
var router = express.Router();
//var productHelper=require('../helpers/product-helpers')

router.get('/', function (req, res, next) {
    let user=req.session.user
    console.log(user)
    //productHelper.getAllProducts().then((products)=>{
    //console.log(products)
    
    res.render('index',{user1:true,user})
});
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }
  else{res.redirect('/login')}
  }
router.get('/loginfir',(req,res)=>{
  res.render('customer/loginfir')
})
router.get('/login', (req, res) => {
    if (req.session.loggedIn) { res.redirect('/') }
    else {

        res.render('customer/login', { "loginError": req.session.loginError })
        req.session.loginError = false
    }
})
router.get('/signup', (req, res) => {
    res.render('customer/signup',{"signuperror":req.session.signuperror,user1:true})
    req.session.signuperror=false
})
router.post('/signup',(req,res)=>{
    customerHelper.doSignup(req.body).then((response)=>{
      console.log(response)
      if(response.status){
      res.render('customer/login')}else{req.session.signuperror=true
      res.redirect('/signup')}
    })
  })
  router.post('/login',(req,res)=>{
    customerHelper.doLogin(req.body).then((response)=>{
      if(response.Status){
        req.session.loggedIn=true
        req.session.user=response.user
        res.redirect('/')
      }
      else{
        req.session.loginError=true
        res.redirect('/login')
      }
    })
  })
  router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
  })
  router.get('/forgot',(req,res)=>{
    res.render('customer/forgot',{user1:true})
  })
  router.post('/forgot',(req,res)=>{
    customerHelper.doForgot(req.body).then((response)=>{
      console.log(response)
      res.redirect('/login')
    })
  })
  router.get('/content',(req,res)=>{
    let user=req.session.user
    customerHelper.getcontent().then((work12)=>{
      res.render('customer/content',{work12,user,user1:true})
    })
  })
  router.get('/view/:id',async(req,res)=>{
    let user=req.session.user
    customerHelper.getview(req.params.id).then((content)=>{
      res.render('customer/view',{content,user,user1:true})
    })
    
    //let proId=req.params.id;
  })
  router.get('/works',(req,res)=>{
    let user=req.session.user
    customerHelper.getwork(req.params.key).then((work12)=>{
      console.log(work12)
      res.render('customer/works',{work12,user,user1:true})
    })
  })
  router.get('/workview/:id',async(req,res)=>{
    let user=req.session.user
    customerHelper.getworkview(req.params.id).then((content)=>{
      res.render('customer/workview',{content,user,user1:true})
    })
    
    //let proId=req.params.id;
  })
  router.get('/editprofile',async(req,res)=>{
    let user =req.session.user
    let work=await customerHelper.getprofiledetails(req.session.user._id)
    console.log(work)
    res.render('customer/editprofile',{work,user,user1:true})
    //let proId=req.params.id;
  })
  router.post('/editprofile',(req,res)=>{
    customerHelper.editprofile(req.session.user._id,req.body).then(()=>{
      res.redirect('/profile')
      if (req.files) { 
        if(req.files.image){
          let image=req.files.image
          image.mv('./public/images/custimg/'+req.session.user._id+'.jpeg')
        }
    }
  }) 
}) 
router.get('/profile',(req,res)=>{
  let user=req.session.user
  customerHelper.getdetails(req.session.user._id).then((details)=>{
    console.log(details)
    res.render('customer/profile',{details,user,user1:true})})
    
  
})
router.get('/worker1',(req,res)=>{
  let user=req.session.user
  customerHelper.getworker().then((work12)=>{
    res.render('customer/worker1',{work12,user,user1:true})
  })
})
router.get('/workerview/:id',async(req,res)=>{
  let user=req.session.user
  customerHelper.getworkerview(req.params.id).then((content)=>{
    res.render('customer/workerview',{content,user,user1:true})
  })
})
router.get('/request/:id',verifyLogin,async(req,res)=>{
  let user=req.session.user
  customerHelper.getworkview(req.params.id).then((content)=>{
    res.render('customer/request',{content,user,user1:true});
  })
})
router.post('/request/:id',async(req,res)=>{
  let user=req.session.user
  customerHelper.saverequest(req.body).then(()=>{
    res.redirect('/works')
  })
})
router.get('/reqwork/',verifyLogin,(req,res)=>{
  customerHelper.getreqwork1(req.session.user._id).then((work12)=>{
    let user=req.session.user
    console.log(req.session.user._id)
    console.log(work12)
    res.render('customer/reqwork',{work12,user,user1:true})
  })
  
})

router.get('/acpwork',verifyLogin,(req,res)=>{
 customerHelper.getacceptedwork(req.session.user._id).then((content)=>{
    let user=req.session.user
    console.log(req.session.user._id)
    console.log(content)
    res.render('customer/acpwork',{content,user,user1:true})
  })
})
router.get('/viewacpwork/:id',verifyLogin,(req,res)=>{
  
  customerHelper.getacceptedwork2(req.params.id).then((content)=>{
    let user=req.session.user
    console.log(req.session.user._id)
    console.log(content)
    res.render('customer/viewacpwork',{content,user,user1:true})
  })
  
})
router.get('/confirmedwork',verifyLogin,(req,res)=>{
  customerHelper.getconfirmedwork(req.session.user._id).then((content)=>{
    let user=req.session.user
    console.log(req.session.user._id)
    console.log(content)
    res.render('customer/confirmedwork',{content,user,user1:true})
  })
})
router.get('/viewconworks/:id',verifyLogin,(req,res)=>{
  
  customerHelper.getaconwork(req.params.id).then((content)=>{
    let user=req.session.user
    console.log(req.session.user._id)
    console.log(content)
    res.render('customer/viewconwork',{content,user,user1:true})
  })
  
})
router.post('/message',(req,res)=>{
  customerHelper.passmessage(req.body).then(()=>{
    res.redirect('/')
  })
})
module.exports = router;