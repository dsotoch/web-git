from django.urls import path
from horario import views


urlpatterns = [
    path('', views.index, name='indexhorario'),
    path('HorarioSave/', views.horario_save, name='horariosave'),
    path('HorarioDelete/<int:id>/', views.horario_delete, name='horariodelete'),
    path('HorarioStatusChange/<int:id>/', views.horario_status_change),
    path('HorarioUpdate/<int:id>/',views.horario_update),
    path('ClassroomAsiggn/<int:id>/',views.classroom_assign,name='classroomasiggn'),
    path('ClassroomDataAssign/<int:id>/',views.classroom_data_assign),
    path('ClassroomDetails/<int:id>/',views.classroom_details),
    path('UnlinkClassroom/<int:id>/<int:idHorario>/',views.unlink_classroom),






]
