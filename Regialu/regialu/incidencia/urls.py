from django.urls import path
from incidencia import views

urlpatterns = [
    path('<int:id>/', views.index_incident),
    path('SaveIncident/', views.save_incident),
    path('GetStudentsIncident/<int:id>/', views.get_students),
    path('DeleteIncident/<int:id>/', views.delete_incident),
    path('Pdf/',views.pdf),

]
