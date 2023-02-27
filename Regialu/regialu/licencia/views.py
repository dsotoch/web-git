from django.shortcuts import render
from licencia.models import licencias
from django.http import JsonResponse
from datetime import datetime,time
from login.models import usuario
import json
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group

@login_required
def check_license(request):
    if (request.method == 'POST'):
        grupo=Group.objects.get(name='SINLICENCIA')
        user=usuario.objects.get(dni=request.user)
        data=json.loads(request.body) 
        key = data.get('key', '')
        try:
            license = licencias.objects.get(key=key)
            if license.is_active and datetime.combine(license.expired_date, time.min) > datetime.now():
                return JsonResponse({'valid': True})
            else:

                user.groups=grupo
                user.save()
                license.is_active=False
                license.user=None
                license.save()
                return JsonResponse({'valid': False, 'reason': 'Licencia vencida o inactiva.'})

        except licencias.DoesNotExist:
            return JsonResponse({'valid': False, 'reason': 'Clave de licencia no válida o aun no ha Comprado Una.'})
