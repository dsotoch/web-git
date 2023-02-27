import { showDangerToast } from "/static/melody/js/toastDemo.js"
import { showSuccessToast } from "/static/melody/js/toastDemo.js"

$(document).on('click', '#register', function (e) {
    e.preventDefault();
    let dni = $("#dni").val();
    let nombres = $("#nombres").val();
    let apellidos = $("#apellidos").val();
    let email = $("#email").val();
    let pais = $("#pais option:selected").text();
    let password = $("#password").val();
    let check = $("#check").prop('checked');
    let csrf_token = $("#miform").find('input[name="csrfmiddlewaretoken"]').val(); // Capturamos el valor del token

    if (dni == "" || nombres == "" || apellidos == "" || email == "" || password == "") {
        showDangerToast("Error,Completa todos los Campos");
    } else {
        if (check == false) {
            showDangerToast("Error,Acepta los Terminos Y Condiciones");

        } else {
            let data = {
                'dni': dni,
                'nombres': nombres,
                'apellidos': apellidos,
                'email': email,
                'pais': pais,
                'password': password
            };
            $.ajax({
                type: "POST",
                url: "saveUser/" + dni + "/",
                data: JSON.stringify(data),
                dataType: "json",
                headers: {
                    'X-CSRFToken': csrf_token // Incluimos el token en el encabezado
                },

                success: function (response) {
                    if (response.response == 'existe') {
                        error("El Documento de Identidad ya se encuentra Registrado");
                    } else {
                        if (response.response == 'email') {
                            error("El email ya se encuentra Registrado");
                        } else {
                            if (response.response == 'error') {
                                error("Error al registrar ..Recarga la pagina e intentalo Nuevamente");

                            } else {

                                confirmation3("BIENVENIDO..Usuario creado Correctamente", dni);

                            }
                        }
                    }

                }
            });
        }
    }
});
$(document).on('click', '#comprar', function (e) {
    e.preventDefault();
    let div = $(this).closest('div');
    let input = $(div.find('input')).val();
    let licencia = "";
    let licencia2="";
    let monto = "";
    switch (input) {
        case '6':
            licencia = "PREMIUN con licencia valida para 6 Meses";
            monto = 54.90;
            licencia2="PREMIUN";

            break;
        case 'anual':
            licencia = "VIP con licencia valida para 1 Año";
            monto = 100.90;
            licencia2="VIP";

            break;

        default:
            licencia = "BASICO  con licencia valida para 1 Mes";
            licencia2="BASICO";
            monto = 10;
            break;
    }
    let data = { 'monto': monto, 'licencia': licencia }
    var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
    swal({
        title: "Confirmación de Compra",
        icon: 'warning',
        text: 'Estas a punto de Comprar el Plan ' + licencia + " con un costo de " + monto + " USD",
        buttons: {
            confirmButton: {
                value: true,
                text: "Confirmar",
                className: 'btn btn-success'

            },
            cancelButton: {
                value: null,
                text: 'Cancelar',
                className: 'btn btn-danger'
            }
        }
    }).then((value) => {
        if (value == true) {
            showSuccessToast("Espera Un Momento seras Redirigido a la pagina de Pago");
            $.ajax({
                type: "POST",
                url: "/Pagos/"+licencia2+"/",
                dataType: "json",
                data:"" ,
                headers: {
                    'X-CSRFToken': csrf_token // Incluimos el token en el encabezado
                },
                success: function (response) {
                        if(response.response=='error'){
                            error("Hubo un error al crear la Solicitud de pago,Recargue la pagina e intentalo nuevamente");
                        }else{
                            window.location.href=response.response;
                        }
                       

                    


                },
                error: function (e) {
                    console.log(e);
                    
                    error("No se pudo crear la solicitud de pago en PayPal");
                }
            });
        }
    });

});
$(document).on('click', '#cuenta', function () {
    let dni = $("#dni-user").text().trim();
    window.location.href = "/Login/Account/";
});
$(document).on('click', '#logout', function () {
    window.location.href = "/Login/logout/";
});
$(document).on('click', '#licencias', function () {
    $("#modalPlanes").modal();
});

$(document).on('click', '#resume', function (e) {
    e.preventDefault();
    let data = $("#dni-").val();
    let csrf_token = $("#miform2").find('input[name="csrfmiddlewaretoken"]').val();
    $("#resume").attr('class', "btn btn-warning btn-icon-text");
    $("#inf").attr('class', "btn btn-primary btn-icon-text");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Login/register/resume/",
        data: JSON.stringify({ 'dni': data }),
        headers: { 'X-CSRFToken': csrf_token },

        success: function (response) {
            $("#div-resume").html(response);
        }, error: function (xhr, status, error) {
            console.log(error);
            swal({
                title: "ERROR",
                icon: "error",
                text: "No tienes ninguna Transacción",
                value: true,
                confirmButtonText: "Ok",
            }).then((value) => {
        
            });
        }
    });


});
$(document).on('click', '#inf', function (e) {
    e.preventDefault();
    $("#inf").attr('class', "btn btn-warning btn-icon-text");
    $("#resume").attr('class', "btn btn-primary btn-icon-text");
    $("#div-resume").empty();

});

$(document).on('click', '#login', function (e) {
    e.preventDefault();
    let csrf_token = $("#miformlogin").find('input[name="csrfmiddlewaretoken"]').val();

    let user = $("#exampleInputEmail").val();
    let password = $("#exampleInputPassword").val();
    let dat = { 'user': user, 'password': password };
    if (user == "" || password == "") {
        error("Complete todos los Campos");
    } else {
        $.ajax({
            type: "POST",
            url: "log/",
            data: JSON.stringify(dat),
            dataType: "json",
            headers: { 'X-CSRFToken': csrf_token },

            success: function (response) {
                console.log(response);
                if (response.response == false) {
                    error("Usuario u Contraseña Incorrecta");
                } else {
                    confirmation2("Bienvenido");

                }
            }
        });
    }
});
function confirmation2(text, dni) {
    swal({
        title: "Felicitaciones",
        icon: "success",
        text: text,
        value: true,
        confirmButtonText: "Ok",
    }).then((value) => {
        window.location.href = "/Login/Account/";

    });
}
function confirmation3(text, dni) {
    swal({
        title: "Confirmación",
        icon: "success",
        text: text + " " + dni,
        value: true,
        confirmButtonText: "Ok",
    }).then((value) => {
       window.location.href='/Login/';


    });
}
function error(text) {
    swal({
        title: "ERROR",
        icon: "error",
        text: text,
        value: true,
        confirmButtonText: "Ok",
    }).then((value) => {

    });
}
