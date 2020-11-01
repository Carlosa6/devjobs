const Vacante = require('../models/Vacantes');

exports.mostrarTrabajo = async (req,res,next) => {

    await Vacante.find().sort({updateAt:'desc'})
    .then(vacItem => {
        const obj = {
            v       return{
                    id:item._id,
                    titulo:item.titulo,
                    empresa:item.empresa,
                    ubicacion:item.ubicacion,
                    salario:item.salario,
                    contrato:item.contrato,
                    descripcion:item.descripcion,
                    url:item.url
                }
            })acantes:vacItem.map(item => {
         
        }
        const vacantes = obj.vacantes;

        if(!vacantes) return next();
        
        res.render('home', {
            nombrePagina: 'DevJobs',
            tagline:'Encuentra y publica trabajos para Desarrolladores Web',
            barra:true,
            boton:true,
            vacantes
        })
    })


}