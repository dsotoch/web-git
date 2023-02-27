from django.contrib import admin
from pago.models import PagoPaypal,transaccion
admin.site.register(PagoPaypal)
admin.site.register(transaccion)