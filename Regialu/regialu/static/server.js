$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var paymentId = urlParams.get('paymentId');
    var token = urlParams.get('token');
    var payerId = urlParams.get('PayerID');
    $("#Payment-id").html("Id. de pago" + ": " + paymentId);
    $("#token-id").html("Token de seguridad" + ": " + token);
    $("#payer-id").html("identificación del pagador" + ": " + payerId);
    var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
    if (token != null) {
        $.ajax({
            type: "POST",
            url: "Details/",
            data: JSON.stringify({ 'payment_id': paymentId, 'payer_id': payerId }),
            dataType: "json",
            headers: {
                'X-CSRFToken': csrf_token // Incluimos el token en el encabezado
            },
            success: function (response) {
                let res = JSON.parse(response);
                var tabla = $("#detalles");
                let name = "";
                let email = "";
                let monto = "";
                $.each(res.payer, function (key, value) {
                    if (key == "payer_info") {
                        tabla.append('<tr><td>Email : ' + value.email + '</td></tr>');
                        tabla.append('<tr><td>Pagador : ' + value.first_name + " " + value.last_name + '</td></tr>');
                        tabla.append('<tr><td>Codigo de Pais : ' + value.country_code + '</td></tr>');
                        tabla.append('<tr><td>Telefono : ' + value.phone + '</td></tr>');

                        $("#payer_id").text(value.payer_id);
                        email = value.email;

                    }
                });
                $.each(res.transactions[0], function (key, value) {
                    if (key == "amount") {
                        tabla.append('<tr><td>Monto : ' + value.total + " " + 'USD' + '</td></tr>');
                        $.each(res.transactions[0], function (key, value) {
                            if (key == "description") {
                                tabla.append('<tr><td>Descripción de la Compra : ' + value + '</td></tr>');
                                name = value.split('-')[1];
                            }
                        });
                        monto = value.total;


                    }
                });
                if (res.state = 'approved') {
                    $("#titulo").text("TRANSACCION APROBADA");
                    $("#div-respuesta").css('background-color', 'green');
                    let dat={ 'monto': monto, 'name': name, 'email': email ,'payment_id':paymentId,'payer_id':payerId};
                    $.ajax({
                        type: "POST",
                        url: "Details/activateLicence/",
                        data: JSON.stringify(dat),
                        dataType: "json",
                        headers: {
                            'X-CSRFToken': csrf_token // Incluimos el token en el encabezado
                        },
                        success: function (response) {
                            if(response.response==true){
                                confirmation("Muchas Gracias por su Compra ! LICENCIA ACTIVADA CORRECTAMENTE !.. Inicie Sesion Nuevamente  y el Software estara Activado");
                            }else{
                                error("Hubo un Error Al Activar la licencia ...Comuniquese con Soporte, Anote su id de Pago y su Identificacion de pagador");
                            }
                        }
                    });
                } else {
                    $("#titulo").text("TRANSACCION DENEGADA");
                    $("#div-respuesta").css('background-color', 'red');
                }

            }
        });
    } else {
        alert("error")
            ;
    }

});
function confirmation(text, dni) {
    swal({
        title: "Felicitaciones",
        icon: "success",
        text: text ,
        value: true,
        confirmButtonText: "Ok",
    }).then((value) => {
        window.location.href='/Login/logout/';


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
