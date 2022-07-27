var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
const { response, route } = require('../app')
var objectId = require('mongodb').ObjectId

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {

            userData.Password = await bcrypt.hash(userData.Password, 10)

            let user = await db.get().collection(collection.CUSTOMER_COLLECTION).findOne({ Email: userData.Email })
            if (user) { resolve({ status: false }) }
            else {
                db.get().collection(collection.CUSTOMER_COLLECTION).insertOne(userData).then()
                resolve({ status: true }, userData)
            }
        })

    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.CUSTOMER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log("loginsuccess")
                        response.user = user
                        response.Status = true
                        resolve(response)
                    }
                    else {
                        console.log('loign failed')
                        resolve({ status: false })
                    }
                })
            } else {
                console.log('login failed')
                resolve({ status: false })
            }
        })
    },
    doForgot: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await db.get().collection(collection.CUSTOMER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                userData.Password = await bcrypt.hash(userData.Password, 10)
                db.get().collection(collection.CUSTOMER_COLLECTION).updateOne({ Email: userData.Email }, {
                    $set: {
                        Password: userData.Password
                    }
                }).then(response)
                resolve(userData)



            }
        })
    },
    getcontent: (c) => {
        return new Promise(async (resolve, reject) => {
            let work12 = await db.get().collection(collection.CONTENT_COLLECTION).find().toArray()
            resolve(work12)
        })
    },
    getview: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CONTENT_COLLECTION).findOne({ _id: objectId(proId) }).then((content) => {
                resolve(content)
            })
        })
    },
    getwork: () => {
        return new Promise(async (resolve, reject) => {
            let work12 = await db.get().collection(collection.WORK_COLLECTION).find().toArray()
            resolve(work12)
        })

    },
    getworkview: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.WORK_COLLECTION).findOne({ _id: objectId(proId) }).then((content) => {
                resolve(content)
            })
        })
    },
    getprofiledetails: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CUSTOMER_COLLECTION).findOne({ _id: objectId(proId) }).then((worker) => {
                resolve(worker)
            })
        })
    },
    editprofile: (proId, prodetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CUSTOMER_COLLECTION).updateOne({ _id: objectId(proId) }, {
                $set: {
                    "Name": prodetails.Name,
                    "Phone": prodetails.Phone,
                    "Address": prodetails.Address,
                    "DateOfBirth": prodetails.DateOfBirth,
                }
            }).then((response) => {
                resolve()
            })
        })
    }, getdetails: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CUSTOMER_COLLECTION).findOne({ _id: objectId(proId) }).then((content) => {
                resolve(content)
            })
        })
    }
    ,
    getworker: (c) => {
        return new Promise(async (resolve, reject) => {
            let work12 = await db.get().collection(collection.WORKER_COLLECTION).find().toArray()
            resolve(work12)
        })

    },
    getworkerview: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.WORKER_COLLECTION).findOne({ _id: objectId(proId) }).then((content) => {
                resolve(content)
            })
        })
    },
    getrequest: (proId) => {
        return new Promise(async (resolve, reject) => {
            let content = await db.get().collection(collection.WORK_COLLECTION).find({ _id: objectId(proId) }).toArray()
            resolve(content)
        })
    },
    saverequest: (userData) => {
        return new Promise(async (resolve, reject) => {

            db.get().collection(collection.REQWORK_COLLECTION).insertOne(userData).then()
            resolve(userData)
        })

    },
    getacceptedwork: (userid1) => {
        return new Promise(async (resolve, reject) => {
            console.log(userid1)
            // find({_id:objectId(userid1)}).toArray()
            let content = await db.get().collection(collection.ACPWORK_COLLECTION).find({ customer_id: userid1 }).toArray()
            resolve(content)



        })
    },
    getreqwork1: (userid1) => {
        return new Promise(async (resolve, reject) => {
            console.log(userid1)
            let works = await db.get().collection(collection.REQWORK_COLLECTION).find({ customer_id: userid1 }).toArray()
            console.log(works)
            resolve(works)
        })
    },
    getacceptedwork: (userid1) => {
        return new Promise(async (resolve, reject) => {
            console.log(userid1)
            // find({_id:objectId(userid1)}).toArray()
            let content = await db.get().collection(collection.ACPWORK_COLLECTION).find({ customer_id: userid1 }).toArray()
            resolve(content)



        })
    },
    getacceptedwork2: (userid1) => {
        return new Promise(async (resolve, reject) => {
            console.log(userid1)
            // find({_id:objectId(userid1)}).toArray()
            await db.get().collection(collection.ACPWORK_COLLECTION).findOne({ _id: objectId(userid1) }).then((content) => {
                resolve(content)
            })



        })
    },
    getconfirmedwork: (userid1) => {
        return new Promise(async (resolve, reject) => {
            console.log(userid1)
            // find({_id:objectId(userid1)}).toArray()
            let content = await db.get().collection(collection.CONWORK_COLLECTION).find({ customer_id: userid1 }).toArray()
            resolve(content)



        })
    },
    getaconwork: (userid1) => {
        return new Promise(async (resolve, reject) => {
            console.log(userid1)
            // find({_id:objectId(userid1)}).toArray()
            await db.get().collection(collection.CONWORK_COLLECTION).findOne({ _id: objectId(userid1) }).then((content) => {
                resolve(content)
            })



        })
    },
    passmessage: (data) => {
        return new Promise(async (resolve, reject) => {

            db.get().collection(collection.MESSAGE_COLLECTION).insertOne(data).then()
            resolve(data)
        })

    }
}