from django.urls import path
from area import views


urlpatterns = [


    path('', views.index, name='indexarea'),
    path('AreaSave/', views.area_save, name='areasave'),
    path('AreaDelete/<int:id>/', views.area_delete, name='areadelete'),
    path('AreaStatusChange/<int:id>/',
         views.area_status_change, name='areastatus'),






]
