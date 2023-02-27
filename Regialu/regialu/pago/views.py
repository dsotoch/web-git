from django.http import JsonResponse
from paypalrestsdk import Payment
import paypalrestsdk
from django.urls import reverse
from django.shortcuts import render
from datetime import datetime, timedelta
from licencia.models import planes, licencias
from pago.models import transaccion, PagoPaypal
from login.models import usuario
import json
from django.contrib.auth.models import Group
from django.contrib.auth.decorators import login_required
@login_required
def cuenta(request):
    fecha = datetime.now()
    return render(request, "cancel.html", {'fecha': fecha})

def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'
@login_required
def success(request):
    fecha = datetime.now()
    return render(request, "success.html", {'fecha': fecha})


paypalrestsdk.configure({
    "mode": "sandbox",  # Cambie a "live" en producción
    "client_id": "AS3NZpK7mGdGLsL35-lcng4lFVt1CWZ_2PnOnWg0TnZzypk2jSm3MT3h45vIrSu_-GlQhGnpaeY2d2Ja",
    "client_secret": "EPIOefqcN86OzkGBoSdvX5fMyM_Pgd4eUIxCF9UJ1hPDnhUxNfU2u51F53QPcxNEUoqhC5sjDN4n4aLV"
})

@login_required
def paypal_payment(request, plan):
    planea = planes.objects.get(nombre_plan=plan)
    # Configurar el pago
    payment = Payment({
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:8000/Pagos//",
            "cancel_url": "http://localhost:8000/Pagos/",
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": planea.nombre_plan,
                    "price": planea.precio,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "total": planea.precio,
                "currency": "USD"
            },
            "description": "Licencia de Plan "+"-" + planea.nombre_plan
        }]
    })

    try:
        # Ejecutar la orden de pago
        if payment.create():
            for link in payment.links:
                if link.rel == "approval_url":
                    approval_url = link.href
                    return JsonResponse({'response': approval_url})
        else:
            return JsonResponse({'response': 'error'})
    except Exception as ex:
        print(ex)
        return JsonResponse({'response': 'error'})

@login_required
def estado_pago(request):

    if (request.method == 'POST' and is_ajax(request)):
        try:
            data = json.loads(request.body)
            id_pago = data.get('payment_id')
            payer = data.get('payer_id')
            # ID del pago que se quiere obtener
            payment_id = id_pago
            payer_id = payer
            # Llamar a la API de PayPal para obtener información sobre el pago
            payment = paypalrestsdk.Payment.find(payment_id)
            payment.execute({"payer_id": payer_id})

            return JsonResponse(json.dumps(payment.to_dict()), safe=False)

        except Exception as ex:
            print(ex)
            return JsonResponse({'response': 'error'})

@login_required
def activar_licencia(request):
    try:
        if (request.method == 'POST' and is_ajax(request)):
            grupo=Group.objects.get(name='LICENCIA')
            data = json.loads(request.body)
            name = data.get('name')
            user = request.user
            payment_id = data.get('payment_id')
            monto = data.get('monto')
            payer_id = data.get('payer_id')
            payer_email = data.get('email')
            dias = 0
            if (name == 'BASICO'):
                dias = 30
            elif (name == 'PREMIUN'):
                dias = 60
            else:
                dias = 365
            object_licencias = licencias.objects.filter(
                is_active=True, is_usado=False)[0]
            object_plan = planes.objects.get(nombre_plan=name)
            object_plan.precio = monto
            object_plan.license.add(object_licencias)
            object_plan.save()
            object_user = usuario.objects.get(dni=user)
            object_user.groups=grupo
            object_user.save()
            object_licencias.is_usado = True
            object_licencias.activation_date = datetime.now()
            object_licencias.expired_date = datetime.now()+timedelta(days=dias)
            object_licencias.user = object_user
            object_licencias.save()
            object_pago = PagoPaypal.objects.crear_pago(
                payment_id, object_plan, monto, payer_id, payer_email)
            object_transaccion = transaccion.objects.create(user=object_user,
                                                            pago=object_pago, fecha=datetime.now(), monto=object_pago.monto)
            return JsonResponse({'response': True})
    except Exception as ex:
        print(ex)
        return JsonResponse({'response': False})
