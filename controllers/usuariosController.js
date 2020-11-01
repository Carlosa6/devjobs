const Usuarios = require('../models/Usuarios');
const multer = require('multer')
const path = require('path');
const shortid = require('shortid');

exports.formCrearCuenta = (req,res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en DevJobs',
        tagline: 'Comienza a publicar tus vacantes gratis, sólo debes crear una cuenta'
    })
}


exports.crearUsuario = async (req,res) => {
    const errors =[];
    const { nombre,email,password,confirmar } = req.body;

    if(!nombre){
        errors.push({text: 'El nombre es obligatorio'});
    }

    if(!email){
        errors.push({text: 'El correo electrónico no debe ir vacío'});
    }

    if(!password){
        errors.push({text: 'La contraseña es obligatoria'});
    }

    if(password.length < 5){
        errors.push({text: 'La contraseña debe contener mínimo 5 caracteres'});
    }

    if(confirmar !== password){
        errors.push({text: 'Las contraseñas deben coincidir'});
    }

    if(errors.length > 0){
        res.render('crear-cuenta',{
            nombrePagina: 'Crea tu cuenta en DevJobs',
            tagline: 'Comienza a publicar tus vacantes gratis, sólo debes crear una cuenta',
            errors
        });
    }else{
        //verificar que el correo no exista en la BD
        const emailUser = await Usuarios.findOne({email:email});
        if (emailUser) {
            req.flash('error_msg','Correo electrónico existente, ingresa otro');
            res.redirect('/crear-cuenta');
        } else {
            const usuario = new Usuarios();
            usuario.email = email;
            usuario.nombre = nombre;
            usuario.password = password;

            await usuario.save();
            req.flash('success_msg','Usuario registrado correctamente');
            res.redirect('/iniciar-sesion');
        }
    }


}

//formulario para Iniciar Sesión
exports.formIniciarSesion = (req,res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesión en DevJobs'
    })
}

//formulario editar perfil de usuario
exports.formEditarPerfil = (req,res) => {
    const usuario = {}
    usuario.name = req.user.nombre;
    usuario.email = req.user.email;

    res.render('editar-perfil',{
        nombrePagina:"Edita tu perfil en DevJobs",
        usuario:usuario,
        cerrarSesion:true,
        nombre:usuario.name
    })
}

//Guardar cambios editar perfil
exports.editarPerfil = async (req,res) => {
    const infouser = {}
    infouser.name = req.user.nombre;
    infouser.email = req.user.email;
    const errors = []

    if(!req.body.nombre){
        errors.push({text:'El nombre es obligatorio'})
    }

    if(!req.body.email){
        errors.push({text:'Debe ingresar su correo electrónico'});
    }

    if(errors.length > 0){
        res.render('editar-perfil',{
            nombrePagina:"Edita tu perfil en DevJobs",
            usuario:infouser,
            cerrarSesion:true,
            nombre:infouser.name,
            errors
        })
    }else{
        //verificar que el correo no exista en la BD
        const emailUser = await Usuarios.findOne({email:req.body.email});
        if (emailUser) {
            req.flash('error_msg','Correo electrónico existente, ingresa otro');
            res.redirect('/editar-perfil');
        } else {
            const usuario = await Usuarios.findById(req.user._id)

            usuario.nombre = req.body.nombre;
            usuario.email = req.body.email;

            if(req.body.password){
                usuario.password = req.body.password;
            }

            if(req.file){
                usuario.imagen = req.file.filename;
            }

            await usuario.save();

            req.flash('success_msg','Cambios guardados correctamente');
            res.redirect('/administracion');
        }
    }

}

exports.subirImagen = (req,res,next) => {
    upload(req,res,function(error){
        if(error instanceof multer.MulterError){
            return next();
        }
    })
    next()
}

//opciones de multer
const configuracionMulter = {
    //para almacenar en el servidor
    storage:fileStorage = multer.diskStorage({
        destination:(req,file,cb) => { //donde se guardarán las img que suben los usuarios
            cb(null,path.join(__dirname,'../public/uploads/perfiles'))
        },
        filename: (req,file,cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null,`${shortid.generate()}.${extension}`); //nombre con el que se guardará la img
        }
    }),
    fileFilter(req,file,cb){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            //callback se ejecuta como true o false :::> true cuando la img se acepta
            cb(null,true);
        }else{
            cb(null,false);
        }
    },
    limits:{fileSize:100000}
}

const upload = multer(configuracionMulter).single('imagen');
