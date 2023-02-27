$(document).ready(function () {

    var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
    let license = $("#lice").val();
    if (license == "") {
        license = "null";
    }
    let name=$("#dni-").val();
    $("#tipo-user").text(name);

    $.ajax({
        type: "POST",
        url: "verifi/",
        data: JSON.stringify({ 'key': license }),
        dataType: "json",
        headers: {
            'X-CSRFToken': csrf_token // Incluimos el token en el encabezado
        },
        success: function (response) {
            console.log(response);
            if (response.valid == true) {
                $("#licencias").prop('hidden', true);
            } else {
                if (response.reason == 'Licencia vencida o inactiva.') {
                    $("#licencias").prop('hidden', false);
                    error("Licencia vencida o inactiva.");
                } else {
                    error(response.reason);
                    $("#licencias").prop('hidden', false);
                    error(response.reason);

                }

            }
        }
    });
});
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
