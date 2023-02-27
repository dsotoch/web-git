from django.shortcuts import render
from django.http import JsonResponse
from django.forms.models import model_to_dict
from area.models import area
import json
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
def index(request):
    user = usuario.objects.get(dni=request.user)

    total = area.objects.filter(user=user).all().count()
    data = area.objects.filter(user=user).all()

    return render(request, 'area.html', {'total': total, 'data': data})
@user_passes_test(mi_funcion)
@login_required
def area_save(request):
    if (request.method == 'POST' and is_ajax(request)):
        user = usuario.objects.get(dni=request.user)

        data = json.loads(request.body)
        description = data.get('data')
        obj = area.objects.filter(descripcion=description,user=user).count()
        if obj < 1:
            nuevoObjeto = area.objects.create(descripcion=description,user=user)
            return JsonResponse({'response': model_to_dict(nuevoObjeto)})

        else:
            return JsonResponse({'response': 'existe'})
    else:
        return JsonResponse({'response': 'error'})
@user_passes_test(mi_funcion)
@login_required
def area_delete(request, id):
    if (request.method == 'DELETE' and is_ajax(request)):
        user = usuario.objects.get(dni=request.user)

        area.objects.get(idArea=id,user=user).delete()

        return JsonResponse({'response': 'success'})
    else:
        return JsonResponse({'response': 'error'})
@user_passes_test(mi_funcion)
@login_required
def area_status_change(request, id):

    if request.method == 'PUT' and is_ajax(request):
        user = usuario.objects.get(dni=request.user)

        model = area.objects.get(idArea=id,user=user)
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
