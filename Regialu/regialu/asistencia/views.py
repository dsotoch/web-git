from django.shortcuts import render
from asistencia.models import *
import json
from django.http import JsonResponse, HttpResponse
from datetime import datetime
from asistencia.models import asistencia
from aula.models import aula
from datetime import datetime 
from django.contrib.auth.decorators import login_required
from login.models import usuario
from periodo.models import periodo
# pdf
from io import BytesIO
import xhtml2pdf.pisa as pisa

@login_required
def save_assistance(request, id):
    try:
        if (request.method == 'POST'):
            user=usuario.objects.get(dni=request.user)
            data = json.loads(request.body)
            areas = area.objects.get(idArea=data.get('area'),user=user)
            registrationdate = datetime.now()
            updatedate = datetime.now()
            classroom = aula.objects.get(idAula=id,user=user)
            assistance = asistencia.objects.filter(user=user,
                aulas=classroom, fechaRegistro=registrationdate).distinct()

            if (assistance.exists() == False):
                for key, value in data.get('data').items():
                    objectstudent = alumnos.objects.get(idAlumno=key)
                    asistencia.objects.create(user=user,
                        fechaRegistro=registrationdate, fechaActualizacion=updatedate, estado=value, alumno=objectstudent, aulas=classroom, area=areas)
                return JsonResponse({'response': 'success'})

            else:
                return JsonResponse({'response': 'existe'})

        else:
            return JsonResponse({'response': 'error'})

    except Exception as ex:
        print(ex)
        return JsonResponse({'response': 'error'})

@login_required
def update_assistance(request, aula):
    return render(request, "updateassistance.html", {'aula': aula})

@login_required
def update_assistance_data(request, id, date):
    try:
        if (request.method == 'PUT'):
            user=usuario.objects.get(dni=request.user)

            data = json.loads(request.body)
            updatedate = datetime.now()
            classroom = aula.objects.get(idAula=id,user=user)

            for key, value in data.get('data').items():
                objectstudent = alumnos.objects.get(idAlumno=key,user=user)
                Asistencia = asistencia.objects.filter(user=user,
                    fechaRegistro=date, aulas=classroom, alumno=objectstudent)
                for n in Asistencia:

                    n.alumno = objectstudent

                    n.estado = value
                    n.fechaActualizacion = updatedate
                    n.save()
            return JsonResponse({'response': 'success'})

        else:
            return JsonResponse({'response': 'error'})

    except Exception as ex:
        print(ex)
        return JsonResponse({'response': 'error'})

@login_required
def get_save_assistance(request, aula):
    return render(request, "saveassistance.html", {'aula': aula})

@login_required
def get_assistance(request, date, idaula):
    try:
        if (request.method == 'GET'):
            user=usuario.objects.get(dni=request.user)

            objectclassroom = aula.objects.get(idAula=idaula,user=user)
            object_students = asistencia.objects.filter(user=user,
                aulas=objectclassroom, fechaRegistro=date).distinct().select_related('alumno')
            dicc_students = []
            for n in object_students:
                dicc_student = {'id': n.alumno.idAlumno,
                                'apellidos': n.alumno.apellidos,
                                'nombres': n.alumno.nombres,
                                'estado': n.estado}
                dicc_students.append(dicc_student)

            return JsonResponse(json.dumps(dicc_students), safe=False)

        else:
            return JsonResponse({'response': 'error'})

    except Exception as ex:
        print(ex)
        return JsonResponse({'response': 'error'})

@login_required
def generate_pdf(request, id):
    try:
        if request.method == 'POST':
            user=usuario.objects.get(dni=request.user)

            data = json.loads(request.body)
            aulas = data.get('aulas')
            areas = data.get('area')
            perioda = data.get('periodo')
            institucions = data.get('institucions')
            fechas = datetime.now()
            name_periodo = perioda.split("/")[0]
            period=periodo.objects.get(descripcion=name_periodo,user=user)
            fecha_fin = period.fecha_fin
            fecha_inicio=period.fecha_inicio
           
            fecha_inicio_parse=fecha_inicio
            fecha_fin_parse= fecha_fin
         
            object_area = area.objects.get(idArea=areas,user=user)
            object_classroom = aula.objects.get(idAula=aulas,user=user)
            object_student = alumnos.objects.get(user=user,
                idAlumno=id, aula=object_classroom)
            object_asistance = asistencia.objects.filter(user=user,
                alumno=object_student, aulas=object_classroom, area=object_area, fechaRegistro__range=(fecha_inicio_parse, fecha_fin_parse))

            alumnoss = object_student.apellidos + " "+object_student.nombres
            numero_asistencias = object_asistance.count()
            asistencias = 0
            faltas = 0
            tardanzas = 0
            lista = []
            estado = ""
            for n in object_asistance:
                if n.estado == 'A':
                    estado = "Asistio"
                    asistencias = asistencias+1
                elif n.estado == 'F':
                    estado = "Faltó"
                    faltas = faltas+1
                else:
                    estado = "Tardanza"
                    tardanzas = tardanzas+1
                dicc = {'fecha': n.fechaRegistro, 'estado': estado}
                lista.append(dicc)
            return render(request, 'reportStudent.html', {'periodo': period,
                                                          'institucions': institucions,
                                                          'fechas': fechas,
                                                          'areas': object_area.descripcion,
                                                          'alumnoss': alumnoss,
                                                          'fecha_inicio': fecha_inicio,
                                                          'fecha_fin': fecha_fin,
                                                          'numero_asistencias': numero_asistencias,
                                                          'asistencias': asistencias,
                                                          'faltas': faltas,
                                                          'tardanzas': tardanzas,
                                                          'asistances': lista})

    except Exception as ex:
        print(ex)
        return JsonResponse({'response': 'error'})

@login_required
def savePDF(request):
    html = request.POST.get('html', '')
    result = BytesIO()
    pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result)
    if not pdf.err:
        response = HttpResponse(
            result.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="Asistencia.pdf"'
        return response
    else:

        return HttpResponse("Error al generar el PDF")
