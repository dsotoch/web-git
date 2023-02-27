from django.urls import path
from dashboard import views

urlpatterns = [
    path('', views.index, name='indexDashboard'),
    path('data/', views.get_data),
    path('Horario/', views.get_data_horario),


]
