console.log("trabajando notas.js");
import { showDangerToast } from "/static/melody/js/toastDemo.js";
import { showWarningToast } from "/static/melody/js/toastDemo.js";

console.log("Trabajando gestion.js");
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
$(document).on('click', '#btn-note', function () {
    $(this).prop('disabled', true);
    $("#div-asistencia").prop('hidden', true);
    $("#div-assistance").empty();
    $("#div-assistance").load('Notas/');
    let id = $("#id-classroom").val();

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "Notas/GetHorario/" + id + "/",
        data: "",
        success: function (response) {
            let schedule = $("#id_schedule");
            $("#id_schedule").empty();
            schedule.append($("<option></option>").attr("value", "0").text("Seleccione un Horario"));
            if (response != 'error') {
                let day = "";
                var resp = JSON.parse(response);
                if (resp.length > 0) {
                    for (var n in resp) {
                        switch (JSON.parse(response)) {
                            case 'LUN':
                                day = "Lunes";
                                break;
                            case 'MAR':
                                day = "Martes";
                                break;
                            case 'MIE':
                                day = "Miercoles";
                                break;
                            case 'JUE':
                                day = "Jueves";
                                break;
                            case 'VIE':
                                day = "Viernes";
                                break;
                            case 'SAB':
                                day = "Sabado";
                                break;


                            default:
                                day = "Domingo";
                                break;
                        }
                        schedule.append($("<option></option>").attr("value", JSON.parse(response)[n].idArea).text(JSON.parse(response)[n].area + "/" + day + "/" + JSON.parse(response)[n].horaInicio + "/" + JSON.parse(response)[n].horaFin));

                    }
                } else {
                    error("No Existen Horarios Asociados a esta Aula ...ve al Modulo de Horarios para Asignar un Horario a Esta Aula e Intentalo Nuevamente")
                }


            } else {
                schedule.append($("<option></option>").attr("value", "null").text("No Existen Horarios Asociados a esta Aula"));

            }
        }
    });

});

$(document).on('change', '#id_schedule', function () {
    $(this).prop("disabled", true);
    let area = $("#id_schedule option:selected").val();
    let area2 = $("#id_schedule option:selected").text();
    let parseArea = area2.split("/")[0];
    if (area == '0') {
        showDangerToast("Seleccione una Opción Valida");
        $("#guy").prop("disabled", true);
        $("#unit").prop("disabled", true);


    } else {
        $("#area").empty();
        $("#area").text(parseArea);
        $("#operation_detail").text("Registrar Notas del Area " + parseArea + " " + "Unidad : ? " + " " + "Tipo : ?");
        $("#guy").prop("disabled", false);
        $("#area-hidden").val(area);
        showWarningToast("Correcto..Ahora Selecciona un Tipo");
    }



});
$(document).on('change', '#unit', function () {
    $(this).prop("disabled", true);

    let area = $("#id_schedule option:selected").text();
    let unidad = $("#unit option:selected").val();
    let guy = $("#guy option:selected").val();
    let id_classroom = $("#id-classroom").val();
    let table = $("#order-listing7").DataTable();
    let num = $("#num-guy").text();
    let parseArea = area.split("/")[0];

    if (unidad == '0') {
        showDangerToast("Seleccione una Unidad Valida");
        table.clear().draw();

    } else {
        table.clear().draw();
        $("#operation_detail").empty();
        $("#operation_detail").text("Registrar Notas del Area " + parseArea + " " + "Unidad : " + unidad + " " + " " + guy + " " + num);
        let data = { 'unidad': unidad, 'tipo': guy + "-" + num };
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "Notas/GetStudentsNote/" + id_classroom + "/",
            data: data,
            headers: { "X-CSRFToken": csrftoken },

            success: function (response) {
                let student = JSON.parse(response);
                for (var n in student) {
                    let newrow = [student[n].idAlumno, student[n].apellidos, student[n].nombres, student[n].numeroNotas, '<div class="row"><div class="col-6"> <button class="btn btn-primary" id="btn-modal-note" title="Click para Asignar Notas"> <i class="fas fa-magic"></i>   </button> </div> <div class="col-6"> <button class="btn btn-info" id="btn-modal-note-all" title="Click para ver Todas las Notas"> <i class="fas fa-eye"></i>   </button>   </div>  </div>'];
                    table.row.add(newrow).draw();
                }
                $("#btn-report-all").prop("hidden", false);

            }
        });


    }
});
function funguy(guy) {
    let area = $("#id_schedule option:selected").text();
    let unidad = $("#unit option:selected").val();
    let parseArea = area.split("/")[0];

    swal({
        title: 'Ingrese el Numero de ' + guy,
        icon: 'info',
        content: {
            element: "input",
            attributes: {
                placeholder: "Ingrese el Numero",
                type: "text",
                class: 'form-control',


            },
        },
        button: {
            confirm: {
                text: "OK",
                value: false,
                visible: true,
                className: "btn btn-primary"
            }
        }
    }).then((value) => {
        var res = $.trim(value);
        if (res) {
            $("#operation_detail").empty();
            $("#operation_detail").text("Registrar Notas del Area " + parseArea + " " + "Unidad : " + unidad + " " + " " + guy + " " + value);
            $("#unit").prop("disabled", false);
            $("#num-guy").text(value);
            showWarningToast("Correcto..Ahora Selecciona una Unidad");

        } else {
            funguy(guy);
        }
    });
}
$(document).on('change', '#guy', function () {
    $(this).prop("disabled", true);

    let guy = $("#guy option:selected").val();
    if (guy == '0') {
        showDangerToast("Selecciona un Tipo Valido");
    } else {
        funguy(guy);
    }
});

var column = '';
$(document).on('click', '#btn-modal-note', function () {
    let row = $(this).closest('tr');
    column = $(row.find('td')[3]);
    let id = $(row.find('td')[0]).text();
    let student_surnames = $(row.find('td')[1]).text();
    let student_names = $(row.find('td')[2]).text();

    $("#modal-note").modal();
    $(".modal-title-note-student").text("Registrar Nota del Alumno" + " " + student_surnames + " " + student_names);
    $("#id-student").val(id);
});

$(document).on('click', '#save-note-modal', function () {
    let description = $("#description").val();
    let note = $("#puntaje").val();
    let classroom = $("#id-classroom").val();
    let student = $("#id-student").val();
    let area = $("#area-hidden").val();
    let tipo = $("#guy option:selected").val();
    let unidad = $("#unit option:selected").val();
    let cantidad = parseInt(column.text());
    let num = $("#num-guy").text();

    if (description == "" || note == "") {
        error("Complete Todos Los Campos");
    } else {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "Notas/SaveNote/",
            data: JSON.stringify({
                description: description,
                note: note,
                classroom: classroom,
                student: student,
                area: area,
                tipo: tipo + "-" + num,
                unidad: unidad,
            }),
            headers: { "X-CSRFToken": csrftoken },
            success: function (response) {
                if (response.response == 'success') {
                    confirmation("Nota Asignada Correctamente");
                    column.text(cantidad + 1);
                } else {
                    error("Hubo un Error Revisa todos los Campos Y Vuelve a Intentarlo");
                }
            }
        });
    }
});
$(document).on('click', '#new-note-modal', function () {
    let description = $("#description").val("");
    let note = $("#puntaje").val("");
});

$(document).on('click', '#btn-modal-note-all', function () {
    let id = $(this).closest('tr');
    let Alumno = $(id.find('td')[0]).text();

    let surnames = $(id.find('td')[1]).text();
    let names = $(id.find('td')[2]).text();
    let student = surnames + " " + names;
    let area = $("#id_schedule option:selected").text();
    let unidad = $("#unit option:selected").val();
    let guy = $("#guy option:selected").val();
    let num = $("#num-guy").text();
    let idaula = $("#id-classroom").val();
    let idalumno = $(id.find('td')[0]).text().trim();

    let area_hidden = $("#area-hidden").val();
    let parseArea = area.split("/")[0];
    $("#modal-note-all").modal();
    $(".notes-students").text("Lista de Notas Registradas del Estudiante " + student);
    $("#area-modal").text(parseArea);
    $("#guy-modal").text(guy + "-" + num);
    $("#unit-modal").text(unidad);
    $("#id_alumno_modal").val(Alumno);
    let data = { 'unidad': unidad, 'tipo': guy + "-" + num };
    let table = $("#order-listing8").DataTable();
    table.clear().draw();
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "Notas/GetNotes/" + idaula + "/" + idalumno + "/" + area_hidden + "/",
        data: data,
        success: function (response) {
            let datos = JSON.parse(response);
            if (datos.length > 0) {
                for (var n in datos) {
                    let newrow = [datos[n].idNota, datos[n].descripcion, datos[n].calificativo, '<div class="row"> <div class="col-4"> <button class="btn btn-info" title="Click para Modificar" id="modificar-nota"><i class="fas fa-edit"></i></button><button class="btn btn-danger" id="cancel-note" hidden>Cancelar</button></div><div class="col-8" id="div-opciones-notas" hidden><input type="text" id="calificativo" placeholder="Nueva Nota"><button class="btn btn-success" title="Click para Actualizar Cambio" id="modificar-nota-guardar"><i class="fas fa-upload"></i> </button></div></div>'];
                    table.row.add(newrow).draw();
                }
            } else {
                error("A este Estudiante aun no se le ha Asignado ninguna Calificación");
            }
        }
    });

});
$(document).on('click', '#modificar-nota', function () {
    $(this).hide();
    $("#div-opciones-notas").prop('hidden', false);
    $("#cancel-note").prop('hidden', false);


});
$(document).on('click', '#cancel-note', function (e) {
    e.preventDefault();
    $("#modificar-nota").show();
    $("#div-opciones-notas").prop('hidden', true);
    $("#cancel-note").prop('hidden', true);


});
$(document).on('click', '#modificar-nota-guardar', function () {
    let table = $("#order-listing8").DataTable();
    let row = $(this).closest('tr');
    let rowindex = table.row(row).index();
    let id_note = $(row.find('td')[0]).text().trim();
    let new_value = $(row.find('input')).val();
    if (new_value == "") {
        error("No se Actualizo la calificación porque no Ingresaste un nuevo Valor");
    } else {
        $.ajax({
            type: "PUT",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "Notas/UpdateNote/" + id_note + "/",
            data: JSON.stringify({ new_value: new_value }),
            headers: { "X-CSRFToken": csrftoken },

            success: function (response) {
                if (response.response == 'success') {
                    table.cell(rowindex, 2).data(new_value);
                    table.draw();
                    confirmation("Nota Actualizada Correctamente");
                    $("#modificar-nota").show();
                    $("#div-opciones-notas").prop('hidden', true);
                    $("#cancel-note").prop('hidden', true);
                } else {
                    error("Error al modificar la Calificación...Intentalo Nuevamente");
                }
            }
        });
    }
});
$(document).on('click', '#new-operation', function () {
    let table = $("#order-listing7").DataTable();
    table.clear().draw();
    $("#id_schedule").val("0");
    $("#guy").val("0");
    $("#unit").val("0");
    $("#area").text("");
    $("#num-guy").text("1");
    $("#operation_detail").text("");
    $("#guy").prop("disabled", true);
    $("#unit").prop("disabled", true);
    $("#id_schedule").prop("disabled", false);
    $("#btn-report-all").prop("hidden", true);



});
$(document).on('click', '#pdf-selected-student', function () {
    let classroom = $("#id-classroom").val();
    let alumnos = $("#id_alumno_modal").val();
    let areas = $("#area-hidden").val();
    let tipos = $("#guy-modal").text();
    let unidad = $("#unit option:selected").val();
    let institucions = $("#current_institution option:selected").text();
    let periodo = $("#current_period option:selected").val();
    let data = {
        unidad: unidad,
        areas: areas,
        tipos: tipos,
        institucions: institucions,
        alumnos: alumnos,
        periodo: periodo

    };
    $.ajax({
        type: "POST",
        url: "Notas/pdfSelected/",
        data: JSON.stringify(data),
        headers: { "X-CSRFToken": csrftoken },
        success: function (response) {
            $("#myModal").modal();
            $("#modal-note-all").modal('hide');

            $("#pdf").html(response);

        }
    });


});
$(document).on('click', '#close-pdf', function () {
    $('#pdf').empty();
    $('#myModal').modal('hide');
});
$(document).on('click', '#generate', function () {
    $.ajax({
        type: "POST",
        url: "Notas/Generate/",
        data: { 'html': $('#pdf')[0].outerHTML },
        headers: { "X-CSRFToken": csrftoken },

        success: function (data) {
            var blob = new Blob([data], { type: 'application/pdf' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = "Reporte.pdf";
            link.click();
            $("#myModal").modal('hide');
            confirmation("PDF generado Correctamente || Revisa tu carpeta de Descargas");
        }
    });

});
$(document).on('click', '#btn-report-all', function () {
    let nombre_aula = $("#name-classroom").val();
    let idarea = $("#area-hidden").val();
    let areas = $("#area").text();
    let num = $("#num-guy").text();
    let tipos = $("#guy option:selected").val();
    let unidad = $("#unit option:selected").val();
    let institucions = $("#current_institution option:selected").text();
    let periodo = $("#current_period option:selected").text();
    var alumnos = [];
    $('#order-listing7 tr').slice(1).each(function (indexInArray, valueOfElement) {
        alumnos.push($(this).find('td:eq(0)').text());

    });

    let data = {
        unidad: unidad,
        areas: areas,
        tipos: tipos + "-" + num,
        institucions: institucions,
        alumnos: alumnos,
        periodo: periodo,
        nombre_aula: nombre_aula,
        idarea: idarea,

    };
    $.ajax({
        type: "POST",
        url: "Notas/Export/",
        xhrFields: {
            responseType: 'blob'
        },
        data: JSON.stringify(data),
        headers: { "X-CSRFToken": csrftoken },
        success: function (response) {
            // para verificar si el navegador es Internet Explorer COMPATIBLE CON msSaveOrOpenBlob
            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(response, "'" + nombre_aula + "'.xlsx");
            } else {
                var a = document.createElement("a");
                a.href = window.URL.createObjectURL(response);
                a.download = "'" + nombre_aula + "'.xlsx";
                a.click();
                confirmation("Excel Generado Correctamente.|Revisa tu Carpeta de Descargas");
            }
        }
    });
});
function confirmation(text) {
    swal({
        title: "Confirmación",
        text: text,
        icon: 'success',
        button: {
            class: 'btn btn-success',
            text: 'OK',
        }
    }).then((value) => {

    });
}
function error(text) {
    swal({
        title: "ERROR",
        text: text,
        icon: 'error',
        button: {
            class: 'btn btn-danger',
            text: 'OK',
        }
    });
}



