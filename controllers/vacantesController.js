const Vacante = require("../models/Vacantes");

exports.formularioNuevaVacante = (req, res) => {
  const nombre = req.user.nombre;
  res.render("nueva-vacante", {
    nombrePagina: "Nueva Vacante",
    tagline: "Llena el formulario y publica tu vacante",
    cerrarSesion: true,
    nombre,
  });
};

//agrega vacantes a la BD
exports.agregarVacante = async (req, res) => {
  const errors = [];

  if (!req.body.titulo) {
    errors.push({ text: "Tiene que agregar un título a la vacante" });
  }

  if (!req.body.empresa) {
    errors.push({ text: "Tiene que agregar el nombre de la empresa" });
  }

  if (!req.body.ubicacion) {
    errors.push({ text: "Tiene que agregar una ubicación" });
  }

  if (!req.body.contrato) {
    errors.push({ text: "Tiene que seleccionar el tipo de contrato" });
  }

  if (!req.body.skills) {
    errors.push({ text: "Debe seleccionar al menos una habilidad" });
  }

  if (errors.length > 0) {
    res.render("nueva-vacante", {
      nombrePagina: "Nueva Vacante",
      tagline: "Llena el formulario y publica tu vacante",
      cerrarSesion: true,
      nombre,
      errors,
    });
  } else {
    const vacante = new Vacante(req.body);

    //usuario autor de la vacante
    vacante.autor = req.user._id;

    vacante.skills = req.body.skills.split(",");

    //almacenar en la BD
    const nuevaVacante = await vacante.save();

    //redireccionar
    res.redirect(`/vacantes/${nuevaVacante.url}`);
  }
};

//Mostrar una vacante
exports.mostrarVacante = async (req, res, next) => {
  const vacante = await Vacante.findOne({ url: req.params.url }).then(
    (data) => {
      return {
        id: data._id,
        titulo: data.titulo,
        empresa: data.empresa,
        ubicacion: data.ubicacion,
        salario: data.salario,
        contrato: data.contrato,
        descripcion: data.descripcion,
        url: data.url,
        skills: data.skills,
      };
    }
  );

  if (!vacante) return next();

  res.render("vacante", {
    vacante,
    nombrePagina: vacante.titulo,
    barra: true,
  });
};

exports.formEditarVacante = async (req, res, next) => {
  const nombre = req.user.nombre;
  const vacante = await Vacante.findOne({ url: req.params.url }).then(
    (data) => {
      return {
        id: data._id,
        titulo: data.titulo,
        empresa: data.empresa,
        ubicacion: data.ubicacion,
        salario: data.salario,
        contrato: data.contrato,
        descripcion: data.descripcion,
        url: data.url,
        skills: data.skills,
      };
    }
  );

  if (!vacante) return next();

  res.render("editar-vacante", {
    vacante,
    nombrePagina: `Editar - ${vacante.titulo}`,
    cerrarSesion: true,
    nombre,
  });
};

exports.editarVacante = async (req, res) => {
  const vacanteActualizada = req.body;
  vacanteActualizada.skills = req.body.skills.split(",");

  const vacante = await Vacante.findOneAndUpdate(
    { url: req.params.url },
    vacanteActualizada,
    {
      new: true,
      runValidators: true,
    }
  );

  res.redirect(`/vacantes/${vacante.url}`);
};

//eliminar vacante
exports.eliminarVacante = async (req,res) => {
  const { id } = req.params;

  const vacante = await Vacante.findById(id)

  if(verificarAutor(vacante,req.user)){
    //todo bien, el usuario puede eliminar
    vacante.remove();
    res.status(200).send('Vacante Eliminada Correctamente')
  }else{
    //no permitido
    res.status(403).send('Error')
  }
  
}

const verificarAutor = (vacante={},usuario={}) => {
  if(!vacante.autor.equals(usuario._id)){
    return false;
  }
  return true;
}
