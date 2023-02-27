console.log("Trabajando period.js");
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
$(document).on('click', '#period-save', function (e) {
    e.preventDefault();
    let tableadd=$("#order-listing").DataTable();

    let description = $("#period-description").val();
    let start_date = $("#start-date").val();
    let finish_date = $("#finish-date").val();
    let table = $("#order-listing")
    var fecha = new Date(start_date);
    var fechaFormateada = fecha.getFullYear() + "-" + (fecha.getMonth() + 1).toString().padStart(2, "0") + "-" + fecha.getDate().toString().padStart(2, "0");
    var fecha2 = new Date(finish_date);
    var fechaFormateada2 = fecha2.getFullYear() + "-" + (fecha2.getMonth() + 1).toString().padStart(2, "0") + "-" + fecha2.getDate().toString().padStart(2, "0");
    let fecha_inicio = fecha.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
    let fecha_fin = fecha2.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });

    if (description === "" || start_date === "" || finish_date === "") {
        swal({
            title: "Error de Manejo de Software",
            text: "Por Favor Complete Todos los Campos",
            icon: "error",
            button: {
                value: true,
                visible: true,
                className: "btn btn-danger"
            }
        })
    } else {
        let data = { description: description, start_date: fechaFormateada, finish_date: fechaFormateada2 };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "PeriodSave/",
            data: JSON.stringify(data),
            headers: { "X-CSRFToken": csrftoken },
            success: function (response) {
                let res = response.response
                if (res == 'error') {
                    error("Hubo Un Error al Registrar..Intentalo Nuevamente");

                } else {
                    if (response.response == 'existe') {
                        error("El Periodo con ese Nombre ya se encuentra Registrado");
                    } else {
                        let newrow=[ res.idPeriodo,res.descripcion,fecha_inicio,fecha_fin,'<input style="border: none;text-align:center;" class="btn-success" value="Activo" disabled>','<div class="row"><div class="col-6"><button style="border: none;" type="button" class="btn-delete" title="Eliminar"><i class="fas fa-times-circle"></i></button></div><div class="col-6"><button style="border: none;" class="btn-estado" type="button" title="Click para Cambiar Estado"><i class="fas fa-history"></i></button></div>    </div>'];

                        tableadd.row.add(newrow).draw();
                        tableadd.order([0,'desc']).draw();
                        confimation("Periodo Registrado Correctamente");
                    }
                }

            }
        });
    }


});
$(document).on('click', '.btn-delete', function () {
    let row = $(this).closest('tr');
    let index=$("#order-listing").DataTable().row(row).index();
    let id = $(row.find('td')[0]).text().trim();
    let period_description = $(row.find('td')[1]).text().trim();
    swal({
        title: "¿Seguro de Eliminar el Periodo " + " " + period_description + "?",
        text: "Una vez eliminado no hay marcha Atras",
        icon: "warning",
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
                closeModal: true,
            },
        },


    }).then((value => {
        if (value == true) {
            $.ajax({
                type: "DELETE",
                url: "PeriodDelete/" + id + "/",
                data: "",
                dataType: "json",
                headers: { "X-CSRFToken": csrftoken },

                success: function (response) {
                    if (response.response == 'success') {
                        $("#order-listing").DataTable().row(index).remove().draw();
                        confimation("Registro Eliminado Correctamente");
                    } else {
                        error("Error al Eliminar...Intentalo Nuevamente");
                    }
                }
            });
        }
    }
    ));
});
$(document).on('click', '.btn-estado', function () {
    let row = $(this).closest('tr');
    let id = $(row.find('td')[0]).text().trim();
    let period_description = $(row.find('td')[1]).text().trim();
    let period_status = $(row.find('td').find('input')).val();
    swal({
        title: "¿Seguro de Cambiar de Estado el Periodo " + " " + period_description + "?",
        text: "Actualmente se Encuentra" + " " + period_status + "",
        icon: "warning",
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
                closeModal: true,
            },
        },


    }).then((value => {
        if (value == true) {
            $.ajax({
                type: "PUT",
                url: "PeriodStateUpdate/" + id + "/",
                data: "",
                dataType: "json",
                headers: { "X-CSRFToken": csrftoken },

                success: function (response) {
                    if (response.response != 'error') {
                        let column = $(row.find('td')[4]);
                        column.empty();
                        if (response.response == 'ACT') {
                            column.append('<input style="border: none;text-align:center;" type="text" class="btn-success" disabled value="Activo">');
                        } else {

                            column.append('<input style="border: none;text-align:center;" type="text" class="btn-danger" disabled value="Inactivo">');



                        }

                        confimation("Estado Cambiado Correctamente");
                    } else {
                        error("Error al Cambiar de Estado...Intentalo Nuevamente");
                    }
                }
            });
        }
    }
    ));
});
function error(text) {
    swal({
        title: "ERROR",
        text: text,
        icon: "error",
        button: {
            value: true,
            class: 'btn btn-danger',
            title: 'OK',
        }
    });
}
function confimation(text) {
    swal({
        title: "Confirmación",
        text: text,
        icon: "success",
        button: {
            value: true,
            class: 'btn btn-success',
            title: 'OK',
        }
    });
}