from django.db import models
from login.models import usuario
class periodo(models.Model):
    user=models.ForeignKey(usuario,null=True,on_delete=models.CASCADE)
    idPeriodo=models.BigAutoField(primary_key=True)
    descripcion=models.CharField(max_length=100)
    fecha_inicio=models.DateField()
    fecha_fin=models.DateField()
    ACTIVO='ACT'
    INACTIVO='INA'
    ESTADO=[(ACTIVO,'Activo'),(INACTIVO,'Inactivo')]
    estado=models.CharField(max_length=3,choices=ESTADO,default=ACTIVO)

