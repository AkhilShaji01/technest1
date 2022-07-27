var db=require('../config/connection')
var collection=require('../config/collection')
const bcrypt=require('bcrypt')
const { response } = require('../app')
const { Db } = require('mongodb')
const { resolve } = require('promise')
var objectId=require('mongodb').ObjectId
module.exports={
    getCategory:()=>{
        return new Promise(async(resolve,reject)=>{
            let Category=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            resolve(Category)
            
        })
    },
    getCategory1:(worId)=>{
        return new Promise(async(resolve,reject)=>{
            let user=await db.get().collection(collection.WORKER_COLLECTION).findOne({_id:objectId(worId)})
            resolve(user)
            
        })
    },
    doSignup:async (userData,callback)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
            let user=await db.get().collection(collection.WORKER_COLLECTION).findOne({Email:userData.Email})
            if(user){callback({status:false})}
            else{
            db.get().collection(collection.UNWORKER_COLLECTION).insertOne(userData).then((userData)=>{
                callback(userData.insertedId,{status:true})
            })
                
            } 

    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let user=await db.get().collection(collection.WORKER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log("loginsuccess")
                        response.user=user
                        response.Status=true
                        resolve(response)
                    }
                    else{
                        console.log('loign failed')
                        resolve({status:false})
                    }
                })
            }else{
                console.log('login failed')
                resolve({status:false})
            }
        })
    },
    doForgot:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let response={}
            let user=await db.get().collection(collection.WORKER_COLLECTION).findOne({Email:userData.Email})
            if(user)
            {   response.status=true
                userData.Password=await bcrypt.hash(userData.Password,10)
                db.get().collection(collection.WORKER_COLLECTION).updateOne({Email:userData.Email},{
                    $set:{
                        Password:userData.Password
                    }
                }).then((response)=>{
                    resolve(userData)})
                


            }else{
                resolve({status:true})
            }
        })
    },
    addwork:async(work,userid,callback)=>{
        console.log(work);
              
            let workobj={
                user:objectId(userid),
                works:work
            }
            db.get().collection(collection.WORK_COLLECTION).insertOne(workobj).then((data)=>{
                console.log(data)
                callback(data.insertedId)
            })
    },
    getwork1:(userid1)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(userid1)
            let works=await db.get().collection(collection.WORK_COLLECTION).find({user:objectId(userid1)}).toArray()
            resolve(works)
        })
    },
    deleteProduct:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.WORK_COLLECTION).remove({_id:objectId(proId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getworkdetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.WORK_COLLECTION).findOne({_id:objectId(proId)}).then((work)=>{
                resolve(work)
            })
        })
    },
    editwork:(proId,prodetails)=>{
        return new Promise((resolve,reject)=>{
        db.get().collection(collection.WORK_COLLECTION).updateOne({_id:objectId(proId)},{
            $set:{
                "works.Name":prodetails.Name,
                "works.Category":prodetails.Category,
                "works.Description":prodetails.Description,
                "works.Price":prodetails.Price
            }
        }).then((response)=>{
            resolve()
        })    
        })
    },
    getcontent:(c)=>{
        return new Promise(async(resolve,reject)=>{
            let work12=await db.get().collection(collection.CONTENT_COLLECTION).find().toArray()
            resolve(work12)
        })
    },
    getview:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CONTENT_COLLECTION).findOne({_id:objectId(proId)}).then((content)=>{
                resolve(content)
            })
        })
    },
    getwork:(c)=>{
        return new Promise(async(resolve,reject)=>{
            let work12=await db.get().collection(collection.WORK_COLLECTION).find().toArray()
            resolve(work12)
        })
    
    },
    getworkview:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.WORK_COLLECTION).findOne({_id:objectId(proId)}).then((content)=>{
                resolve(content)
            })
        })
    }
    ,
    getdetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.WORKER_COLLECTION).findOne({_id:objectId(proId)}).then((content)=>{
                resolve(content)
            })
        })
    },
    getprofiledetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.WORKER_COLLECTION).findOne({_id:objectId(proId)}).then((worker)=>{
                resolve(worker)
            })
        })
    },
    editprofile:(proId,prodetails)=>{
        return new Promise((resolve,reject)=>{
        db.get().collection(collection.WORKER_COLLECTION).updateOne({_id:objectId(proId)},{
            $set:{
                "Name":prodetails.Name,
                "Phone":prodetails.Phone,
                "Address":prodetails.Address,
                "DateOfBirth":prodetails.DateOfBirth,
                "Experience":prodetails.Experience,
                "Qualification":prodetails.Qualification
            }
        }).then((response)=>{
            resolve()
        })    
        })
    },
    getworker:(c)=>{
        return new Promise(async(resolve,reject)=>{
            let work12=await db.get().collection(collection.WORKER_COLLECTION).find().toArray()
            resolve(work12)
        })
    
    },
    getworkerview:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.WORKER_COLLECTION).findOne({_id:objectId(proId)}).then((content)=>{
                resolve(content)
            })
        })
    },
    getreqwork1:(userid1)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(userid1)
            let works=await db.get().collection(collection.REQWORK_COLLECTION).find({worker_id:userid1}).toArray()
            console.log(works)
            resolve(works)
        })
    },
    getreqwork2:(userid1)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(userid1)
            // find({_id:objectId(userid1)}).toArray()
            await db.get().collection(collection.REQWORK_COLLECTION).findOne({_id:objectId(userid1)}).then((content)=>{
                resolve(content)
            })
            
           
        })
    },
    acprequest:(userData)=>{
        return new Promise(async(resolve,reject)=>{
    
         db.get().collection(collection.ACPWORK_COLLECTION).insertOne(userData).then()
        resolve(userData)
    })

    },
    deletereqworker:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.REQWORK_COLLECTION).deleteOne({_id:objectId(proId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getacceptedwork:(userid1)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(userid1)
            // find({_id:objectId(userid1)}).toArray()
            let content=await db.get().collection(collection.ACPWORK_COLLECTION).find({worker_id:userid1}).toArray()
                resolve(content)
            
            
           
        })
    },
    getacceptedwork2:(userid1)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(userid1)
            // find({_id:objectId(userid1)}).toArray()
            await db.get().collection(collection.ACPWORK_COLLECTION).findOne({_id:objectId(userid1)}).then((content)=>{
                resolve(content)})
            
            
           
        })
    },
    getconwork:(userData)=>{
        return new Promise(async(resolve,reject)=>{
    
         db.get().collection(collection.CONWORK_COLLECTION).insertOne(userData).then()
        resolve(userData)
    })

    }
    ,
    deleteacpworker:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ACPWORK_COLLECTION).deleteOne({_id:objectId(proId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getconfirmedwork:(userid1)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(userid1)
            // find({_id:objectId(userid1)}).toArray()
            let content=await db.get().collection(collection.CONWORK_COLLECTION).find({worker_id:userid1}).toArray()
                resolve(content)
            
            
           
        })
    },
    getaconwork:(userid1)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(userid1)
            // find({_id:objectId(userid1)}).toArray()
            await db.get().collection(collection.CONWORK_COLLECTION).findOne({_id:objectId(userid1)}).then((content)=>{
                resolve(content)})
            
            
           
        })
    },
    passmessage: (data) => {
        return new Promise(async (resolve, reject) => {

            db.get().collection(collection.MESSAGE_COLLECTION).insertOne(data).then()
            resolve(data)
        })

    }


        

        
        

}
