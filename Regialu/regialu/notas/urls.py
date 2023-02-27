from django.urls import path
from notas import views
urlpatterns = [
    path('', views.index_notas),
    path('GetHorario/<int:id>/', views.get_horario),
    path('GetStudentsNote/<int:id>/', views.get_students),
    path('GetNotes/<int:idaula>/<int:idalumno>/<int:areas>/', views.get_notes),

    path('SaveNote/', views.save_note),
    path('UpdateNote/<int:id>/', views.update_note),
    path('pdfSelected/', views.pdf_selected),
    path('Generate/', views.generate_pdf),
    path('Export/', views.export_to_excel, name='export_to_excel'),
]
