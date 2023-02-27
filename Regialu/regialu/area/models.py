from django.db import models
from login.models import usuario


class area(models.Model):
    user=models.ForeignKey(usuario,null=True,on_delete=models.CASCADE)
    idArea = models.BigAutoField(primary_key=True)
    descripcion = models.CharField(max_length=158)
    ACTIVO = 'ACT'
    INACTIVO = 'INA'
    ESTADO = [(ACTIVO, 'Activo'), (INACTIVO, 'Inactivo')]
    estado = models.CharField(max_length=3, choices=ESTADO, default=ACTIVO)
    
