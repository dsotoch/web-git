from django.urls import path, include
from gestion import views
urlpatterns = [
    path('', views.management_view, name='managementview'),
    path('GetInstitutionByPeriod/<int:id>/', views.get_institution_by_period),
    path('GetInstitutionByPeriodSelected/<int:id>/',
         views.get_aulas, name='get_institution_by_period_selected'),
    path('GetStudents/<int:id>/', views.get_students),
    path('GetStudentsHorario/<int:id>/', views.get_students_horario),

    path('Asistencia/', include('asistencia.urls')),
    path('Incidencia/', include('incidencia.urls')),
    path('Notas/', include('notas.urls')),



]
