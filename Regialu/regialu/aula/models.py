from django.db import models
from periodo.models import periodo
from login.models import usuario


class institucion(models.Model):
    user = models.ForeignKey(usuario, null=True, on_delete=models.CASCADE)
    idInstitucion = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    PRIVADO = 'PRI'
    PUBLICO = 'PUB'
    TIPOS = [
        (PRIVADO, 'Privado'),
        (PUBLICO, 'Publico'),

    ]
    tipo = models.CharField(max_length=3, choices=TIPOS)
    direccion = models.CharField(max_length=100)
    ACTIVO = 'ACT'
    INACTIVO = 'INA'
    ESTADOS = [

        (ACTIVO, 'Activo'),
        (INACTIVO, 'Inactivo'),
    ]
    estado = models.CharField(max_length=3, choices=ESTADOS, default=ACTIVO,)
    periodo = models.ForeignKey(periodo, null=True, on_delete=models.SET_NULL)

    def __str__(self) -> str:
        return super().__str__()


class aula(models.Model):
    user = models.ForeignKey(usuario, null=True, on_delete=models.CASCADE)
    idAula = models.BigAutoField(primary_key=True)
    seccion = models.CharField(max_length=50)
    grado = models.CharField(max_length=10)
    PRIMARIA = 'PRI'
    SECUNDARIA = 'SEC'
    SUPERIOR = 'SUP'
    AFIANSIAMIENTO = 'AFI'
    OTRO = 'OTR'
    NIVELES = [(PRIMARIA, 'Primaria'),
               (SECUNDARIA, 'Secundaria'), (SUPERIOR, 'Superior'), (AFIANSIAMIENTO, 'Afiansiamiento'), (OTRO, 'Otro')]
    ACTIVO = 'ACT'
    INACTIVO = 'INA'
    ESTADO = [(ACTIVO, 'Activo'), (INACTIVO, 'Inactivo')]
    nivel = models.CharField(max_length=3, choices=NIVELES)
    estado = models.CharField(max_length=3, choices=ESTADO, default=ACTIVO)
    institucion = models.ForeignKey(
        institucion, null=True, blank=False, on_delete=models.SET_NULL)

    def __str__(self) -> str:
        return super().__str__()
