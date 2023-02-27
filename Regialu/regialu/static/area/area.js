import { showWarningToast } from "/static/melody/js/toastDemo.js";
console.log("Trabajando area.js");
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
$(document).on('click', '#btnsave', function (e) {
    e.preventDefault();
    var description = $("#descripcion").val();
    const table = $("#order-listing").DataTable();

    if (description == "") {
        showWarningToast("Completa todos Los Campos");
    } else {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "AreaSave/",
            data: JSON.stringify({ 'data': description }),
            headers: { "X-CSRFToken": csrftoken },
            success: function (response) {
                var re = response.response;
                if (response.response == 'existe') {
                    alert("ERROR : El area ya se Encuentra Registrada...")
                } else {
                    if (response.response == 'error') {
                        alert("Error al Registrar el Area... Intentalo Nuevamente")

                    } else {
                        if (re.estado == 'ACT') {
                            let estadito = 'Activo';
                            let newrow = [re.idArea, re.descripcion, '<input style="border: none;text-align:center;" type="text" class="btn-success" disabled value="' + estadito + '">', ' <div class="row"><div class="col-6 "><button style="border: none;" type="button" class="btn-delete" title="Eliminar"><i class="fas fa-times-circle"></i></button></div><div class="col-6"><button style="border: none;" class="btn-estado" type="button" title="Click para Cambiar Estado"><i class="fas fa-history"></i></button></div></div>'];
                            table.row.add(newrow).draw();
                            table.order([0, 'desc']).draw();

                            cantidadUpdate("agregar");

                            confirmation("Area Registrada Correctamente");
                        } else {
                            let estadito = 'Inactivo';
                            let newrow = [re.idArea, re.descripcion, '<input style="border: none;text-align:center;" type="text" class="btn-success" disabled value="' + estadito + '">', ' <div class="row"><div class="col-6 "><button style="border: none;" type="button" class="btn-delete" title="Eliminar"><i class="fas fa-times-circle"></i></button></div><div class="col-6"><button style="border: none;" class="btn-estado" type="button" title="Click para Cambiar Estado"><i class="fas fa-history"></i></button></div></div>'];
                            table.row.add(newrow).draw(); 
                            table.order([0, 'desc']).draw();

                            cantidadUpdate("agregar");

                            confirmation("Area Registrada Correctamente");
                        }


                    }
                }
            }
        });
    }

});

$(document).on('click', '.btn-delete', function () {
    let row = $(this).closest('tr');
    let index = $("#order-listing").DataTable().row(row).index();
    let area = $(row.find('td')[1]).text();

    let id = $(row.find('td')[0]).text();
    swal({
        title: "Confirmación de Eliminación",
        text: "Seguro de Eliminar el Area de" + " " + area + " " + "?",
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
                url: "AreaDelete/" + id + "/",
                data: "",
                headers: { "X-CSRFToken": csrftoken },
                success: function (response) {
                    if (response.response == 'success') {
                        $("#order-listing").DataTable().row(index).remove().draw();
                        cantidadUpdate("eliminar");
                        confirmation("Registro Eliminado Correctamente");
                    } else {
                        alert("Error al Eliminar...Intentalo Nuevamente");
                    }
                }
            });
        }
    });



});
$(document).on('click', '.btn-estado', function () {
    let row = $(this).closest('tr');
    let area = $(row.find('td')[1]).text();

    let id = $(row.find('td')[0]).text();
    swal({
        text: "Seguro de Cambiar de estado el Area de" + " " + area + " " + "?",
        title: "Confirmación de Actualisación",
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
                type: "PUT",
                url: "AreaStatusChange/" + id + "/",
                data: "",
                headers: { "X-CSRFToken": csrftoken },
                success: function (response) {
                    if (response.response != 'error') {
                        let column = $(row.find('td')[2]);
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




                }
            });
        }
    });



});
function cantidadUpdate(tipo) {
    let can = parseInt($(".cantidad").val());
    if (tipo == 'agregar') {
        $(".cantidad").val(can + 1)
    } else {
        $(".cantidad").val(can - 1)
    }
}
function confirmation(text) {
    swal({
        title: "Felicitaciones",
        text: text,
        icon: "success",

    })
}

