from django.db import models
from login.models import usuario
class licencias(models.Model):
    key = models.CharField(primary_key=True, max_length=36)
    user=models.ForeignKey(usuario,null=True,on_delete=models.SET_NULL)
    is_active = models.BooleanField(default=True)
    is_usado=models.BooleanField(default=False)
    activation_date = models.DateField(auto_now_add=True)
    expired_date = models.DateField()
class planes(models.Model):
    nombre_plan = models.CharField(max_length=50, primary_key=True)
    precio = models.CharField(max_length=15)
    estado = models.CharField(max_length=20, default='Activo')
    license=models.ManyToManyField(licencias,null=True)


     