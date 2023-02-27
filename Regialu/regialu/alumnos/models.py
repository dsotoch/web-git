from django.db import models
from aula.models import aula
from login.models import usuario
class alumnos(models.Model):
    user=models.ForeignKey(usuario,null=True,on_delete=models.CASCADE)
    idAlumno=models.BigAutoField(primary_key=True)
    apellidos=models.CharField(max_length=100)
    nombres=models.CharField(max_length=100)
    grado=models.CharField(max_length=100)
    aula=models.ForeignKey(aula ,blank=True,null=True,on_delete=models.SET_NULL)
    
