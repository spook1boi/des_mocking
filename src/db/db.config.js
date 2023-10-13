import mongoose from "mongoose";

mongoose.connect('mongodb+srv://SpookyBoi:Aqr6Tt0QgOgQ0qTl@cluster0.lozpuyb.mongodb.net/ecommerce')
.then(()=>{
    console.log("Conectado a la base de datos")
})
.catch(error => {
    console.error("Error al conectarse a la base de datos, error"+error)
})