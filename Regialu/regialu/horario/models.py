from django.db import models
from area.models import area
from aula.models import aula
from login.models import usuario
class horario(models.Model):
    user=models.ForeignKey(usuario,null=True,on_delete=models.CASCADE)
    idHorario = models.BigAutoField(primary_key=True)
    MANANA = 'MAN'
    TARDE = 'TAR'
    NOCHE = 'NOC'
    TURNOS = [(MANANA, 'Mañana'), (TARDE, 'Tarde'), (NOCHE, 'Noche')]
    turno = models.CharField(max_length=3, choices=TURNOS)
    LUNES = 'LUN'
    MARTES = 'MAR'
    MIERCOLES = 'MIE'
    JUEVES = 'JUE'
    VIERNES = 'VIE'
    SABADO = 'SAB'
    DOMINGO = 'DOM'
    DIAS =[ (LUNES,'Lunes'), (MARTES,'Martes'),(MIERCOLES,'Miercoles'),(JUEVES,'Jueves'),(VIERNES,'Viernes'),(SABADO,'Sabado'),(DOMINGO,'Domingo')]
    dia = models.CharField(max_length=3,choices=DIAS)
    horainicio=models.TimeField()
    horafin=models.TimeField()
    ACTIVO='ACT'
    INACTIVO='INA'
    ESTADO=[(ACTIVO,'Activo'),(INACTIVO,'Inactivo')]
    estado=models.CharField(max_length=3,choices=ESTADO,default=ACTIVO)
    areas=models.ForeignKey(area,null=True,on_delete=models.CASCADE)
    aulas = models.ForeignKey(aula, null=True ,on_delete=models.CASCADE)
