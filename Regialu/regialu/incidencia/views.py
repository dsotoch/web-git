from django.shortcuts import render
from incidencia.models import incidencia
from django.forms import model_to_dict
from alumnos.models import alumnos
from aula.models import aula
from django.http import JsonResponse,HttpResponse
import json
from login.models import usuario
from django.contrib.auth.decorators import login_required
#pdf
from io import BytesIO
import xhtml2pdf.pisa as pisa

@login_required
def index_incident(request,id):
    user=usuario.objects.get(dni=request.user)
    aulas=aula.objects.get(idAula=id,user=user)
    incidents = incidencia.objects.filter(aula=aulas,user=user).distinct()
    students = alumnos.objects.filter(aula=aulas,user=user)
    return render(request, "incident.html", {'incidents': incidents, 'students': students})

@login_required
def save_incident(request):
    try:
        if (request.method == 'POST'):
            user=usuario.objects.get(dni=request.user)

            data = json.loads(request.body)
            classroom = data.get('classroom')
            object_classroom = aula.objects.get(idAula=classroom,user=user)
            date = data.get('date')
            description = data.get('description')
            array_students = data.get('students')
            object_incident = incidencia.objects.create(user=user,
                fecha=date, descripcion=description, aula=object_classroom)
            for n in array_students:
                object_student = alumnos.objects.get(idAlumno=n,user=user)
                object_incident.alumno.add(object_student)
            dicc = {'idIncidente': object_incident.idIncidencia,
                    'fecha': object_incident.fecha, 'descripcion': object_incident.descripcion}
            return JsonResponse(json.dumps(dicc), safe=False)

    except Exception as ex:
        print(ex)
        return JsonResponse({'response': 'error'})

@login_required
def get_students(request, id):
    try:

        if (request.method == 'GET'):
            user=usuario.objects.get(dni=request.user)

            object_incident = incidencia.objects.get(idIncidencia=id,user=user)
            object_students = alumnos.objects.filter(user=user,
                incidencia=object_incident)
            dicc = []
            for n in object_students:
                object_dicc = {'apellidos': n.apellidos, 'nombres': n.nombres}
                dicc.append(object_dicc)
            return JsonResponse(json.dumps(dicc), safe=False)
    except Exception as ex:
        print(ex)
        return JsonResponse({'response': 'error'})

@login_required
def delete_incident(request, id):
    try:
        if (request.method == 'DELETE'):
            user=usuario.objects.get(dni=request.user)

            incidencia.objects.get(idIncidencia=id,user=user).delete()
            return JsonResponse({'response': 'success'})

    except Exception as ex:
        return JsonResponse({'response': 'error'})

@login_required
def pdf(request):
    html=request.POST.get('html','')
    archive=BytesIO()
    pdf=pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")),archive)
    if not pdf.err:
        response=HttpResponse(archive.getvalue(),content_type='application/pdf')
        response['content-disposition']='attachment; filename = "Incidencia.pdf"'
        return response
    