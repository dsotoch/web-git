// Obtener la fecha actual
var fecha_actual = new Date();

// Crear un array con los nombres de los días de la semana
var dias_semana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Obtener el nombre del día actual
var dia_actual = dias_semana[fecha_actual.getDay()];


$.ajax({
    type: "GET",
    url: "Horario/",
    data: "",
    dataType: "json",
    success: function (response) {
        let data = JSON.parse(response);
     
        if (data.length > 0) {
            $("#dia").text(dia_actual);

            let turno = "";
            let aula = "";
            for (var n in data) {
                switch (data[n].Turno) {

                    case 'MAN':
                        turno = 'Mañana';

                        break;
                    case 'TAR':
                        turno = 'Tarde';

                        break;
                    default:
                        turno = 'Noche';
                        break;
                }
                switch ((data[n].Aula).split("/")[1]) {
                    case 'PRI':
                        aula = (data[n].Aula).split("/")[0]+" "+'Primaria';

                        break;
                    case 'SEC':
                        aula = (data[n].Aula).split("/")[0]+" "+'Secundaria';

                        break;
                    case 'SUP':
                        aula =(data[n].Aula).split("/")[0]+" "+'Superior';

                        break;
                    case 'AFI':
                        aula =(data[n].Aula).split("/")[0]+" "+'Afianzamiento';

                        break;
                    default:
                        aula = (data[n].Aula).split("/")[0]+" "+'Otro';
                        break;
                }
                var nuevaFila = '<tr><td>' + data[n].Institucion + '</td><td>' + aula + '</td><td>' + data[n].Area + '</td><td>' + turno + '</td><td>' + data[n].Hora_Inicio + '</td><td>' + data[n].Hora_Fin + '</td></tr>';
                $('#miTabla').find('tbody').append(nuevaFila);

            }
           



        }else{
            $("#dia").text(dia_actual);
            $("#mensaje_").text("Parece que Hoy Tienes el DIA Libre");
        }
        
    }
    
});