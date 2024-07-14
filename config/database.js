
const mongoose=require("mongoose");

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
  console.log("Mongodb is connected")
})
.catch((error)=>{
console.log(error.message)
})