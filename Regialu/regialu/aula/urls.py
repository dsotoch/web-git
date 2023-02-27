from django.contrib import admin
from django.urls import path
from aula import views


urlpatterns = [
    path('', views.index_instituciones, name='indexInstitucion'),
    path('getInstituciones/', views.get_instituciones, name='get_instituciones'),
    path('saveInstituciones/', views.save_instituciones, name='saveInstituciones'),
    path('StatusUpdate/<int:id>/', views.status_change,
         name='updateInstituciones'),
    path('deleteInstituciones/<int:id>/', views.delete_instituciones,
         name='deleteInstituciones'),
    path('updateInstituciones/<int:id>/<int:period>/', views.update_instituciones,
         name='updateInstituciones'),
    path('aula/', views.indexAula, name='indexAula'),
    path('aula/saveAula/', views.save_Aula, name='saveAula'),
    path('aula/allClassrooms/', views.all_Classrooms, name='allClassrooms'),
    path('aula/allClassrooms/chosenInstitution/<int:id>/',
         views.chosen_Institution, name='chosenInstitution'),
    path('aula/allClassrooms/deleteAula/<int:id>/', views.delete_aula,
         name='deleteAula'),
    path('aula/allClassrooms/AulaStatusUpdate/<int:id>/',
         views.aula_status_update, name='aulaStatusUpdate'),
    path('aula/allClassrooms/AulaUpdate/<int:id>/',
         views.aula_update, name='aulaUpdate'),









]
