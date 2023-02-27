import { showWarningToast } from "/static/melody/js/toastDemo.js";
console.log("trabajando instituciones.js");
//const listarInstituciones = async() => {
//try {
//   const response = await fetch("./getInstituciones");
//   const data = await response.json();

//   if (data.message == "success") {
//       let datos = ``;
//       data.instituciones.forEach((instituciones) => {
//          datos += `<tr> <td> ${instituciones.idInstitucion}  </td> <td> ${instituciones.nombre}  </td> <td> ${instituciones.tipo}  </td>  <td> ${instituciones.direccion}  </td> <td> <label class="badge badge-info"> ${instituciones.estado}</label></td> <td>  <button class="btn btn-outline-primary" title="Cambiar Estado"> Cambiar </button> </td> </tr>`;
//       });

$(document).on('click', '.btn-estado', function (evento) {
    evento.preventDefault();
    swal({
        title: '¿Seguro de Cambiar de Estado?',
        text: "Puedes Cambiar de estado las veces que quieras",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3f51b5',
        cancelButtonColor: '#ff4081',
        confirmButtonText: 'Great',
        buttons: {
            cancel: {
                text: "Cancelar",
                value: null,
                visible: true,
                className: "btn btn-danger",
                closeModal: true,
            },
            confirm: {
                text: "OK",
                value: true,
                visible: true,
                className: "btn btn-primary",
                closeModal: true
            }
        }
    }).then((value) => {
        if (value == true) {
            const table = $("#order-listing").DataTable();
            var row = $(this).closest('tr');
            var data = table.row(row).data();
            var id = data[0];

            $.ajax({
                type: "PUT",
                url: "StatusUpdate/" + id + "/",
                data: "",
                dataType: "json",
                ContentType: 'application/json;charset=utf-8',
                headers: { "X-CSRFToken": csrftoken },
                success: function (response) {
                    if (response.response == 'success') {
                        confirmation("Estado Cambiado Correctamente");

                    } else {
                        alert("Error al Cambiar de Estado...Intentalo Nuevamente");
                    }



                }, error: function (error) { alert(error.response) }
            });
        }
    });


});
$(document).on('click', '.btn-delete', function () {
    try {
        var table = $("#order-listing").DataTable();
        var row = $(this).closest("tr");
        let index = $("#order-listing").DataTable().row(row).index();
        var name = table.row(row).data()[2];
        swal({
            title: '¿Seguro de Eliminar el Registro?',
            text: name,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3f51b5',
            cancelButtonColor: '#ff4081',
            confirmButtonText: 'Great',
            buttons: {
                cancel: {
                    text: "Cancelar",
                    value: null,
                    visible: true,
                    className: "btn btn-danger",
                    closeModal: true,
                },
                confirm: {
                    text: "OK",
                    value: true,
                    visible: true,
                    className: "btn btn-primary",
                    closeModal: true
                }
            }
        }).then((value) => {
            if (value == true) {
                var id = table.row(row).data()[0];
                $.ajax({
                    type: "DELETE",
                    url: "deleteInstituciones/" + id + "/",
                    headers: { "X-CSRFToken": csrftoken },
                    success: function (response) {
                        if (response.response == 'success') {
                            $("#order-listing").DataTable().row(index).remove().draw();
                            confirmation("Registro Eliminado Correctamente");
                        } else {
                            alert("Ocurrio un Error al eliminar el registro..Intentalo Nuevamente");
                        }
                    }, error: function (res) {
                        alert(res.response);
                    }
                });
            }


        });
    } catch (error) {
        alert(error);

    }

});
$(document).on('click', '.btn-edit', function (e) {
    e.preventDefault();
    try {
        const table = $("#order-listing").DataTable();
        var tipo = $("#tipo");
        var direccion = $("#direccion");
        var row = $(this).closest('tr');
        var name = table.row(row).data()[3];
        var tipo = table.row(row).data()[4];
        var id = table.row(row).data()[0];
        var direccion = table.row(row).data()[5];
        var period = table.row(row).data()[1];
        var tipos = '0';
        if (tipo == 'Publico') {
            tipos = 'PUB'
        } else {
            if (tipo == 'Privado') {
                tipos = 'PRI'
            }
        }
        $("#nombremodal").val(name);
        $("#idinstitucionmodal").val(id);
        $("#direccionmodal").val(direccion);
        $("#periodmodal option[value='" + period + "']").attr("selected", true);
        $("#tipomodal option[value='" + tipos + "']").attr("selected", true);
        $("#editar").prop('disabled', false);


    } catch (error) {
        alert(error);

    }

});
$(document).on('click', "#editar", function (evt) {
    evt.preventDefault();
    try {
        var name = $("#nombremodal").val();
        var direc = $("#direccionmodal").val();
        var tipo = $("#tipomodal option:selected").val();
        var id = $("#idinstitucionmodal").val();
        var period = $("#periodmodal option:selected").val();

        if (tipo == '0' || period == '0') {
            showWarningToast("Selecciona una Opción Valida");

        } else {
            var data = { nombre: name, tipo: tipo, direccion: direc };
            $.ajax({
                type: "PUT",
                url: "updateInstituciones/" + id + "/" + period + "/",
                data: JSON.stringify(data),
                dataType: "json",
                ContentType: 'application/json;charset=utf-8',
                headers: {
                    "X-CSRFToken": csrftoken
                },
                success: function (response) {
                    if (response != 'error') {

                        confirmation("Registro Actualizado Correctamente");
                    } else {
                        alert("Error al Editar Registro...Intentalo Nuevamente");
                    }
                }
            });

        }




    } catch (error) {
        alert(error);
    }
});


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie("csrftoken");
$("#tipo").on("change", function () {
    var tipo = $("#tipo option:selected").val();
    if (tipo == "0") {
        showWarningToast("Selecciona Una Opción Valida");
        Desactivarboton();
    } else {
        Activarboton();
    }
});

function Activarboton() {
    var button = $("#guardar");
    button.prop("disabled", false);
    button.prop("title", "Registrar Institución");
}

function Desactivarboton() {
    var button = $("#guardar");
    button.prop("disabled", true);
    button.prop("title", "Rellena todos los campos para Activar");
}
$("#guardar").on("click", function () {
    var table = $("#order-listing").DataTable();
    var tipo = $("#tipo option:selected").val();
    var period = $("#period option:selected").val();

    var nombre = $("#nombre").val();
    var direccion = $("#direccion").val();
    if (nombre == "" || direccion == "" || tipo == "0" || period == '0') {
        showWarningToast("Completa los campos Requeridos");
    } else {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "saveInstituciones/",
            data: JSON.stringify({
                nombre: nombre,
                tipo: tipo,
                direccion: direccion,
                period: period,
            }),
            ContentType: 'application/json;charset=utf-8',
            headers: { "X-CSRFToken": csrftoken },
            success: function (response) {




                confirmation("Institución Registrada Correctamente");

            },
            error: function (error) {
                alert(error);
            },
        });
    }
});

function confirmation2(text) {
    swal({
        title: "Felicitaciones",
        icon: "success",
        text: text,
        confirmButtonText: "Ok",
    }).then((value) => {
    });
}

function confirmation(text) {
    swal({
        title: "Felicitaciones",
        icon: "success",
        text: text,
        value: true,
        confirmButtonText: "Ok",
    }).then((value) => {
        window.location.reload();
    });
}







