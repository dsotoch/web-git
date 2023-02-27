from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from aula.models import aula, institucion
from area.models import area
from alumnos.models import alumnos
from incidencia.models import incidencia
from aula.models import aula
from horario.models import horario
from periodo.models import periodo
from django.http import JsonResponse
from django.db.models import Prefetch
import json
import datetime
from login.models import usuario



@login_required
def index(request):
    user = usuario.objects.get(dni=request.user)
    num_aulas = aula.objects.filter(user=user).all().count()
    num_areas = area.objects.filter(user=user).all().count()
    num_institutions = institucion.objects.filter(user=user).all().count()
    num_alumnos = alumnos.objects.filter(user=user).all().count()
    num_incidencias = incidencia.objects.filter(user=user).all().count()

    return render(request, 'index.html', {'num_aulas': num_aulas,
                                          'num_areas': num_areas,
                                          'num_institutions': num_institutions,
                                          'num_alumnos': num_alumnos, 'num_incidencias': num_incidencias})

@login_required
def get_data(request):
    user = usuario.objects.get(dni=request.user)
    num_aulas = aula.objects.filter(estado='INA',user=user).count()
    num_areas = area.objects.filter(estado='INA',user=user).count()
    num_institutions = institucion.objects.filter(estado='INA',user=user).count()
    num_periodos = periodo.objects.filter(estado='INA',user=user).count()
    dicc = {'num_aulas': num_aulas,
            'num_areas': num_areas,
            'num_institutions': num_institutions, 'num_periodos': num_periodos}

    return JsonResponse(json.dumps(dicc), safe=False)

@login_required
def get_data_horario(request):
    fecha = datetime.datetime.now()
    user = usuario.objects.get(dni=request.user)
    dias_semana = {
        0: "LUN",
        1: "MAR",
        2: "MIE",
        3: "JUE",
        4: "VIE",
        5: "SAB",
        6: "DOM"
    }

    dia_actual = dias_semana[fecha.weekday()]

    horarios = horario.objects.filter(dia=dia_actual, estado='ACT',user=user).prefetch_related(Prefetch('aulas', queryset=aula.objects.filter(user=user).all(), to_attr='aula'),
                                                                                     Prefetch('areas', queryset=area.objects.filter(user=user).all(), to_attr='area'))
    lis = []

    for n in horarios:
        dicc = {'Institucion': n.aulas.institucion.nombre,
                'Aula': n.aulas.grado + " "+n.aulas.seccion + "/" + n.aulas.nivel,
                'Area': n.areas.descripcion,
                'Turno': n.turno,
                'Hora_Inicio': str(n.horainicio),
                'Hora_Fin': str(n.horafin),
                }
        lis.append(dicc)
    return JsonResponse(json.dumps(lis), safe=False)
