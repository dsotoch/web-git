
from django.shortcuts import render, redirect
from django.db.models import FloatField, Sum, F
from django.db.models.functions import Cast
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.views import LoginView
from django.contrib.auth.decorators import login_required
import json
from django.forms import model_to_dict
from login.models import usuario
from django.urls import reverse
from pago.models import transaccion, PagoPaypal
from django.contrib.auth import authenticate, login, logout
from licencia.models import licencias, planes
from django.contrib.auth.models import Group
from django.core.mail import send_mail
from smtplib import SMTPException
from django.contrib.auth.hashers import make_password
import random
import string


class CustomLoginView(LoginView):
    template_name = 'loginIndex.html'


@login_required
def success(request):
    return render(request, 'success.html')


@login_required
def cambiar_password(request):
    if (request.method == 'POST'):
        user = usuario.objects.get(dni=request.user)
        data = json.loads(request.body)
        new_valor = (make_password(data.get('pass')))
        user.password=(new_valor)
        user.save()
        return JsonResponse({'value': True})


def password(request):
    try:
        if (request.method == 'POST'):
            data = json.loads(request.body)
            email = data.get('email')
            dni = data.get('dni')
            user = usuario.objects.get(dni=dni)
            if (user.email == email):
                contr = ''.join(random.choices(
                    string.ascii_uppercase + string.digits + string.ascii_lowercase + string.punctuation, k=8))

                send_mail(
                    '(REGIALU.SIT).Recuperación de Contraseña',
                    'Ingresa esta Nueva Contraseña que la Puedes Cambiar en tu panel mi Cuenta :'+contr+'',
                    'dsoto6155@gmail.com',
                    [email],
                    fail_silently=True,
                )
                user.password = make_password(contr)
                user.save()

                return JsonResponse({'value': True})
            else:
                return JsonResponse({'value': False})
    except SMTPException as ex:
        print(ex)
        return JsonResponse({'value': False})


@login_required
def resumen(request):
    try:
        if (request.method == 'POST'):
            dni = request.user
            tipo_plan = ""

            user = usuario.objects.get(dni=dni)
            object_transaccion = transaccion.objects.filter(
                user=user).prefetch_related('pago')
            for x in object_transaccion:
                totalo = transaccion.objects.filter(user=user
                                                    ).annotate(tot=Cast('monto', FloatField())).aggregate(Sum('tot'))
                total = 0
                if (totalo['tot__sum'] != None):
                    total = totalo['tot__sum']

                html = render(request, 'resumen.html',
                              {'data': object_transaccion, 'total': total})
                return html
    except Exception as ex:
        print(ex)
        html = render(request, 'resumen.html',
                      )
        return html


@login_required
def account(request):
    license = "EL SOFTWARE ESTA INABILITADO POR QUE AUN NO HA COMPRADO NINGUNA LICENCIA"
    nombreplan = ""
    tiempo = ""
    idaut = request.user
    user = usuario.objects.get(dni=idaut)
    object_transaccion = transaccion.objects.filter(
        user=user).prefetch_related('pago')
    licencia = "EL SOFTWARE ESTA INABILITADO POR QUE AUN NO HA COMPRADO NINGUNA LICENCIA"
    for x in object_transaccion:
        tipo_plan = x.pago.plan.nombre_plan
        if (tipo_plan == 'BASICO'):
            tiempo = "1 Mes"
        elif (tipo_plan == 'PREMIUN'):
            tiempo = "6 Meses"
        else:
            tiempo = "1 Año"

        nombreplan = tipo_plan
        a = licencias.objects.filter(
            planes__nombre_plan=tipo_plan).first()
        licencia = a

        if (licencia is None or not licencia.is_active):
            license = "EL SOFTWARE ESTA INABILITADO POR QUE AUN NO HA COMPRADO NINGUNA LICENCIA"
        else:
            license = licencia.key
    return render(request, 'micuenta.html', {'user': user, 'dni': 'dni', 'tiempo': tiempo, 'nombreplan': nombreplan, 'license': license, 'licencia': licencia})


def index(request):
    return render(request, 'index1.html')


def login_logout(request):
    logout(request)
    url = reverse('customlogin')
    return redirect(url)


def login_success(request):
    try:
        if (request.method == 'POST'):
            data = json.loads(request.body)
            user = data.get('user')
            password = data.get('password')
            usuar = authenticate(request, dni=user, password=password)
            if usuar is not None:
                login(request, usuar)
                return JsonResponse({'response': True})
            else:
                return JsonResponse({'response': False})

    except Exception as ex:
        print(ex)
        return JsonResponse({'response': False})


def save_user(request, dni):
    try:

        if request.method == 'POST':
            grupo = Group.objects.get(name='SINLICENCIA')
            existe = usuario.objects.filter(dni=dni).count()
            if existe > 0:
                return JsonResponse({'response': 'existe'})
            else:
                data = json.loads(request.body)
                dni = data.get('dni')
                nombres = data.get('nombres')
                apellidos = data.get('apellidos')
                email = data.get('email')
                existe2 = usuario.objects.filter(email=email).count()
                if existe2 > 0:
                    return JsonResponse({'response': 'email'})

                else:
                    pais = data.get('pais')
                    password = data.get('password')
                    model = usuario.objects.create_user(dni=dni,
                                                        nombre=nombres,
                                                        apellido=apellidos,
                                                        email=email,
                                                        pais=pais,
                                                        password=password, is_admin=False, groups=grupo)

                    return JsonResponse(model_to_dict(model))
    except Exception as ex:
        print(ex)
        return JsonResponse({'response': 'error'})
