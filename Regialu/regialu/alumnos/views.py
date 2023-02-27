from django.shortcuts import render
from periodo.models import periodo
from alumnos.models import alumnos
from django.forms import model_to_dict
from aula.models import institucion, aula
import pandas as pd
from django.http import JsonResponse
import json
from login.models import usuario
from django.contrib import messages
from django.contrib.auth.models import Group
from django.contrib.auth.decorators import login_required, user_passes_test


def mi_funcion(user):
    grupo=Group.objects.get(name='LICENCIA')
    ob=usuario.objects.get(dni=user)
    if ob.groups==grupo:
        return True
    else:
        return False


@user_passes_test(mi_funcion) 
@login_required
def indexAlumnos(request):
    user = usuario.objects.get(dni=request.user)

    periods = periodo.objects.all().filter(estado='ACT', user=user)
    students_amount = alumnos.objects.filter(user=user).all().count()
    
    return render(request, 'studentsload.html', {'cantidadAlumnos': students_amount, 'periods': periods})


@user_passes_test(mi_funcion)
@login_required
def students_all(request):
    user = usuario.objects.get(dni=request.user)

    institutions = institucion.objects.all().filter(estado='ACT', user=user)
    students = alumnos.objects.filter(user=user).all()
    return render(request, 'studentsAll.html', {'institutions': institutions, 'students': students})


@user_passes_test(mi_funcion)
@login_required
def institution_selected(request, id):
    user = usuario.objects.get(dni=request.user)

    institutions = institucion.objects.all().get(idInstitucion=id, user=user)
    students = alumnos.objects.filter(
        aula__institucion=institutions, user=user)

    return render(request, 'institutionSelected.html', {'institutions': institutions, 'students': students})


@user_passes_test(mi_funcion)
@login_required
def students_save(request):
    try:
        if request.method == 'POST':
            user = usuario.objects.get(dni=request.user)

            archivo = request.FILES['file']
            dataframe2 = pd.read_excel(archivo, header=1)
            cantidadRegistros = len(dataframe2)
            if cantidadRegistros > 0:
                # MODELO ALUMNO
                nombresAlumno = dataframe2['NOMBRES'].tolist()
                apellidosAlumno = dataframe2['APELLIDOS'].tolist()
                grade = dataframe2['GRADO'].tolist()

                # GUARDAR ALUMNO
                tamanios = len(apellidosAlumno)
                it4 = tamanios
                while it4 > 0:
                    it4 = it4-1

                    ordenAlumno = alumnos(nombres=nombresAlumno[it4],
                                          apellidos=apellidosAlumno[it4], grado=grade[it4], user=user)
                    ordenAlumno.save()
                students_amount = alumnos.objects.filter(
                    user=user).all().count()
                return JsonResponse({'response': 'success', 'students_amount': students_amount})
            else:
                return JsonResponse({'response': 'null'})
    except Exception as ex:
        print(ex)
        return JsonResponse({'response': 'error'})


@user_passes_test(mi_funcion)
@login_required
def classroom_all(request):
    user = usuario.objects.get(dni=request.user)

    classrooms = aula.objects.all().filter(estado='ACT', user=user)
    data = {}
    for obj in classrooms:
        data[obj.idAula] = obj.grado + " " + \
            obj.seccion + " "+obj.institucion.nombre

    return JsonResponse({'response': data})


@user_passes_test(mi_funcion)
@login_required
def selected_classroom_institution(request, id):
    user = usuario.objects.get(dni=request.user)

    institution = institucion.objects.all().get(idInstitucion=id, user=user)
    classrooms = institution.aula_set.all()
    data = {}
    nivel = ""
    for obj in classrooms:
        if obj.nivel == 'PRI':
            nivel = "Primaria"
        elif obj.nivel == 'SEC':
            nivel = "Secundaria"
        elif obj.nivel == 'SUP':
            nivel = "Superior"
        elif obj.nivel == 'AFI':
            nivel = "Afianzamiento"
        else:
            nivel = "Otro"

        data[obj.idAula] = obj.grado + " " + \
            obj.seccion + " " + nivel + " " + obj.institucion.nombre

    return JsonResponse({'response': data})


@user_passes_test(mi_funcion)
@login_required
def classroom_assign(request):
    user = usuario.objects.get(dni=request.user)

    classrooms = aula.objects.all().filter(estado='ACT', user=user)
    students = alumnos.objects.filter(user=user).all()

    return render(request, 'classroomAssign.html', {'classrooms': classrooms, 'students': students})


@user_passes_test(mi_funcion)
@login_required
def classroom_assign2(request, id):
    user = usuario.objects.get(dni=request.user)

    institution = institucion.objects.all().get(idInstitucion=id, user=user)
    classrooms = institution.aula_set.all()
    students = alumnos.objects.filter(aula__in=classrooms, user=user)

    return render(request, 'selectedclassroomAssign.html', {'students': students, 'institution': institution})


@user_passes_test(mi_funcion)
@login_required
def classroom_assign_save(request):
    try:
        if request.method == 'POST':
            user = usuario.objects.get(dni=request.user)

            data = json.loads(request.body)
            dicc = data.get('data')
            for clave, valor in dicc.items():
                if (valor != '0'):
                    alumno = alumnos.objects.get(idAlumno=clave, user=user)
                    aulas = aula.objects.get(idAula=valor, user=user)
                    alumno.aula = aulas
                    alumno.save()
            return JsonResponse({'response': 'success'})
        else:
            return JsonResponse({'response': 'error'})
    except Exception as ex:
        print(ex)
        return JsonResponse({'response': 'error'})


@user_passes_test(mi_funcion)
@login_required
def save_student(request):
    try:
        if request.method == 'POST':
            user = usuario.objects.get(dni=request.user)

            data = json.loads(request.body)
            surnames = data.get('surnames')
            names = data.get('names')
            grade = data.get('grade')
            idClassroom = data.get('idClassroom')
            classroom = aula.objects.get(idAula=idClassroom, user=user)
            student_exists = alumnos.objects.filter(user=user,
                                                    apellidos=surnames, nombres=names, grado=grade, aula=classroom).count()
            if student_exists > 0:

                return JsonResponse({'response': 'existe'})
            else:
                alumno = alumnos.objects.create(user=user,
                                                apellidos=surnames, nombres=names, grado=grade)
                aulas = aula.objects.get(idAula=idClassroom, user=user)
                alumno.aula = aulas
                alumno.save()
                return JsonResponse({'response': 'success'})

        else:
            return JsonResponse({'response': 'error'})
    except Exception as ex:

        print(ex)
        return JsonResponse({'response': 'error'})


@user_passes_test(mi_funcion)
@login_required
def delete_student(request, id):
    try:
        if request.method == 'DELETE':
            user = usuario.objects.get(dni=request.user)

            alumnos.objects.get(idAlumno=id, user=user).delete()

            return JsonResponse({'response': 'success'})

        else:
            return JsonResponse({'response': 'error'})
    except Exception as ex:

        print(ex)
        return JsonResponse({'response': 'error'})


@user_passes_test(mi_funcion)
@login_required
def update_student(request, id):
    try:
        if request.method == 'PUT':
            user = usuario.objects.get(dni=request.user)

            data = json.loads(request.body)
            names = data.get('names')
            surnames = data.get('surnames')
            object_student = alumnos.objects.get(idAlumno=id, user=user)
            object_student.apellidos = surnames
            object_student.nombres = names
            object_student.save()
            return JsonResponse(model_to_dict(object_student))

        else:
            return JsonResponse({'response': 'error'})
    except Exception as ex:

        print(ex)
        return JsonResponse({'response': 'error'})
