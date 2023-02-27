from django.db import models
from django.db import models
from decimal import Decimal
from licencia.models import planes
from login.models import usuario


class PagoPaypalManager(models.Manager):
    def crear_pago(self, payment_id, plan, monto, payer_id, payer_email):
        pago = self.create(plan=plan, payment_id=payment_id, monto=monto,
                           payer_id=payer_id, payer_email=payer_email, pagado=True)
        return pago


class PagoPaypal(models.Model):
    plan = models.ForeignKey(planes, null=True, on_delete=models.SET_NULL)
    payment_id = models.CharField(max_length=64, db_index=True)
    payer_id = models.CharField(max_length=128, blank=True, db_index=True)
    payer_email = models.EmailField(blank=True)
    monto = models.DecimalField(
        max_digits=8, decimal_places=2, default=Decimal('0.00'))
    pagado = models.BooleanField(default=False)
    objects = PagoPaypalManager()


class transaccion(models.Model):
    numero = models.AutoField(max_length=100, primary_key=True)
    user = models.ForeignKey(usuario,null=True, on_delete=models.CASCADE)
    fecha = models.DateTimeField()
    monto = models.CharField(max_length=20)
    pago = models.ForeignKey(PagoPaypal, null=True, on_delete=models.SET_NULL)
