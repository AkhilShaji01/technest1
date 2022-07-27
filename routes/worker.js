var express = require('express');
const { render } = require('../app');
const workerHelper = require('../helpers/workerHelper');
var router = express.Router();
router.get('/', function (req, res, next) {
    let user=req.session.user
    console.log(user)
    //productHelper.getAllProducts().then((products)=>{
    //console.log(products)
    res.render('index',{worker:true,user})
});
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }
  else{res.redirect('/worker/login')}
  }
router.get('/login', (req, res) => {
    if (req.session.loggedIn) { res.redirect('/') }
    else {

        res.render('worker/login', { "loginError": req.session.loginError ,worker1:true})
        req.session.loginError = false
    }
})
router.get('/signup', (req, res) => {
    workerHelper.getCategory().then((Category)=>{
      console.log(Category)
      res.render('worker/signup',{worker1:true,"signuperror":req.session.signuperror,Category})
    })
    
    req.session.signuperror=false
})
router.post('/signup',(req,res)=>{
    workerHelper.doSignup(req.body,(id)=>{
     
      
      
      res.render('worker/login',{worker1:true})
      let image=req.files.image 
      image.mv('./public/images/unworker/'+id+'.png')
        
    
      // req.session.signuperror=true
      //   res.redirect('/worker/signup')}
      
})
  })
  router.post('/login',(req,res)=>{
    workerHelper.doLogin(req.body).then((response)=>{
      if(response.Status){
        req.session.loggedIn=true
        req.session.user=response.user
        res.redirect('/worker')
      }
      else{
        req.session.loginError=true
        res.redirect('/worker/login')
      }
    })
  })
  router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/worker')
  })

  router.get('/forgot',(req,res)=>{
    res.render('worker/forgot',{worker1:true})
  })
  router.post('/forgot',(req,res)=>{
    workerHelper.doForgot(req.body).then((response)=>{
      console.log(response)
      if(!response.status){
      res.redirect('/worker/login')}
      else{
        console.log("invalid user id")
      }
    })
  })
  router.get('/viewWork/',verifyLogin,(req,res)=>{
    workerHelper.getwork1(req.session.user._id).then((work12)=>{
      let user=req.session.user
      console.log(req.session.user._id)
      console.log(work12)
      res.render('worker/viewWork',{worker1:true,work12,user})
    })
    
  })
  router.get('/addwork',verifyLogin,(req,res)=>{
    let user=req.session.user
    let date = Date.now()
    console.log(date)
    workerHelper.getCategory1(req.session.user._id).then((user1)=>{
      console.log(user1)
      res.render('worker/addwork',{worker1:true,user,user1,date})
  })
    })
    
  router.post('/addwork',(req,res)=>{
    console.log(req.body);
    console.log(req.files.image)

    workerHelper.addwork(req.body,req.session.user._id,(id)=>{
      let image=req.files.image
      image.mv('./public/images/work/'+id+'.png')
        
      
    }).then(()=>{
      res.redirect('/worker/viewWork')
    })  
  })
  router.get('/delete-work/:id',(req,res)=>{
    let proId = req.params.id
    console.log(proId);
    workerHelper.deleteProduct(proId).then((response)=>{
      res.redirect('/worker/viewWork')
    })
  })
  router.get('/editwork/:id',async(req,res)=>{
    let work=await workerHelper.getworkdetails(req.params.id)
    console.log(work)
    res.render('worker/editwork',{work})
    //let proId=req.params.id;
  })
  router.post('/editwork/:id',(req,res)=>{
    workerHelper.editwork(req.params.id,req.body).then(()=>{
      res.redirect('/worker/viewWork')
      if (req.files) { 
      if(req.files.image){
        let image=req.files.image
        image.mv('./public/images/work/'+req.params.id+'.png')
      }
    }})
  }) 
  router.get('/view/:id',async(req,res)=>{
    let user=req.session.user
    workerHelper.getview(req.params.id).then((content)=>{
      res.render('worker/view',{content,user,worker1:true})
    })
    
    //let proId=req.params.id;
  })
  router.get('/works',(req,res)=>{
    let user=req.session.user
    workerHelper.getwork().then((work12)=>{
      res.render('worker/works',{work12,user,worker1:true})
    })
  })
  router.get('/workview/:id',async(req,res)=>{
    let user=req.session.user
    workerHelper.getworkview(req.params.id).then((content)=>{
      res.render('worker/workview',{content,user,worker1:true})
    })})

    router.get('/content',(req,res)=>{
      let user=req.session.user
      workerHelper.getcontent().then((work12)=>{
        res.render('worker/content',{work12,user,worker1:true})
      })
    })
    router.get('/profile',(req,res)=>{
      let user=req.session.user
      workerHelper.getdetails(req.session.user._id).then((details)=>{
        console.log(details)
        res.render('worker/profile',{details,user,worker1:true})})
        
      
    })  
    router.get('/editprofile',async(req,res)=>{
      let user =req.session.signuperror
      let work=await workerHelper.getprofiledetails(req.session.user._id)
      console.log(work)
      res.render('worker/editprofile',{work,worker1:true,user})
      //let proId=req.params.id;
    })
    router.post('/editprofile',(req,res)=>{
      workerHelper.editprofile(req.session.user._id,req.body).then(()=>{
        res.redirect('/worker/profile')
        if (req.files) { 
          if(req.files.image){
            let image=req.files.image
            image.mv('./public/images/workerimg/'+req.session.user._id+'.jpeg')
          }
      }
    })
  })  
   
  router.get('/worker1',(req,res)=>{
    let user=req.session.user
    workerHelper.getworker().then((work12)=>{
      res.render('worker/worker1',{work12,user,worker1:true})
    })
  })
  router.get('/workerview/:id',async(req,res)=>{
    let user=req.session.user
    workerHelper.getworkerview(req.params.id).then((content)=>{
      res.render('worker/workerview',{content,user,worker1:true})
    })
  })
  router.get('/reqwork/',verifyLogin,(req,res)=>{
    workerHelper.getreqwork1(req.session.user._id).then((work12)=>{
      let user=req.session.user
      console.log(req.session.user._id)
      console.log(work12)
      res.render('worker/reqwork',{worker1:true,work12,user})
    })
    
  })
  router.get('/conreqwork/:id',verifyLogin,(req,res)=>{
    
    workerHelper.getreqwork2(req.params.id).then((content)=>{
      let user=req.session.user
      console.log(req.session.user._id)
      console.log(content)
      res.render('worker/conwork',{worker1:true,content,user})
    })
    
  })
  router.post('/conreqwork/:id',async(req,res)=>{
    workerHelper.deletereqworker(req.params.id)
    let user=req.session.user
    workerHelper.acprequest(req.body).then(()=>{
      res.redirect('/worker/reqwork')
    })
    
  })
  router.get('/acpwork',verifyLogin,(req,res)=>{
    workerHelper.getacceptedwork(req.session.user._id).then((content)=>{
      let user=req.session.user
      console.log(req.session.user._id)
      console.log(content)
      res.render('worker/acpwork',{worker1:true,content,user})
    })
  })
  router.get('/viewacpwork/:id',verifyLogin,(req,res)=>{
    
    workerHelper.getacceptedwork2(req.params.id).then((content)=>{
      let user=req.session.user
      console.log(req.session.user._id)
      console.log(content)
      res.render('worker/viewacpwork',{worker1:true,content,user})
    })
    
  })
  router.post('/viewacpwork/:id',verifyLogin,(req,res)=>{
    workerHelper.deleteacpworker(req.params.id)
    let user=req.session.user
    workerHelper.getconwork(req.body).then((content)=>{
     
      res.redirect('/worker/acpwork')
    })
    
  })
  router.get('/confirmedwork',verifyLogin,(req,res)=>{
    workerHelper.getconfirmedwork(req.session.user._id).then((content)=>{
      let user=req.session.user
      console.log(req.session.user._id)
      console.log(content)
      res.render('worker/confirmedwork',{worker1:true,content,user})
    })
  })
  router.get('/viewconworks/:id',verifyLogin,(req,res)=>{
    
    workerHelper.getaconwork(req.params.id).then((content)=>{
      let user=req.session.user
      console.log(req.session.user._id)
      console.log(content)
      res.render('worker/viewconwork',{worker1:true,content,user})
    })
     
  })
  router.post('/message',(req,res)=>{
    workerHelper.passmessage(req.body).then(()=>{
      res.redirect('/')
    })
  })
  router.get('/deleteacpwork/:id',(req,res)=>{
    workerHelper.deleteacpworker(req.params.id).then(()=>{
      res.redirect('/worker/acpwork')
    })
  })
  router.get('/delreqwork/:id',(req,res)=>{
    workerHelper.deletereqworker(req.params.id).then(()=>{
      res.redirect('/worker/reqwork')
    })
  })
module.exports = router; 