const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const vacantesController = require("../controllers/vacantesController");
const usuariosController = require("../controllers/usuariosController");
const authController = require("../controllers/authController");
const { check } = require("express-validator");

module.exports = () => {
  //home
  router.get("/", homeController.mostrarTrabajo);

  //CREAR VACANTE
  router.get(
    "/vacantes/nueva",
    authController.verificarUsuario,
    vacantesController.formularioNuevaVacante
  );
  router.post(
    "/vacantes/nueva",
    authController.verificarUsuario,
    [
      check("titulo").not().isEmpty().trim().escape(),
      check("empresa").not().isEmpty().trim().escape(),
      check("ubicacion").not().isEmpty().trim().escape(),
      check("salario").not().isEmpty().trim().escape(),
      check("contrato").not().isEmpty().trim().escape(),
      check("skills").not().isEmpty().trim().escape(),
    ],
    vacantesController.agregarVacante
  );

  //MOSTRAR VACANTE
  router.get("/vacantes/:url", vacantesController.mostrarVacante);

  //EDITAR VACANTE
  router.get(
    "/vacantes/editar/:url",
    authController.verificarUsuario,
    vacantesController.formEditarVacante
  );
  router.post(
    "/vacantes/editar/:url",
    authController.verificarUsuario,
    vacantesController.editarVacante
  );

  //ELIMINAR VACANTE
  router.delete('/vacantes/eliminar/:id',vacantesController.eliminarVacante);

  //CREAR CUENTA
  router.get("/crear-cuenta", usuariosController.formCrearCuenta);
  router.post(
    "/crear-cuenta",
    [
      check("nombre").not().isEmpty().trim().escape(),
      check("email").isEmail().normalizeEmail().not().isEmpty(),
      check("password").isLength({ min: 6 }).not().isEmpty().trim().escape(),
      check("confirmar").isLength({ min: 6 }).not().isEmpty().trim().escape(),
    ],
    usuariosController.crearUsuario
  );

  //Autenticar usuarios
  router.get("/iniciar-sesion", usuariosController.formIniciarSesion);
  router.post(
    "/iniciar-sesion",
    [
      check("email").isEmail().normalizeEmail().not().isEmpty(),
      check("password").isLength({ min: 6 }).not().isEmpty().trim().escape()
    ],
    authController.autenticarUsuario
  );

  //cerrar sesión
  router.get(
    "/cerrar-sesion",
    authController.verificarUsuario,
    authController.cerrarSesion
  );

  //Panel de Administración
  router.get(
    "/administracion",
    authController.verificarUsuario,
    authController.mostrarPanel
  );

  //Formulario editar perfil
  router.get(
    "/editar-perfil",
    authController.verificarUsuario,
    usuariosController.formEditarPerfil
  );

  //Editar perfil
  router.post(
    "/editar-perfil",
    authController.verificarUsuario,
    [
      check("nombre").not().isEmpty().trim().escape(),
      check("email").isEmail().normalizeEmail().not().isEmpty(),
      check("password").isLength({ min: 6 }).not().isEmpty().trim().escape()
    ],
    usuariosController.subirImagen,
    usuariosController.editarPerfil
  );

  return router;
};
