const conexion = require("../database");

const adminController = {

    checkUsuario(req,res){

        let nombre = req.query.nombre;

        let contrasena = req.query.contrasena;

        let comandoLog = "SELECT * FROM admin WHERE nombre = ? AND contrasena = ?"

        conexion.query(comandoLog, [nombre,contrasena], (err,resultados)=>{
            res.json(resultados);
        })
        
        
    }

}

module.exports = adminController;