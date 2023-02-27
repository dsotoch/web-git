from django.shortcuts import render
from periodo.models import periodo
from django.utils import timezone
from django.http import JsonResponse
import json
from django.forms import model_to_dict
from aula.models import institucion, aula
from periodo.models import periodo
from alumnos.models import alumnos
from horario.models import horario
from area.models import area
from login.models import usuario
from django.contrib.auth.decorators import login_required,user_passes_test
from django.contrib.auth.models import Group
def mi_funcion(user):
    grupo=Group.objects.get(name='LICENCIA')
    ob=usuario.objects.get(dni=user)
    if ob.groups==grupo:
        return True
    else:
        return False

@user_passes_test(mi_funcion)
@login_required
def management_view(request):
    user = usuario.objects.get(dni=request.user)

    current_date = timezone.now().date()
    periods = ""
    try:
        periods = periodo.objects.filter(estado='ACT',user=user)
        return render(request, 'managementview.html', {'current_date': current_date, 'periods': periods})
    except Exception as ex:

        return render(request, 'managementview.html', {'current_date': current_date, 'periods': periods})
@user_passes_test(mi_funcion)
@login_required
def get_institution_by_period(request, id):
    try:
        if (request.method == 'GET'):
            user = usuario.objects.get(dni=request.user)

            object_period = periodo.objects.get(idPeriodo=id,user=user)
            objects_institutions = institucion.objects.filter(estado='ACT',user=user,
                                                              periodo=object_period).values()
            return JsonResponse(json.dumps(list(objects_institutions)), safe=False)
    except Exception as ex:
        return JsonResponse({'response': 'error'})
@user_passes_test(mi_funcion)
@login_required
def get_aulas(request, id):

    try:
        user = usuario.objects.get(dni=request.user)

        objects_institutions = institucion.objects.get(user=user,
            estado='ACT', idInstitucion=id)
        classrooms = aula.objects.filter(user=user,
            estado='ACT', institucion=objects_institutions).values()
        return JsonResponse(json.dumps(list(classrooms)), safe=False)

    except Exception as ex:

        return JsonResponse({'res': 'error'})
@user_passes_test(mi_funcion)
@login_required
def get_students(request, id):
    try:
        if (request.method == 'GET'):
            user = usuario.objects.get(dni=request.user)

            object_classroom = aula.objects.get(idAula=id,user=user)
            object_students = alumnos.objects.filter(user=user,
                aula=object_classroom).values()

            return JsonResponse(json.dumps(list(object_students)), safe=False)
    except Exception as ex:
        print(ex)
        return JsonResponse({'response': 'error'})
@user_passes_test(mi_funcion)
@login_required
def get_students_horario(request, id):
    try:
        user = usuario.objects.get(dni=request.user)

        classroom = aula.objects.get(idAula=id,user=user)
        schedules = horario.objects.filter(user=user,
            aulas=classroom, estado='ACT').prefetch_related('areas')
        dicc = []

        for n in schedules:

            ob = {'idHorario': n.idHorario, 'area': n.areas.descripcion, 'idArea': n.areas.idArea, 'turno': n.turno, 'dia': n.dia,
                  'horaInicio': str(n.horainicio), 'horaFin': str(n.horafin)}
            dicc.append(ob)
        return JsonResponse(json.dumps(dicc), safe=False)
    except Exception as ex:
        print(ex)
        return JsonResponse({'response': 'error'})
