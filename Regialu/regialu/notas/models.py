from django.db import models
from alumnos.models import alumnos
from area.models import area
from login.models import usuario
class notas(models.Model):
    user=models.ForeignKey(usuario,null=True,on_delete=models.CASCADE)
    idNota=models.BigAutoField(primary_key=True)
    tipo =models.CharField(max_length=50)
    unidad=models.CharField(max_length=20)
    descripcion=models.CharField(max_length=200)
    valor=models.CharField(max_length=10)
    alumno=models.ForeignKey(alumnos,on_delete=models.CASCADE)
    area=models.ForeignKey(area,null=True,on_delete=models.SET_NULL)
    