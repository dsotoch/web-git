from django.urls import path
from asistencia import views

urlpatterns = [
    path('SaveAssistance/<int:id>/', views.save_assistance),
    path('UpdateAssistance/<aula>/', views.update_assistance),
    path('SaveAssistance/<aula>/', views.get_save_assistance),
    path('UpdateAssistanceData/<int:id>/<date>/', views.update_assistance_data),
    path('GetAssistance/<date>/<int:idaula>/', views.get_assistance),
    path('ReportStudent/<int:id>/',views.generate_pdf),
    path('SavePDF/',views.savePDF),


]
