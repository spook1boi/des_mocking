import mongoose from "mongoose";

mongoose.connect('mongodb+srv://SpookyBoi:Aqr6Tt0QgOgQ0qTl@cluster0.lozpuyb.mongodb.net/ecommerce')
.then(()=>{
    console.log("Conenected to Mongo")
})
.catch(error => {
    console.error("Error connecting to Mongo, error"+error)
});