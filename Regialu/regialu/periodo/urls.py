from django.urls import path
from periodo import views

urlpatterns = [
    path('', views.period_view, name='periodview'),
    path('PeriodSave/', views.period_save),
    path('PeriodDelete/<int:id>/', views.period_delete),
    path('PeriodStateUpdate/<int:id>/',views.period_state_change),

]
