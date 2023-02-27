from django.db import models
from aula.models import aula
from alumnos.models import alumnos
from login.models import usuario
class incidencia(models.Model):
    user=models.ForeignKey(usuario,null=True,on_delete=models.CASCADE)
    idIncidencia=models.BigAutoField(primary_key=True)
    aula=models.ForeignKey(aula,on_delete=models.CASCADE)
    alumno=models.ManyToManyField(alumnos,null=True)
    descripcion=models.CharField(max_length=700)
    fecha=models.DateField()
