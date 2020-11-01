import axios from 'axios';
import Swal from 'sweetalert2'

document.addEventListener('DOMContentLoaded', () => {

    const skills = document.querySelector('.lista-conocimientos');

    //Limpiar las alertas
    let alertas = document.querySelector('.alerta');

    if(alertas){
        limpiarAlertas();
    }

    if(skills){
        skills.addEventListener('click', agregarSkills);

        //función para editar la lista de conocimientos
        skillSeleccionados();
    }

    const vacantesListado = document.querySelector('.panel-administracion')

    if(vacantesListado){
        vacantesListado.addEventListener('click',accionesListado)
    }

})

const skills = new Set();
const agregarSkills = e => {
   
    if(e.target.tagName === 'LI'){
        if(e.target.classList.contains('activo')){
            //quitar el set y quitar la clase
            skills.delete(e.target.textContent);
            e.target.classList.remove('activo');
        }else{
            //añadir al set y agregar la clase
            skills.add(e.target.textContent);
            e.target.classList.add('activo');
        }
    }

    const skillsArray = [...skills];
    document.querySelector('#skills').value = skillsArray;
}

const skillSeleccionados = () => {
    const seleccionadas = Array.from( document.querySelectorAll('.lista-conocimientos .activo'));
    
    seleccionadas.forEach(seleccionada => {
        skills.add(seleccionada.textContent);
    })

    //inyectarlo en el hidden
    const skillsArray = [...skills];
    document.querySelector('#skills').value = skillsArray;

}

const limpiarAlertas = () => {
    const alertas = document.querySelector('.alerta');
    setInterval(() => {
        alertas.style.display = "none";
    }, 2000);
}

//eliminar vacantes
const accionesListado = e => {
    e.preventDefault();
    
    //accedemos al atributo data-eliminar de la etiqueta a, botón Eliminar. En el panel de administración
    if(e.target.dataset.eliminar){
        //eliminar por axios
        Swal.fire({
            title: '¿Segur@ que desea eliminar esta vacante?',
            text: "Una vez eliminadan, no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, Eliminar',
            cancelButtonText:'No, Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                //enviar la petición con axios
                const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;

                //axios para eliminar el registro
                axios.delete(url,{ params:{url} })
                    .then(function(respuesta){
                        if(respuesta.status === 200){
                            Swal.fire(
                                'Eliminado',
                                respuesta.data,
                                'success'
                            )

                            //Eliminar del DOM
                            e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement)
                        }
                    })
                    .catch(() => {
                        Swal.fire({
                            icon:'error',
                            title:'Hubo un error',
                            text:'No se pudo eliminar'
                        })
                    })
            }
          })
    }else if(e.target.tagName === 'A'){
        window.location.href = e.target.href;//sino ir a la ruta de las etiqueta a
    }

}
