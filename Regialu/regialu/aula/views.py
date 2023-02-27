from django.shortcuts import render, redirect
import aula.models as m
from django.db.models import Count
from django.http import JsonResponse
from django.forms.models import model_to_dict
import json
from periodo.models import periodo
from django.contrib.auth.decorators import login_required,user_passes_test
from login.models import usuario
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
def indexAula(request):
    user = usuario.objects.get(dni=request.user)
    instituciones = m.institucion.objects.filter(estado='ACT', user=user).all()
    cantidad = m.aula.objects.filter(
        user=user).aggregate(total=Count('idAula'))
    totales = cantidad.get('total')
    aulas = m.aula.objects.filter(user=user).order_by('-idAula')[:1]

    return render(request, 'subirAula.html', {'total': totales, 'aulas': aulas, 'ins': instituciones})

@user_passes_test(mi_funcion)
@login_required
def save_Aula(request):
    try:
        if request.method == 'POST' and is_ajax(request):
            user = usuario.objects.get(dni=request.user)

            data = json.loads(request.body)
            seccion = data.get('seccion')
            grado = data.get('grado')
            nivel = data.get('nivel')
            id_institucion = data.get('institucion')
            institucion = m.institucion.objects.get(user=user,
                                                    idInstitucion=id_institucion)
            objeto_aula = m.aula.objects.create(user=user,
                                                grado=grado, seccion=seccion, nivel=nivel, institucion=institucion)
            return JsonResponse({'aula': model_to_dict(objeto_aula)})

        else:
            print("NO ES AJAX")

            return JsonResponse({'aula': 'error'})

    except Exception as e:
        return JsonResponse({'aula': 'error'})

@user_passes_test(mi_funcion)
@login_required
def all_Classrooms(request):
    user = usuario.objects.get(dni=request.user)
    data = m.aula.objects.filter(user=user)
    instituciones = m.institucion.objects.filter(estado='ACT', user=user).all()
    return render(request, 'allClassrooms.html', {'data': data, 'instituciones': instituciones})

@user_passes_test(mi_funcion)
@login_required
def chosen_Institution(request, id):
    user = usuario.objects.get(dni=request.user)

    chosen_institution = m.institucion.objects.get(idInstitucion=id, user=user)
    data = m.aula.objects.filter(institucion=chosen_institution, user=user)
    instituciones = m.institucion.objects.filter(user=user)
    return render(request, 'chosenInstitution.html', {'data': data, 'instituciones': instituciones})

@user_passes_test(mi_funcion)
@login_required
def delete_aula(request, id):
    if request.method == 'DELETE' and is_ajax(request):
        user = usuario.objects.get(dni=request.user)

        m.aula.objects.get(idAula=id, user=user).delete()
        return JsonResponse({'response': 'success'})
    else:
        return JsonResponse({'response': 'error'})

@user_passes_test(mi_funcion)
@login_required
def aula_status_update(request, id):
    if request.method == 'PUT' and is_ajax(request):
        user = usuario.objects.get(dni=request.user)

        model = m.aula.objects.filter(idAula=id, user=user)[0]
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
def aula_update(request, id):

    if request.method == 'PUT' and is_ajax(request):
        user = usuario.objects.get(dni=request.user)

        data = json.loads(request.body)
        model = m.aula.objects.get(idAula=id,user=user)

        model.grado = data.get('grado')
        model.seccion = data.get('seccion')
        model.nivel = data.get('nivel')
        model.save()

        return JsonResponse({'response': model_to_dict(model)})
    else:
        return JsonResponse({'response': 'error'})


# INSTITUCIONES ####################################################################
@user_passes_test(mi_funcion)
@login_required
def index_instituciones(request):
    user = usuario.objects.get(dni=request.user)

    inst = m.institucion.objects.filter(user=user).all()
    periods = periodo.objects.filter(estado='ACT',user=user).all()
    return render(request, 'instituciones.html', {'data': inst, 'periods': periods})
@user_passes_test(mi_funcion)
@login_required
def get_instituciones(request):

    return render(request, "instituciones.html")
@user_passes_test(mi_funcion)
@login_required
def save_instituciones(request):
    try:
        if request.method == 'POST' and is_ajax(request=request):
            user = usuario.objects.get(dni=request.user)
            data = json.loads(request.body)
            nombres = data.get('nombre')
            direccion = data.get('direccion')
            tipo = data.get('tipo')
            period = data.get('period')
            object_period = periodo.objects.get(idPeriodo=period,user=user)
            ins = m.institucion.objects.create(user=user,
                nombre=nombres, direccion=direccion, tipo=tipo, periodo=object_period)

            return JsonResponse({'model': model_to_dict(ins)})

    except Exception as e:
        print(e)
        return JsonResponse({'respuesta': 'error'})
@user_passes_test(mi_funcion)
@login_required
def status_change(request, id):
    try:
        if request.method == 'PUT' and is_ajax(request=request):
            user = usuario.objects.get(dni=request.user)

            model = m.institucion.objects.get(idInstitucion=id,user=user)
            if (model.estado == 'ACT'):
                model.estado = 'INA'
                model.save()
            else:
                model.estado = 'ACT'
                model.save()

            return JsonResponse({'response': 'success'})
        else:
            return JsonResponse({'response': 'error'})

    except Exception as ex:
        print(ex)
        return JsonResponse()
@user_passes_test(mi_funcion)
@login_required
def delete_instituciones(request, id):
    try:
        if request.method == 'DELETE' and is_ajax(request=request):
            user = usuario.objects.get(dni=request.user)

            m.institucion.objects.get(idInstitucion=id,user=user).delete()

            return JsonResponse({'response': 'success'})
        else:
            return JsonResponse({'response': 'error'})
    except Exception as ex:
        return JsonResponse({'response': 'error'})
@user_passes_test(mi_funcion)
@login_required
def update_instituciones(request, id, period):
    try:
        if request.method == 'PUT' and is_ajax(request=request):
            user = usuario.objects.get(dni=request.user)

            data = json.loads(request.body)
            name = data.get('nombre')
            dire = data.get('direccion')
            tipo = data.get('tipo')
            object_period = periodo.objects.get(idPeriodo=period,user=user)
            objeto = m.institucion.objects.get(idInstitucion=id,user=user)
            objeto.nombre = name
            objeto.direccion = dire
            objeto.tipo = tipo

            objeto.periodo = object_period
            objeto.save()
            return JsonResponse({'response': 'success'})
        else:
            return JsonResponse({'response': 'error'})
    except ValueError as ex:
        print(ex)
        return JsonResponse({'response': 'Error'})
