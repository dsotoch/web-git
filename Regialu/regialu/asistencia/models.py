from django.db import models

from aula.models import aula 
from alumnos.models import alumnos
from area.models import area
from login.models import usuario
class asistencia(models.Model):
    user=models.ForeignKey(usuario,null=True,on_delete=models.CASCADE)
    idAsistencia=models.BigAutoField(primary_key=True)
    alumno=models.ForeignKey(alumnos,on_delete=models.CASCADE)
    fechaRegistro=models.DateField()
    fechaActualizacion=models.DateField()
    estado=models.CharField(max_length=51)
    area=models.ForeignKey(area,on_delete=models.CASCADE)
    aulas=models.ForeignKey(aula,on_delete=models.CASCADE)

