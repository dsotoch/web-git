console.log('Trabajando Alumnos.js');
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
$(document).on('click', '#btn-save', function () {
    let formData = new FormData();
    formData.append("file", archivoParaSubir.files[0]);
    let amount = $("#amount");
    $.ajax({
        url: 'StudentsSave/',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
        headers: { "X-CSRFToken": csrftoken },

        success: function (response) {
            if (response.response == 'success') {
                confirmation("Registros Subidos Correctamente");
                amount.val(response.students_amount);
            } else {
                if (response.response == 'null') {
                    error("Error de Formato / Excel Vacio");
                } else {
                    error("Error al subir registros intentalo nuevamente");
                }
            }
        }
    });

});
$(document).on('click', '#btn-assign', function () {

    let diccionarioid = {};
    $("#order-listing tr:gt(0)").each(function () {
        var fila = $(this);
        let id = $(fila.find("td")[0]).text();
        let idaula = $(fila.find("td").find("select")).val();
        diccionarioid[id] = idaula;

    });
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/Alumnos/ClassroomAssignSave/",
        data: JSON.stringify({ 'data': diccionarioid }),
        headers: { "X-CSRFToken": csrftoken },
        success: function (response) {
            if (response.response = 'success') {

                confirmation2("Aulas Asignadas Correctamente");
            } else {
                error("ERROR..Intentalo Nuevamente");
            }
        }
    });
});
$(document).on('click', '#btn-edit', function () {
    let row = $(this).closest('tr');
    let column = $(row.find('td')[4]);
    column.empty();
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/Alumnos/ClassroomsAll/",
        data: "",
        headers: { "X-CSRFToken": csrftoken },
        success: function (response) {
            column.append('<select class="form-control classroom_select" aria-label="Default select example"><option selected value="0">Seleccione una Aula</option>')
            let column2 = $(row.find('td').find('select'));
            for (var clave in response.response) {
                column2.append("<option value=" + clave + ">" + response.response[clave] + "</option></select>");

            }

        }
    });

});

$(document).on('change', '#institution', function () {
    let value = $('option:selected', this).val();

    if (value != 'Seleccione una Institución') {
        window.location.href = "/Alumnos/InstitutionSelected/" + value + "/";

    }



});
$(document).on('click', '#btn-edit2', function () {
    let row = $(this).closest('tr');
    let column = $(row.find('td')[4]);
    let id = $("#idInstitucion").val().trim();

    column.empty();
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/Alumnos/selectedclassroominstitution/" + id + "/",
        data: "",
        headers: { "X-CSRFToken": csrftoken },
        success: function (response) {
            column.append('<select class="form-control classroom_select" aria-label="Default select example"><option selected value="0">Seleccione una Aula</option>')
            let column2 = $(row.find('td').find('select'));
            for (var clave in response.response) {
                column2.append("<option value=" + clave + ">" + response.response[clave] + "</option></select>");

            }

        }
    });

});
$(document).on('click', '#btn-newStudent', function () {
    let id = $("#idInstitucion").val();
    let column = $("#selectAula");
    column.empty();
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/Alumnos/selectedclassroominstitution/" + id + "/",
        data: "",
        headers: { "X-CSRFToken": csrftoken },
        success: function (response) {
            for (var clave in response.response) {
                column.append("<option value=" + clave + ">" + response.response[clave] + "</option></select>");

            }

        }
    });

});
$(document).on('click', '#btn-save-alumno', function () {
    let surnames = $("#apellidos").val();
    let names = $("#nombres").val();
    let grade = $("#grado").val();
    let idClassroom = $("#selectAula option:selected").val();
    let data = { surnames: surnames, names: names, grade: grade, idClassroom: idClassroom };
    if (surnames == "" || names == "" || grade == "") {
        error("Por Favor complete todos los datos del Alumno");
    } else {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "/Alumnos/SaveStudent/",
            data: JSON.stringify(data),
            headers: { "X-CSRFToken": csrftoken },
            success: function (response) {

                if (response.response == 'existe') {
                    error("Error Al Registrar Alumno..El Alumno Ya se Encuentra Registrado");

                } else {
                    if (response.response == 'success') {
                        confirmation2("Alumno Registrado Correctamente");
                    } else {
                        error("Error Al Registrar Alumno..Intentalo Nuevamente");

                    }

                }

            }
        });
    }
});

$(document).on('click', '#btn-delete-institution', function () {
    let row = $(this).closest('tr');
    var index = $("#order-listing").DataTable().row(row).index();
    let id = $(row.find('td')[0]).text().trim();
    let apellidos = $(row.find('td')[1]).text();
    let nombres = $(row.find('td')[2]).text();


    swal({
        title: 'Confirmation',
        icon: 'warning',
        text: 'Seguro de Eliminar el Alumno "' + apellidos + nombres + '"',
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
    }).then((value => {
        if (value == true) {
            $.ajax({
                type: "DELETE",
                url: "/Alumnos/DeleteStudent/" + id + "/",
                data: "",
                dataType: "json",
                headers: { "X-CSRFToken": csrftoken },

                success: function (response) {
                    if (response.response == 'success') {
                        $("#order-listing").DataTable().row(index).remove().draw();
                        confirmation("Alumno Eliminado Correctamente");
                    } else {
                        error("Error al Eliminar Alumno...Intentalo Nuevamente");
                    }
                }
            });
        }
    }));

});
$(document).on('click', '#editaralumno', function () {
    let row = $(this).closest('tr');

    let names = $(row.find('td')[2]).text();
    let surnames = $(row.find('td')[1]).text();
    let id = $(row.find('td')[0]).text().trim();
    $("#exampleModal1").modal();
    $("#nombresmodal").val(names);
    $("#apellidosmodal").val(surnames);
    $("#idmodal").val(id);


});
$(document).on('click', '#btn-edit-institution', function () {
    let row = $(this).closest('tr');
    let nombres = $("#nombresmodal").val();
    let apellidos = $("#apellidosmodal").val();
    let id = $("#idmodal").val();

    let data = { names: nombres, surnames: apellidos };

    $.ajax({
        type: "PUT",
        url: "/Alumnos/UpdateStudent/" + id + "/",
        data: JSON.stringify(data),
        dataType: "json",
        headers: { "X-CSRFToken": csrftoken },

        success: function (response) {
            if (response.response != 'error') {
                confirmation2("Alumno Editado Correctamente");
            } else {
                error("Error al Editar Alumno...Intentalo Nuevamente");
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
    })
}
function confirmation2(text) {
    swal({
        title: "Confirmación",
        text: text,
        icon: 'success',
        button: {
            class: 'btn btn-success',
            text: 'OK',
        }
    }).then((value) => {
        window.location.reload();
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