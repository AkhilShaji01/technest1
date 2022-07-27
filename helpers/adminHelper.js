var db=require('../config/connection')
var collection=require('../config/collection')
const bcrypt=require('bcrypt')
const { response, getMaxListeners } = require('../app')
const { Db } = require('mongodb')
var objectId=require('mongodb').ObjectId
module.exports={
    getCategory:()=>{
        return new Promise(async(resolve,reject)=>{
            let Category=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            resolve(Category)
            
        })
    },
    doSignup:(userData)=>{
                return new Promise(async(resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
            let user=await db.get().collection(collection.admin_COLLECTION).findOne({Email:userData.Email})
            if(user)
            {resolve({status:getMaxListeners})}
            else{
            db.get().collection(collection.admin_COLLECTION).insertOne(userData).then(response)
                resolve(userData)}
        })

    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let user=await db.get().collection(collection.admin_COLLECTION).findOne({Email:userData.Email})
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
            let user=await db.get().collection(collection.admin_COLLECTION).findOne({Email:userData.Email})
            if(user)
            {
                userData.Password=await bcrypt.hash(userData.Password,10)
                db.get().collection(collection.admin_COLLECTION).updateOne({Email:userData.Email},{
                    $set:{
                        Password:userData.Password
                    }
                }).then(response)
                    resolve(userData)
                


            }
        })
    },
    addcontent:(content,callback)=>{
        console.log(content);
        db.get().collection(collection.CONTENT_COLLECTION).insertOne(content).then((data)=>{
            console.log(data)
            callback(data.insertedId)
        })
    },
    getcontent:(c)=>{
        return new Promise(async(resolve,reject)=>{
            let content=await db.get().collection(collection.CONTENT_COLLECTION).find().toArray()
            resolve(content)
        })
    }, 
    deletecontent:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CONTENT_COLLECTION).remove({_id:objectId(proId)}).then((response)=>{
                resolve(response)
            })
        })
    },getcontentdetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CONTENT_COLLECTION).findOne({_id:objectId(proId)}).then((content)=>{
                resolve(content)
            })
        })
    },
    editcontent:(proId,condetails)=>{
        return new Promise((resolve,reject)=>{
        db.get().collection(collection.CONTENT_COLLECTION).updateOne({_id:objectId(proId)},{
            $set:{
                Name:condetails.Name,
                Category:condetails.Category,
                Description:condetails.Description
            }
        }).then((response)=>{
            resolve()
        })    
        })
    },
    
addworker:async(content,callback)=>{
    console.log(content);
    
    content.Password=await bcrypt.hash(content.Password,10)
    let user=await db.get().collection(collection.WORKER_COLLECTION).findOne({Email:content.Email})
    if(user){callback(statu=true)}
    else{
        db.get().collection(collection.WORKER_COLLECTION).insertOne(content).then((data)=>{
            callback(data.insertedId)})}
    
    },
getworker:(c)=>{
    return new Promise(async(resolve,reject)=>{
        let content=await db.get().collection(collection.WORKER_COLLECTION).find().toArray()
        resolve(content)
    })
},
getuser:(c)=>{
    return new Promise(async(resolve,reject)=>{
        let content=await db.get().collection(collection.CUSTOMER_COLLECTION).find().toArray()
        resolve(content)
    })
}, 
deleteuser:(proId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.CUSTOMER_COLLECTION).remove({_id:objectId(proId)}).then((response)=>{
            resolve(response)
        })
    })
}, 
deleteworker:(proId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.WORKER_COLLECTION).remove({_id:objectId(proId)}).then((response)=>{
            resolve(response)
        })
    })
},
getadmin:(c)=>{
    return new Promise(async(resolve,reject)=>{
        let admin=await db.get().collection(collection.admin_COLLECTION).find().toArray()
        resolve(admin)
    })
}, 
deleteadmin:(proId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.admin_COLLECTION).remove({_id:objectId(proId)}).then((response)=>{
            resolve(response)
        })
    })
}
,
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
    },
    getunworker:(c)=>{
        return new Promise(async(resolve,reject)=>{
            let work12=await db.get().collection(collection.UNWORKER_COLLECTION).find().toArray()
            resolve(work12)
        })
    
    },
    getunworkerdetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.UNWORKER_COLLECTION).findOne({_id:objectId(proId)}).then((content)=>{
                resolve(content)
            })
        })
    },
    verifyworker:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let user=await db.get().collection(collection.WORKER_COLLECTION).findOne({Email:userData.Email})
            if(user)
            {resolve({status:false})}
            else{
            db.get().collection(collection.WORKER_COLLECTION).insertOne(userData).then(response)
                resolve(userData)}
        })   
        }, 
        deleteunworker:(proId)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.UNWORKER_COLLECTION).deleteOne({_id:objectId(proId)}).then((response)=>{
                    resolve(response)
                })
            })
        },
        getmessage:(c)=>{
            return new Promise(async(resolve,reject)=>{
                let content=await db.get().collection(collection.MESSAGE_COLLECTION).find().toArray()
                resolve(content)
            })
        }
    

    
        

        
        

}
