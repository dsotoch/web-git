import { showWarningToast } from "/static/melody/js/toastDemo.js";
import { showDangerToast } from "/static/melody/js/toastDemo.js";

console.log("trabajando horario.js");
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
$(document).on('change', '#turno', function () {
    var nivel = $("#turno option:selected").val();
    if (nivel == '0') {
        showWarningToast('Selecciona una Turno Valido');
        $("#btnsave").attr("disabled", true);

    } else {
        $("#btnsave").attr("disabled", false);

    }
});
$(document).on('change', '#dia', function () {
    var nivel = $("#dia option:selected").val();
    if (nivel == '0') {
        showWarningToast('Selecciona un Día Valido');
        $("#btnsave").attr("disabled", true);

    } else {
        $("#btnsave").attr("disabled", false);

    }
});
$(document).on('change', '#area', function () {
    var nivel = $("#area option:selected").val();
    if (nivel == '0') {
        showWarningToast('Selecciona una Area Valida');
        $("#btnsave").attr("disabled", true);

    } else {
        $("#btnsave").attr("disabled", false);

    }
});

$(document).on('click', '#btnsave', function (e) {
    e.preventDefault();
    var turno = $("#turno option:selected").val();
    var turnito = $("#turno option:selected").text();


    var dia = $("#dia option:selected").val();
    var dia2 = $("#dia option:selected").text();

    var area = $("#area option:selected").val();
    var area2 = $("#area option:selected").text();
    var horainicio = $("#horainicio").val();
    var horafin = $("#horafin").val();
    var cantidad = parseInt($("#cantidad_areas").val());
    const table = $("#order-listing").DataTable();
    if (horainicio == "" || horafin == "") {
        showWarningToast("Completa Todos los Campos");
    } else {
        if (turno == '0' || dia == '0' || area == '0') {
            showWarningToast("Completa Todos los Campos");

        } else {
            try {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: "HorarioSave/",
                    data: JSON.stringify({ 'turno': turno, 'dia': dia, 'area': area, 'horainicio': horainicio, 'horafin': horafin }),
                    contentType: 'application/json; charset=utf-8',
                    headers: { "X-CSRFToken": csrftoken },
                    success: function (response) {
                        var data = response.response;
                        if (data == 'error') {
                            alert("Error al Registrar...Intentalo Nuevamente");

                        } else {
                            let newrow = [data.idHorario, area2, turnito, dia2, horainicio, horafin, '<input style="border: none;text-align:center;" type="text" class="btn-success" value="Activo" disabled>', '<div class="row"><div class="col-3 "><button style="border: none;" type="button" class="btn-aula" title="Asignar Aulas"><i class="fas fa-fighter-jet"></i>  </button>  </div> <div class="col-3 "><button style="border: none;" type="button" class="btn-edit" title="Editar" data-toggle="modal" data-target="#exampleModalCenter2"><i class="fas fa-edit"></i> </button> </div> <div class="col-3 "><button style="border: none;" type="button" class="btn-delete" title="Eliminar"><i class="fas fa-times-circle"></i></button></div><div class="col-3"><button style="border: none;" class="btn-estado" type="button" title="Click para Cambiar Estado"><i class="fas fa-history"></i></button></div></div>'];
                            table.row.add(newrow).draw();
                            table.order([0, 'desc']).draw();
                            $("#cantidad_areas").val(cantidad + 1);
                            confirmation("Horario Registrado Correctamente");

                        }





                    }, error: function (param) {
                        alert(param);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
    }
});

$(document).on('change', '#select-institucion', function () {
    var id = $("#select-institucion option:selected").val();
    if (id == '0') {
        window.location.reload();
    } else {
        $.ajax({
            url: 'chosenInstitution/' + id + '/',
            type: 'GET',
            success: function (response) {
                $("#chosen").html(response);
            }
        });
    }

});
$(document).on('click', '.btn-delete', function (e) {
    e.preventDefault();
    let row = $(this).closest('tr');
    let index = $("#order-listing").DataTable().row(row).index();

    let id = $(row.find('td')[0]).text().trim();
    let turno = $(row.find('td')[2]).text();
    let dia = $(row.find('td')[3]).text();
    let area = $(row.find('td')[1]).text();
    let horainicio = $(row.find('td')[4]).text();
    let horafin = $(row.find('td')[5]).text();
    let cantidad = parseInt($("#cantidad_areas").val());

    swal({
        title: '¿Seguro de Eliminar el Horario?',
        text: dia + " " + turno + " " + area + " " + horainicio + " " + horafin,
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
            $.ajax({
                type: "DELETE",
                url: 'HorarioDelete/' + id + '/',
                headers: { "X-CSRFToken": csrftoken },
                success: function (response) {
                    if (response.response == 'success') {
                        $("#order-listing").DataTable().row(index).remove().draw();
                        $("#cantidad_areas").val(cantidad - 1);
                        confirmation("Registro Eliminado Correctamente");

                    } else {
                        alert("Error al Eliminar ...Intentalo Nuevamente");
                    }
                }
            });
        }
    });
});
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
            const table = $("#order-listing");
            var row = $(this).closest('tr');
            var id = $(row.find('td')[0]).text().trim();

            $.ajax({
                type: "PUT",
                url: "HorarioStatusChange/" + id + "/",
                data: "",
                dataType: "json",
                ContentType: 'application/json;charset=utf-8',
                headers: { "X-CSRFToken": csrftoken },
                success: function (response) {
                    if (response.response != 'error') {
                        let column = $(row.find('td')[6]);
                        let nuevovaloractivo = $('<input style="border: none;text-align:center;" type="text" class="btn-success" disabled value = "Activo" > ')
                        let nuevovalorinactivo = $('<input style="border: none;text-align:center;" type="text" class="btn-danger" disabled value = "Inactivo" > ')

                        if (response.response == 'ACT') {

                            column.empty().append(nuevovaloractivo);

                        } else {
                            column.empty().append(nuevovalorinactivo);

                        }

                        confirmation("Estado Cambiado Correctamente");



                    } else {
                        alert("Error al Cambiar de Estado...Intentalo Nuevamente");
                    }



                }, error: function (error) { alert(error.response) }
            });
        }
    });


});
$(document).on('change', '#nivelmodal', function () {
    let sel = $("#nivelmodal option:selected").val();
    if (sel == '0') {
        showWarningToast("Seleccione una Opción Valida");
        $("#editar").prop('disabled', true);

    } else {
        $("#editar").prop('disabled', false);
    }
});
$(document).on('change', '#turno2', function () {
    var nivel = $("#turno2 option:selected").val();
    if (nivel == '0') {
        showWarningToast('Selecciona una Turno Valido');
        $("#btnsavemodal").attr("disabled", true);

    } else {
        $("#btnsavemodal").attr("disabled", false);

    }
});
$(document).on('change', '#dia2', function () {
    var nivel = $("#dia2 option:selected").val();
    if (nivel == '0') {
        showWarningToast('Selecciona un Día Valido');
        $("#btnsavemodal").attr("disabled", true);

    } else {
        $("#btnsavemodal").attr("disabled", false);

    }
});
$(document).on('change', '#area2', function () {
    var nivel = $("#area2 option:selected").val();
    if (nivel == '0') {
        showWarningToast('Selecciona una Area Valida');
        $("#btnsavemodal").attr("disabled", true);

    } else {
        $("#btnsavemodal").attr("disabled", false);

    }
});
var turnito = "";
var area2 = "";
var dia2 = "";
var row = "";
$(document).on('click', '.btn-edit', function () {
    row = $(this).closest('tr');
    let id = $(row.find('td')[0]).text().trim();
    let area = $(row.find('td')[1]).text().trim();
    let turnito = $(row.find('td')[2]).text().trim();
    let dia = $(row.find('td')[3]).text().trim();
    let horainicio = $(row.find('td')[4]).text().toUpperCase();
    let horafin = $(row.find('td')[5]).text().toUpperCase();
    $("#turno2 option:contains('" + turnito + "')").prop("selected", true);
    $("#dia2 option:contains('" + dia + "')").prop("selected", true);
    $("#area2 option:contains('" + area + "')").prop("selected", true);
    $("#horainicio2").val(horainicio);
    $("#horafin2").val(horafin);
    $("#horariomodal").val(id);

});

$(document).on('click', '#btnsavemodal', function () {
    let tabla = $("#order-listing");
    let id = $("#horariomodal").val().trim();
    let turno = $("#turno2 option:selected").val();
    let area = $("#area2 option:selected").val();
    let dia = $("#dia2 option:selected").val();
    let horainicio = $("#horainicio2").val().split(".").join("").trim();
    let horafin = $("#horafin2").val().split(".").join("").trim();
    turnito = $("#turno2 option:selected").text();
    dia2 = $("#dia2 option:selected").text();
    area2 = $("#area2 option:selected").text();

    if (horainicio == "" || horafin == "") {
        showWarningToast("Completa Todos los Campos");
    } else {
        if (turno == '0' || dia == '0' || area == '0') {
            showWarningToast("Completa Todos los Campos");

        } else {
            swal({
                title: '¿Actualizar Horario?',
                text: "Verifica todos los Datos antes de Actualizar",
                icon: 'warning',
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
                    $.ajax({
                        type: "PUT",
                        dataType: "json",
                        url: "HorarioUpdate/" + id + "/",
                        data: JSON.stringify({ 'turno': turno, 'dia': dia, 'area': area, 'horainicio': horainicio, 'horafin': horafin }),
                        contentType: 'application/json; charset=utf-8',
                        headers: { "X-CSRFToken": csrftoken },
                        success: function (response) {
                            if (response != 'error') {
                                $(row.find('td')[1]).text((area2));
                                $(row.find('td')[2]).text((turnito));
                                $(row.find('td')[3]).text(dia2);
                                $(row.find('td')[4]).text(horainicio);
                                $(row.find('td')[5]).text(horafin);
                                confirmation("Horario Modificado Correctamente");
                            } else {
                                alert("Error al Modificar...Intentalo Nuevamente");

                            }
                        }
                    });
                }
            });


        }

    }


});
$(document).on('click', '.btn-aula', function () {
    let row = $(this).closest('tr');
    let id = $(row.find('td')[0]).text();
    window.location.href = "ClassroomAsiggn/" + id + "/";
});
var horarios = {};

$(document).on('click', '#btn-elegido', function (e) {
    e.preventDefault();
    let row = $(this).closest('tr');
    let id = $(row.find('td')[1]).text();
    let nombre = $(row.find('td')[3]).text();
    let seccion = $(row.find('td')[4]).text();
    let nivel = $(row.find('td')[5]).text();
    let institucion = $(row.find('td')[2]).text();



    let divtag = $('#row2');
    if (horarios.hasOwnProperty(id)) {
        showWarningToast("Ya Elegiste Esa Aula...Escoge Otra!");
    } else {
        divtag.append("<div title='Institucion:" + institucion + "' class='col-12  btn-info' ><input style='border:none;' class=' btn-info col-10' value='" + nombre + seccion + " " + nivel + "' id='" + id + "' disabled> <button title='Quitar' class='btn-info col-1 eliminar' style='color:white;border:none;'>X</button> </div>");
        horarios[id] = id;
    }

    $(document).on('click', '.eliminar', function (e) {
        e.preventDefault();
        let remove = $(this).closest('div');

        let element = $(remove.find('input')).attr('id');

        delete horarios[element];
        remove.remove();

    });
});
$(document).on('click', '#btn-asignar', function () {
    let id = $('#aula-id').val();
    if ((Object.keys(horarios).length == 0)) {
        showWarningToast("No hay Aulas para Asignar...");
    } else {
        if ((Object.keys(horarios).length > 1)) {
            showDangerToast("Error.Solo Debes de Elegir una Aula");

        } else {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/Horario/ClassroomDataAssign/" + id + "/",
                data: JSON.stringify({ 'data': horarios }),
                headers: { "X-CSRFToken": csrftoken },
                success: function (response) {
                    let d = response.response;
                    if (response.response != 'error') {

                        confirmation2("Aulas Asignadas Correctamente");
                    } else {
                        alert("Error al Asignar Aulas...Intentalo Nuevamente");
                    }
                }, error: function (params) {
                    showWarningToast("ERROR..Algunas Aulas ya se Encuentran Asignadas..Intentalo Nuevamente")
                }
            });
        }

    }
});
$(document).on('click', '.details', function () {
    let nivel = $(this).val().split('-');
    let nivel2 = nivel[1];
    let id = $(this).attr('id');
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/Horario/ClassroomDetails/" + id + "/",
        data: "",
        headers: { "X-CSRFToken": csrftoken },
        success: function (response) {
            let ins = response.res;
            let d = response.response;
            if (response.response != 'error') {
                $("#institucion").text(ins.nombre);
                $("#grado").text(d.grado);
                $("#seccion").text(d.seccion);
                $("#nivel").text(nivel2);
                $("#idAula").val(id);
                if (d.estado == 'ACT') {
                    $("#estado").text('Activo');

                } else {
                    $("#estado").text('Inactivo');
                }


            } else {
                alert("Error...Intentalo Nuevamente");
            }
        }
    });
});

$(document).on('click', '#desligar', function () {
    let id = $("#idAula").val();
    let idHorario = $("#idHorario").val();
    swal({
        title: '¿Seguro de Desligar el Aula del Horario?',
        text: "Esta Operación no se puede revertir",
        icon: 'warning',
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
            $.ajax({
                type: "GET",
                url: "/Horario/UnlinkClassroom/" + id + "/" + idHorario + "/",
                data: "",
                dataType: "json",
                success: function (response) {
                    if (response.response == 'success') {
                        confirmation2("Aula desligada Correctamente");
                    } else {
                        showWarningToast("Hubo un problema al desligar ...Intentalo Nuevamente");
                    }
                }
            });
        }
    });







});

function confirmation2(text) {
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
function confirmation(text) {
    swal({
        title: "Felicitaciones",
        icon: "success",
        text: text,
        value: true,
        confirmButtonText: "Ok",
    }).then((value) => {
    });
}
