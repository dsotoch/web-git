from django.shortcuts import render
from django.http import JsonResponse
from django.forms.models import model_to_dict
from periodo.models import periodo
from login.models import usuario
from django.contrib.auth.decorators import login_required,user_passes_test
from django.contrib.auth.models import Group
import json
def mi_funcion(user):
    grupo=Group.objects.get(name='LICENCIA')
    ob=usuario.objects.get(dni=user)
    if ob.groups==grupo:
        return True
    else:
        return False

@user_passes_test(mi_funcion)
@login_required
def period_view(request):
    user = usuario.objects.get(dni=request.user)
    periods = periodo.objects.filter(user=user)
    return render(request, 'period-view.html', {'periods': periods})

@user_passes_test(mi_funcion)
@login_required
def period_save(request):
    try:
        if (request.method == 'POST'):
            user = usuario.objects.get(dni=request.user)
            period_all = periodo.objects.all()
            data = json.loads(request.body)
            description = data.get('description')
            con = 0
            for n in period_all:
                if (n.descripcion == description):
                    con = con+1
                    return JsonResponse({'response': 'existe'})
            if (con == 0):
                start_date = data.get('start_date')
                finish_date = data.get('finish_date')
                obj_period = periodo.objects.create(user=user,
                                                    descripcion=description, fecha_inicio=start_date, fecha_fin=finish_date)

            return JsonResponse({'response': model_to_dict(obj_period)})
        else:
            return JsonResponse({'response': 'error'})
    except Exception as ex:
        print(ex)
        return JsonResponse({'response': 'error'})

@user_passes_test(mi_funcion)
@login_required
def period_delete(request, id):
    try:
        if (request.method == 'DELETE'):
            user = usuario.objects.get(dni=request.user)

            periodo.objects.get(idPeriodo=id, user=user).delete()

            return JsonResponse({'response': 'success'})
        else:
            return JsonResponse({'response': 'error'})
    except Exception as ex:
        print(ex)
        return JsonResponse({'response': 'error'})

@user_passes_test(mi_funcion)
@login_required
def period_state_change(request, id):
    try:
        if (request.method == 'PUT'):
            user = usuario.objects.get(dni=request.user)

            model_period = periodo.objects.get(idPeriodo=id, user=user)
            if (model_period.estado == 'ACT'):
                model_period.estado = 'INA'
            else:
                model_period.estado = 'ACT'
            model_period.save()

            return JsonResponse({'response': model_period.estado})
        else:
            return JsonResponse({'response': 'error'})
    except Exception as ex:
        print(ex)
        return JsonResponse({'response': 'error'})
