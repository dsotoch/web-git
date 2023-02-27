from django.shortcuts import render
from django.http import JsonResponse
import json
from horario.models import horario
from django.forms.models import model_to_dict
from area.models import area
from datetime import datetime
from aula.models import aula, institucion
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

def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'

@user_passes_test(mi_funcion)
@login_required
def index(request):
    user = usuario.objects.get(dni=request.user)

    total = horario.objects.filter(user=user).all().count()
    data = horario.objects.filter(user=user).all()
    areas = area.objects.filter(estado='ACT',user=user)

    return render(request, 'horario.html', {'total': total, 'data': data, 'area': areas})
@user_passes_test(mi_funcion)
@login_required
def horario_save(request):
    if (request.method == 'POST' and is_ajax(request)):
        user = usuario.objects.get(dni=request.user)
        data = json.loads(request.body)
        turno = data.get('turno')
        dia = data.get('dia')
        areas = data.get('area')
        horainicio = datetime.strptime(
            data.get('horainicio'), "%I:%M %p").time()
        horafin = datetime.strptime(data.get('horafin'), "%I:%M %p").time()

        oarea = area.objects.get(idArea=areas,user=user)

        nuevoObjeto = horario.objects.create(user=user,
            turno=turno, dia=dia, areas=oarea, horainicio=horainicio, horafin=horafin)

        return JsonResponse({'response': model_to_dict(nuevoObjeto)})

    else:
        return JsonResponse({'response': 'error'})
@user_passes_test(mi_funcion)
@login_required
def horario_delete(request, id):
    if (request.method == 'DELETE' and is_ajax(request)):
        user = usuario.objects.get(dni=request.user)

        horario.objects.get(idHorario=id,user=user).delete()

        return JsonResponse({'response': 'success'})
    else:
        return JsonResponse({'response': 'error'})
@user_passes_test(mi_funcion)
@login_required
def horario_status_change(request, id):

    if request.method == 'PUT' and is_ajax(request):
        user = usuario.objects.get(dni=request.user)

        model = horario.objects.get(idHorario=id,user=user)
        new = ""
        if model.estado == 'ACT':
            new = 'INA'
        else:
            new = 'ACT'
        model.estado = new
        model.save()

        return JsonResponse({'response': new})
    else:
        return JsonResponse({'response': 'error'})
@user_passes_test(mi_funcion)
@login_required
def horario_update(request, id):
    try:
        if request.method == 'PUT' and is_ajax(request):
            user = usuario.objects.get(dni=request.user)
            model = horario.objects.get(idHorario=id,user=user)
            data = json.loads(request.body)
            turno = data.get('turno')
            dia = data.get('dia')
            areas = data.get('area')
            horainicio = datetime.strptime(
                data.get('horainicio'), "%I:%M %p").time()
            horafin = datetime.strptime(data.get('horafin'), "%I:%M %p").time()
            oarea = area.objects.get(idArea=areas ,user=user)
            model.turno = turno
            model.dia = dia
            model.areas = oarea
            model.horainicio = horainicio
            model.horafin = horafin
            model.save()
            return JsonResponse({'response': 'success'})

        else:
            return JsonResponse({'response': 'error'})
    except Exception as e:
        print(e)
        return JsonResponse({'response': 'error'})
@user_passes_test(mi_funcion)
@login_required
def classroom_assign(request, id):
    user = usuario.objects.get(dni=request.user)

    modelohorario = horario.objects.get(idHorario=id,user=user)
    data = aula.objects.filter(estado='ACT',user=user)
    aulas = modelohorario.aulas
    cantidad = 0
    if (aulas != None):
        cantidad = 1

    return render(request, 'aula_horario.html', {'horario': modelohorario, 'data': data, 'aulas': aulas, 'cantidad': cantidad})
@user_passes_test(mi_funcion)
@login_required
def classroom_data_assign(request, id):
    if (request.method == 'POST' and is_ajax(request)):
        user = usuario.objects.get(dni=request.user)

        data = json.loads(request.body)
        model = horario.objects.get(idHorario=id,user=user)
        for n in data.get('data'):
            m_aula = aula.objects.get(idAula=n,user=user)
            model.aulas = m_aula
            model.save()
        return JsonResponse({'response': 'success'})
    else:
        return JsonResponse({'response': 'error'})
@user_passes_test(mi_funcion)
@login_required
def classroom_details(request, id):
    if request.method == 'GET':
        user = usuario.objects.get(dni=request.user)

        aulas = aula.objects.get(idAula=id,user=user)
        inst = institucion.objects.get(user=user,
            idInstitucion=aulas.institucion.idInstitucion)
        return JsonResponse({'response': model_to_dict(aulas), 'res': model_to_dict(inst)})
    else:
        return JsonResponse({'response': 'error'})
@user_passes_test(mi_funcion)
@login_required
def unlink_classroom(request, id, idHorario):
    if request.method == 'GET':
        user = usuario.objects.get(dni=request.user)

        objeto_aula = aula.objects.get(idAula=id,user=user)
        objeto_horario = horario.objects.get(idHorario=idHorario,user=user)
        cambio = horario.objects.get(aulas=objeto_aula,user=user).delete(objeto_aula)
        return JsonResponse({'response': 'success'})
    else:
        return JsonResponse({'response': 'error'})
