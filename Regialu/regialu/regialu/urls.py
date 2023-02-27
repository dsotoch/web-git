
from django.contrib import admin
from django.urls import path, include
from configuraciones import views

urlpatterns = [
    
    path('admin/', admin.site.urls),
    path('Instituciones/', include('aula.urls')),
    path('Areas/', include('area.urls')),
    path('Horario/', include('horario.urls')),
    path('Alumnos/', include('alumnos.urls')),
    path('Periodos/', include('periodo.urls')),
    path('Gestion/', include('gestion.urls')),
    path('Dashboard/', include('dashboard.urls')),
    path('Login/', include('login.urls')),
    path('Pagos/', include('pago.urls')),

    path('', views.index, name="index"),



    


    path('Seetings/', views.index, name='configuraciones'),



]
