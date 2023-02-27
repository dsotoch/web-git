from django.urls import path
from alumnos import views
urlpatterns = [
    path('', views.indexAlumnos, name='indexAlumnos'),
    path('StudentsAll/', views.students_all, name='students_all'),
    path('StudentsSave/', views.students_save, name='students_save'),
    path('ClassroomAssign/', views.classroom_assign, name='classroom_assign'),
        path('ClassroomAssign/<int:id>/', views.classroom_assign2, name='classroom_assign1'),

    path('ClassroomAssignSave/', views.classroom_assign_save),
    path('ClassroomsAll/', views.classroom_all),
    path('selectedclassroominstitution/<int:id>/', views.selected_classroom_institution),

    path('InstitutionSelected/<int:id>/', views.institution_selected),
    path('SaveStudent/',views.save_student),
    path('DeleteStudent/<int:id>/',views.delete_student),
    path('UpdateStudent/<int:id>/',views.update_student),




]
