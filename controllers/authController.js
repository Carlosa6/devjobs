const passport = require("passport");
const Vacante = require('../models/Vacantes')

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect:'/administracion',
    failureRedirect:'/iniciar-sesion',
    failureFlash:true,
    badRequestMessage:'Debe ingresar su correo electrónico y contraseña'
})

//Revisar si el usuario está autenticado o no
exports.verificarUsuario = (req,res,next) => {
    //revisar el usuario
    if(req.isAuthenticated()){
        return next();
    }

    //redireccionar
    res.redirect('/iniciar-sesion');
}

exports.mostrarPanel = async (req,res) => {
    const nombre = req.user.nombre;
    //consultar al usuario autenticado sus vacantes
    await Vacante.find({ autor:req.user._id }).sort({updateAt:'desc'})
    .then(ggItem => {
        const obj = {
            vacantes:ggItem.map(item => {
                return{
                    id:item._id,
                    titulo:item.titulo,
                    empresa:item.empresa,
                    ubicacion:item.ubicacion,
                    salario:item.salario,
                    contrato:item.contrato,
                    descripcion:item.descripcion,
                    url:item.url
                }
            })
        }
        const vacantes = obj.vacantes

        res.render('administracion',{
            nombrePagina:'Panel de Administración',
            tagLine:"Crea y Administra tus vacantes desde aquí",
            cerrarSesion:true,
            nombre,
            vacantes
        })
    });

}

exports.cerrarSesion = (req,res) => {
    req.logout();
    req.flash('success_msg','Cerraste sesión correctamente')
    return res.redirect('/iniciar-sesion');
}